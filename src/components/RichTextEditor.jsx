import React, { useRef, useEffect, useState, forwardRef } from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  ImageList,
  ImageListItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Box,
  Typography
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import './RichTextEditor.css';

const RichTextEditor = forwardRef(({ value, onChange, onImageInsert, images = [] }, ref) => {
  const editorRef = useRef(null);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [linkButtonRef, setLinkButtonRef] = useState(null);
  const [savedSelection, setSavedSelection] = useState(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [imageAlignment, setImageAlignment] = useState('center');

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    handleInput();
  };

  const formatBlock = (tag) => {
    execCommand('formatBlock', tag);
  };

  const insertLink = () => {
    if (linkUrl && savedSelection) {
      // Restore focus to editor
      editorRef.current.focus();
      
      // Restore the saved selection
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedSelection);
      
      // Create link with the selected text
      execCommand('createLink', linkUrl);
      
      setShowLinkDialog(false);
      setLinkUrl('');
      setSelectedText('');
      setSavedSelection(null);
    }
  };

  const handleLinkButtonClick = (e) => {
    // Save the current selection
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      setSelectedText(range.toString());
      // Clone the range to preserve it
      setSavedSelection(range.cloneRange());
    }
    setLinkButtonRef(e.currentTarget);
    setShowLinkDialog(true);
  };

  const insertImage = () => {
    if (images.length > 0) {
      setShowImageDialog(true);
    } else if (onImageInsert) {
      // Fallback to upload if no images available
      onImageInsert();
    }
  };

  const handleImageInsert = () => {
    if (selectedImage) {
      editorRef.current.focus();
      
      let imageHtml = '';
      const imgTag = `<img src="${selectedImage}" alt="" style="max-width: 100%; height: auto;">`;
      
      switch (imageAlignment) {
        case 'left':
          imageHtml = `<div style="text-align: left;">${imgTag}</div>`;
          break;
        case 'right':
          imageHtml = `<div style="text-align: right;">${imgTag}</div>`;
          break;
        case 'center':
          imageHtml = `<div style="text-align: center;">${imgTag}</div>`;
          break;
        case 'float-left':
          imageHtml = `<img src="${selectedImage}" alt="" style="float: left; margin: 0 1em 1em 0; max-width: 50%;">`;
          break;
        case 'float-right':
          imageHtml = `<img src="${selectedImage}" alt="" style="float: right; margin: 0 0 1em 1em; max-width: 50%;">`;
          break;
        default:
          imageHtml = imgTag;
      }
      
      document.execCommand('insertHTML', false, imageHtml);
      handleInput();
      
      setShowImageDialog(false);
      setSelectedImage('');
      setImageAlignment('center');
    }
  };

  return (
    <div className="rich-text-editor">
      <div className="editor-toolbar">
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => formatBlock('h2')}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => formatBlock('h3')}
          title="Heading 3"
        >
          H3
        </button>
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => formatBlock('p')}
          title="Paragraph"
        >
          P
        </button>
        
        <div className="toolbar-separator" />
        
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => execCommand('bold')}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => execCommand('italic')}
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => execCommand('underline')}
          title="Underline"
        >
          <u>U</u>
        </button>
        
        <div className="toolbar-separator" />
        
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => execCommand('insertUnorderedList')}
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => execCommand('insertOrderedList')}
          title="Numbered List"
        >
          1. List
        </button>
        
        <div className="toolbar-separator" />
        
        <button
          type="button"
          className="toolbar-btn"
          onClick={handleLinkButtonClick}
          title="Insert Link"
        >
          🔗
        </button>
        <button
          type="button"
          className="toolbar-btn"
          onClick={insertImage}
          title="Insert Image"
          style={{ padding: '0.3vw 0.5vw' }}
        >
          <ImageIcon style={{ fontSize: '1.2vw' }} />
        </button>
      </div>
      
      <div
        ref={editorRef}
        className="editor-content"
        contentEditable
        onInput={handleInput}
        onPaste={(e) => {
          e.preventDefault();
          const text = e.clipboardData.getData('text/html') || e.clipboardData.getData('text/plain');
          document.execCommand('insertHTML', false, text);
          handleInput();
        }}
      />
      
      {showLinkDialog && linkButtonRef && (
        <div 
          className="link-dialog"
          style={{
            position: 'absolute',
            top: linkButtonRef.offsetTop + linkButtonRef.offsetHeight + 5,
            left: linkButtonRef.offsetLeft,
            zIndex: 1000
          }}
        >
          <input
            type="text"
            placeholder="Enter URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                insertLink();
              }
            }}
            autoFocus
          />
          <button onClick={insertLink}>Insert</button>
          <button onClick={() => {
            setShowLinkDialog(false);
            setLinkUrl('');
            setSelectedText('');
            setSavedSelection(null);
          }}>Cancel</button>
        </div>
      )}
      
      {/* Image Selection Dialog */}
      <Dialog
        open={showImageDialog}
        onClose={() => {
          setShowImageDialog(false);
          setSelectedImage('');
          setImageAlignment('center');
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Insert Image</DialogTitle>
        <DialogContent>
          {images.length > 0 ? (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Select an image from the gallery:
              </Typography>
              <ImageList cols={3} gap={16} sx={{ mb: 3 }}>
                {images.map((image, index) => (
                  <ImageListItem
                    key={index}
                    sx={{
                      cursor: 'pointer',
                      border: selectedImage === image ? '2px solid #2BB4C6' : '1px solid #202328',
                      borderRadius: 1,
                      overflow: 'hidden',
                      '&:hover': {
                        borderColor: '#2BB4C6'
                      }
                    }}
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      loading="lazy"
                      style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
              
              <FormControl component="fieldset">
                <FormLabel component="legend">Image Alignment</FormLabel>
                <RadioGroup
                  row
                  value={imageAlignment}
                  onChange={(e) => setImageAlignment(e.target.value)}
                >
                  <FormControlLabel value="left" control={<Radio />} label="Left" />
                  <FormControlLabel value="center" control={<Radio />} label="Center" />
                  <FormControlLabel value="right" control={<Radio />} label="Right" />
                  <FormControlLabel value="float-left" control={<Radio />} label="Float Left" />
                  <FormControlLabel value="float-right" control={<Radio />} label="Float Right" />
                </RadioGroup>
              </FormControl>
            </>
          ) : (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary">
                No images available. Please upload images to the gallery first.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowImageDialog(false);
            setSelectedImage('');
            setImageAlignment('center');
          }}>
            Cancel
          </Button>
          <Button 
            onClick={handleImageInsert} 
            variant="contained" 
            disabled={!selectedImage}
          >
            Insert
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;