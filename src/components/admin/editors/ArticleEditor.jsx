import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Stack,
  IconButton,
  ImageList,
  ImageListItem,
  Chip,
  Divider,
  FormControlLabel,
  Switch,
  CircularProgress
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Upload as UploadIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
  Cancel as CancelIcon,
  Image as ImageIcon,
  BrokenImage as BrokenImageIcon
} from '@mui/icons-material';
import RichTextEditor from '../../RichTextEditor';

const ArticleEditor = ({ 
  article, 
  onSave, 
  onCancel, 
  onDelete,
  onFieldChange,
  articleType,
  loading = false
}) => {
  const editorRef = useRef(null);
  const imageUploadRef = useRef(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredGallery, setHoveredGallery] = useState(false);

  const getSingularType = (type) => {
    const typeMap = {
      'solutions': 'solution',
      'case-studies': 'case study',
      'blog': 'blog post',
      'media': 'media article',
      'resources': 'resource'
    };
    return typeMap[type] || type;
  };

  const capitalizeArticleType = (type) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploadingImages(true);
    try {
      const uploadedImages = [];
      
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await fetch(`http://localhost:3001/api/${articleType}/${article.id}/upload`, {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          const data = await response.json();
          uploadedImages.push(data.url);
        } else {
          console.error('Failed to upload image:', file.name);
          const error = await response.json();
          console.error('Error:', error.error);
        }
      }
      
      if (uploadedImages.length > 0) {
        onFieldChange('images', [...(article.images || []), ...uploadedImages]);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploadingImages(false);
    }
    
    // Reset the input to allow uploading the same file again
    event.target.value = '';
  };

  const handleFileDrop = async (files) => {
    const validFiles = Array.from(files).filter(file => {
      const validTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml', 'video/mp4'];
      return validTypes.includes(file.type);
    });

    if (validFiles.length === 0) {
      alert('Please drop valid image or video files.');
      return;
    }

    setUploadingImages(true);
    try {
      const uploadedImages = [];
      
      for (const file of validFiles) {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await fetch(`http://localhost:3001/api/${articleType}/${article.id}/upload`, {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          const data = await response.json();
          uploadedImages.push(data.url);
        } else {
          console.error('Failed to upload image:', file.name);
        }
      }
      
      if (uploadedImages.length > 0) {
        onFieldChange('images', [...(article.images || []), ...uploadedImages]);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only set isDragging to false if we're leaving the dropzone entirely
    const rect = e.currentTarget.getBoundingClientRect();
    if (
      e.clientX <= rect.left ||
      e.clientX >= rect.right ||
      e.clientY <= rect.top ||
      e.clientY >= rect.bottom
    ) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileDrop(files);
    }
  };

  const removeImage = async (index) => {
    const imageToRemove = article.images[index];
    const updatedImages = article.images.filter((_, i) => i !== index);
    onFieldChange('images', updatedImages);
    
    // If we're removing the card or detail image, clear it
    if (article.cardImage === imageToRemove) {
      onFieldChange('cardImage', '');
    }
    if (article.detailImage === imageToRemove) {
      onFieldChange('detailImage', '');
    }
    
    // Delete the image from the server
    try {
      // Extract the filename from the URL
      const filename = imageToRemove.split('/').pop();
      const response = await fetch(`http://localhost:3001/api/${articleType}/${article.id}/images/${filename}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        console.error('Failed to delete image from server');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleChipDelete = (tagToDelete) => {
    const currentTags = article.tags || [];
    onFieldChange('tags', currentTags.filter(tag => tag !== tagToDelete));
  };

  const handleAddTag = (event) => {
    if (event.key === 'Enter' && event.target.value.trim()) {
      const newTag = event.target.value.trim();
      const currentTags = article.tags || [];
      if (!currentTags.includes(newTag)) {
        onFieldChange('tags', [...currentTags, newTag]);
      }
      event.target.value = '';
    }
  };

  const getPreviewUrl = () => {
    // Convert plural articleType to singular for the route
    const singularType = getSingularType(articleType);
    return `#/${singularType}/detail/${article.id}`;
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Edit {capitalizeArticleType(getSingularType(articleType))} #{article.id}
      </Typography>

      <Stack spacing={3}>
        <FormControlLabel
          control={
            <Switch
              checked={article.featured || false}
              onChange={(e) => onFieldChange('featured', e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: 'var(--Green)',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: 'var(--Green)',
                },
              }}
            />
          }
          label="Featured Article"
          sx={{ 
            color: 'var(--White)',
            '& .MuiFormControlLabel-label': { 
              fontWeight: 600,
              fontSize: '1rem'
            }
          }}
        />
        
        <TextField
          fullWidth
          label="Title"
          value={article.title || ''}
          onChange={(e) => onFieldChange('title', e.target.value)}
          variant="outlined"
          placeholder={`New ${capitalizeArticleType(getSingularType(articleType))}`}
          sx={{ 
            '& .MuiInputBase-input': { color: 'var(--Text)' },
            '& .MuiInputLabel-root': { color: 'var(--White)' }
          }}
        />

        <TextField
          fullWidth
          label="Subtitle"
          value={article.subtitle || ''}
          onChange={(e) => onFieldChange('subtitle', e.target.value)}
          variant="outlined"
          placeholder="Enter a subtitle"
          sx={{ 
            '& .MuiInputBase-input': { color: 'var(--Text)' },
            '& .MuiInputLabel-root': { color: 'var(--White)' }
          }}
        />

        <TextField
          fullWidth
          label="Teaser (for homepage card)"
          value={article.teaser || ''}
          onChange={(e) => onFieldChange('teaser', e.target.value)}
          multiline
          rows={3}
          variant="outlined"
          placeholder="Enter a short description for the homepage card"
          sx={{ 
            '& .MuiInputBase-input': { color: 'var(--Text)' },
            '& .MuiInputLabel-root': { color: 'var(--White)' }
          }}
        />


        <Box>
          <Typography variant="subtitle1" gutterBottom sx={{ color: 'var(--White)', fontWeight: 600 }}>
            Image Gallery
          </Typography>
          <Typography variant="caption" display="block" sx={{ mb: 1, color: 'var(--Gray)' }}>
            Upload images and select which ones to use for card display and banner display
          </Typography>
          <Paper 
            sx={{ 
              p: 2, 
              backgroundColor: 'var(--Dark-Base)',
              position: 'relative',
              border: isDragging ? '2px dashed var(--Blue)' : '1px solid transparent',
              transition: 'border 0.2s ease'
            }}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* Drag overlay */}
            {isDragging && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 123, 255, 0.1)',
                  border: '2px dashed var(--Blue)',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  pointerEvents: 'none'
                }}
              >
                <Box textAlign="center">
                  <UploadIcon sx={{ fontSize: 60, color: 'var(--Blue)', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: 'var(--Blue)' }}>
                    Drop files here to upload
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'var(--Gray)' }}>
                    PNG, JPG, JPEG, GIF, WebP, SVG, MP4
                  </Typography>
                </Box>
              </Box>
            )}
            
            <Box display="flex" alignItems="center" gap={2} mb={2} pb={2} borderBottom="1px solid var(--Border)">
              <input
                type="file"
                accept="image/png,image/jpg,image/jpeg,image/gif,image/webp,image/svg+xml,video/mp4"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                ref={imageUploadRef}
                multiple
              />
              <Button
                variant="contained"
                startIcon={uploadingImages ? <CircularProgress size={20} color="inherit" /> : <UploadIcon />}
                onClick={() => imageUploadRef.current?.click()}
                color="primary"
                disabled={uploadingImages}
              >
                {uploadingImages ? 'Uploading...' : 'Upload Images'}
              </Button>
              <Typography variant="caption" sx={{ color: 'var(--Gray)' }}>
                Drag & drop files here or click to browse
              </Typography>
            </Box>

            {article.images && article.images.length > 0 ? (
              <ImageList 
                cols={4} 
                gap={16}
                onMouseEnter={() => setHoveredGallery(true)}
                onMouseLeave={() => setHoveredGallery(false)}
              >
                {article.images.map((image, index) => (
                  <ImageListItem 
                    key={index}
                    sx={{ 
                      position: 'relative',
                      border: '1px solid var(--Border)',
                      borderRadius: 1,
                      overflow: 'hidden'
                    }}
                  >
                        <img
                      src={image.startsWith('blob:') ? image : `${image}`}
                      alt={`Gallery ${index + 1}`}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml,%3Csvg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23222"%3E%3C/rect%3E%3Cpath d="M75 65L125 65L140 95L140 125L60 125L60 95L75 65Z" stroke="%23444" stroke-width="3" fill="none"%3E%3C/path%3E%3Cpath d="M90 85C90 90.5228 85.5228 95 80 95C74.4772 95 70 90.5228 70 85C70 79.4772 74.4772 75 80 75C85.5228 75 90 79.4772 90 85Z" fill="%23444"%3E%3C/path%3E%3Cpath d="M60 125L80 100L100 115L120 95L140 125" stroke="%23444" stroke-width="3" fill="none"%3E%3C/path%3E%3Cpath d="M50 50L150 150M150 50L50 150" stroke="%23ff3d66" stroke-width="4"%3E%3C/path%3E%3C/svg%3E';
                      }}
                    />
                    {/* Card Badge - Always top-left */}
                    <Chip
                      label="Card"
                      size="small"
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation();
                        onFieldChange('cardImage', article.cardImage === image ? '' : image);
                      }}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        backgroundColor: article.cardImage === image ? 'var(--Blue)' : 'transparent',
                        border: article.cardImage === image ? '2px solid var(--Blue)' : '1px solid var(--Blue)',
                        color: article.cardImage === image ? 'white' : 'var(--Blue)',
                        fontWeight: 600,
                        display: hoveredGallery || article.cardImage === image ? 'flex' : 'none',
                        cursor: 'pointer',
                        zIndex: 2,
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                        '&:hover': {
                          backgroundColor: article.cardImage === image ? 'var(--Blue-Dark, #1976D2)' : 'rgba(43, 180, 198, 0.1)',
                          transform: 'scale(1.05)',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
                        }
                      }}
                    />
                    {/* Banner Badge - Always top-right */}
                    <Chip
                      label="Banner"
                      size="small"
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation();
                        onFieldChange('detailImage', article.detailImage === image ? '' : image);
                      }}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 48, // Adjusted to not overlap with delete button
                        backgroundColor: article.detailImage === image ? 'var(--Blue)' : 'transparent',
                        border: article.detailImage === image ? '2px solid var(--Blue)' : '1px solid var(--Blue)',
                        color: article.detailImage === image ? 'white' : 'var(--Blue)',
                        fontWeight: 600,
                        display: hoveredGallery || article.detailImage === image ? 'flex' : 'none',
                        cursor: 'pointer',
                        zIndex: 2,
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                        '&:hover': {
                          backgroundColor: article.detailImage === image ? 'var(--Blue-Dark, #1976D2)' : 'rgba(43, 180, 198, 0.1)',
                          transform: 'scale(1.05)',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
                        }
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        zIndex: 3,
                        opacity: hoveredGallery ? 1 : 0,
                        transition: 'opacity 0.3s'
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        sx={{
                          backgroundColor: 'error.main',
                          color: 'error.contrastText',
                          '&:hover': { backgroundColor: 'error.dark' }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </ImageListItem>
                ))}
              </ImageList>
            ) : (
              <Box 
                py={8} 
                textAlign="center"
                sx={{
                  border: '2px dashed var(--Border)',
                  borderRadius: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    borderColor: 'var(--Gray)'
                  }
                }}
                onClick={() => imageUploadRef.current?.click()}
              >
                <ImageIcon sx={{ fontSize: 60, color: 'var(--Gray)', mb: 1 }} />
                <Typography variant="body1" sx={{ color: 'var(--White)', mb: 1 }}>
                  Drop images here or click to upload
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--Gray)' }}>
                  Supports PNG, JPG, JPEG, GIF, WebP, SVG, MP4
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom sx={{ color: 'var(--White)', fontWeight: 600 }}>
            Body Content
          </Typography>
          <RichTextEditor
            ref={editorRef}
            value={article.body || ''}
            onChange={(value) => onFieldChange('body', value)}
            images={article.images || []}
            placeholder={`Enter your ${getSingularType(articleType)} content here...`}
          />
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom sx={{ color: 'var(--White)', fontWeight: 600 }}>
            Tags
          </Typography>
          <Paper sx={{ p: 2, backgroundColor: 'var(--Dark-Base)' }}>
            <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
              {(article.tags || []).map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleChipDelete(tag)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
            <TextField
              fullWidth
              size="small"
              placeholder="Type a tag and press Enter"
              onKeyPress={handleAddTag}
              sx={{ 
                '& .MuiInputBase-input': { color: 'var(--Text)' }
              }}
            />
          </Paper>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={onSave}
              disabled={loading}
              color="primary"
            >
              {loading ? 'Saving...' : `Save ${capitalizeArticleType(getSingularType(articleType))}`}
            </Button>
            <Button
              variant="outlined"
              startIcon={<PreviewIcon />}
              onClick={() => window.open(getPreviewUrl(), 'preview_window')}
              color="primary"
            >
              Preview
            </Button>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={onCancel}
              color="secondary"
            >
              Cancel
            </Button>
          </Stack>
          
          {article.id && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={onDelete}
            >
              Delete {capitalizeArticleType(getSingularType(articleType))}
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default ArticleEditor;