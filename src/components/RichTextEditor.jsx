import React, { useRef, useEffect, useState, forwardRef } from 'react';
import './RichTextEditor.css';

const RichTextEditor = forwardRef(({ value, onChange, onImageInsert }, ref) => {
  const editorRef = useRef(null);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

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
    if (linkUrl) {
      execCommand('createLink', linkUrl);
      setShowLinkDialog(false);
      setLinkUrl('');
    }
  };

  const insertImage = () => {
    if (onImageInsert) {
      onImageInsert();
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
          onClick={() => setShowLinkDialog(true)}
          title="Insert Link"
        >
          🔗
        </button>
        <button
          type="button"
          className="toolbar-btn"
          onClick={insertImage}
          title="Insert Image"
        >
          🖼️
        </button>
        
        <div className="toolbar-separator" />
        
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => execCommand('removeFormat')}
          title="Clear Formatting"
        >
          Clear
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
      
      {showLinkDialog && (
        <div className="link-dialog">
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
          }}>Cancel</button>
        </div>
      )}
    </div>
  );
});

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;