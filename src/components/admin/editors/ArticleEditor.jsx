import React, { useRef } from 'react';
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
  Divider
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

  const getSingularType = (type) => {
    const typeMap = {
      'solutions': 'solution',
      'case-studies': 'case study',
      'blog': 'blog post',
      'news': 'news article',
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

    // For now, we'll just add the file paths as placeholders
    // In a real implementation, these would be uploaded to a server
    const newImages = files.map(file => URL.createObjectURL(file));
    onFieldChange('images', [...(article.images || []), ...newImages]);
  };

  const removeImage = (index) => {
    const updatedImages = article.images.filter((_, i) => i !== index);
    onFieldChange('images', updatedImages);
    
    // If we're removing the primary image, clear it
    if (article.primaryImage === article.images[index]) {
      onFieldChange('primaryImage', '');
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
    return `/oversiteai.io-web/#/${singularType}/detail/${article.id}`;
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Edit {capitalizeArticleType(getSingularType(articleType))} #{article.id}
      </Typography>

      <Stack spacing={3}>
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
            Primary Image (for card)
          </Typography>
          <Paper sx={{ p: 2, backgroundColor: 'var(--Dark-Base)' }}>
            {article.primaryImage ? (
              <Box
                component="img"
                src={article.primaryImage}
                alt="Primary"
                sx={{ 
                  width: '240px',
                  height: '160px',
                  objectFit: 'cover',
                  borderRadius: 1,
                  border: '1px solid var(--Border)'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml,%3Csvg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23222"%3E%3C/rect%3E%3Cpath d="M75 65L125 65L140 95L140 125L60 125L60 95L75 65Z" stroke="%23444" stroke-width="3" fill="none"%3E%3C/path%3E%3Cpath d="M90 85C90 90.5228 85.5228 95 80 95C74.4772 95 70 90.5228 70 85C70 79.4772 74.4772 75 80 75C85.5228 75 90 79.4772 90 85Z" fill="%23444"%3E%3C/path%3E%3Cpath d="M60 125L80 100L100 115L120 95L140 125" stroke="%23444" stroke-width="3" fill="none"%3E%3C/path%3E%3Cpath d="M50 50L150 150M150 50L50 150" stroke="%23ff3d66" stroke-width="4"%3E%3C/path%3E%3C/svg%3E';
                }}
              />
            ) : (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{ 
                  width: '240px',
                  height: '160px',
                  backgroundColor: 'var(--Dark-Secondary)',
                  borderRadius: 1,
                  border: '1px solid var(--Border)'
                }}
              >
                <BrokenImageIcon sx={{ fontSize: 60, color: 'var(--Gray)' }} />
              </Box>
            )}
            <Typography variant="caption" display="block" sx={{ mt: 1, color: 'var(--Gray)' }}>
              Select an image from the gallery below to set as primary
            </Typography>
          </Paper>
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom sx={{ color: 'var(--White)', fontWeight: 600 }}>
            Image Gallery
          </Typography>
          <Paper sx={{ p: 2, backgroundColor: 'var(--Dark-Base)' }}>
            <Box display="flex" alignItems="center" gap={2} mb={2} pb={2} borderBottom="1px solid var(--Border)">
              <input
                type="file"
                accept="image/png,image/jpg,image/jpeg,image/gif"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                ref={imageUploadRef}
                multiple
              />
              <Button
                variant="contained"
                startIcon={<UploadIcon />}
                onClick={() => imageUploadRef.current?.click()}
                color="primary"
              >
                Upload Images
              </Button>
              <Typography variant="caption" sx={{ color: 'var(--Gray)' }}>
                Accepts: PNG, JPG, JPEG, GIF
              </Typography>
            </Box>

            {article.images && article.images.length > 0 ? (
              <ImageList cols={4} gap={16}>
                {article.images.map((image, index) => (
                  <ImageListItem 
                    key={index}
                    sx={{ 
                      cursor: 'pointer',
                      position: 'relative',
                      border: article.primaryImage === image ? '2px solid var(--Green)' : '1px solid var(--Border)',
                      borderRadius: 1,
                      overflow: 'hidden',
                      '&:hover .delete-overlay': { opacity: 1 }
                    }}
                    onClick={() => onFieldChange('primaryImage', image)}
                  >
                    <img
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml,%3Csvg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="200" height="200" fill="%23222"%3E%3C/rect%3E%3Cpath d="M75 65L125 65L140 95L140 125L60 125L60 95L75 65Z" stroke="%23444" stroke-width="3" fill="none"%3E%3C/path%3E%3Cpath d="M90 85C90 90.5228 85.5228 95 80 95C74.4772 95 70 90.5228 70 85C70 79.4772 74.4772 75 80 75C85.5228 75 90 79.4772 90 85Z" fill="%23444"%3E%3C/path%3E%3Cpath d="M60 125L80 100L100 115L120 95L140 125" stroke="%23444" stroke-width="3" fill="none"%3E%3C/path%3E%3Cpath d="M50 50L150 150M150 50L50 150" stroke="%23ff3d66" stroke-width="4"%3E%3C/path%3E%3C/svg%3E';
                      }}
                    />
                    {article.primaryImage === image && (
                      <Chip
                        label="Primary"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          backgroundColor: 'success.main',
                          color: 'success.contrastText',
                          fontWeight: 600
                        }}
                      />
                    )}
                    <Box
                      className="delete-overlay"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        opacity: 0,
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
              <Box py={4} textAlign="center">
                <ImageIcon sx={{ fontSize: 60, color: 'var(--Gray)', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  No images in gallery. Upload images to add them.
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