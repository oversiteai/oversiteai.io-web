import React from 'react';
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Stack,
  Divider,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

const FeaturedEditor = ({ 
  article, 
  onSave, 
  onCancel, 
  onDelete,
  onFieldChange,
  loading = false
}) => {
  
  const handleFeatureAdd = () => {
    const newFeature = {
      id: `feature_${Date.now()}`,
      text: '',
      icon: {
        viewBox: '0 0 22 22',
        path: '',
        strokeWidth: '1.5'
      }
    };
    onFieldChange('features', [...(article.features || []), newFeature]);
  };

  const handleFeatureChange = (index, field, value) => {
    const updatedFeatures = [...article.features];
    if (field === 'text') {
      updatedFeatures[index] = { ...updatedFeatures[index], text: value };
    } else if (field.startsWith('icon.')) {
      const iconField = field.split('.')[1];
      updatedFeatures[index] = {
        ...updatedFeatures[index],
        icon: { ...updatedFeatures[index].icon, [iconField]: value }
      };
    }
    onFieldChange('features', updatedFeatures);
  };

  const handleFeatureRemove = (index) => {
    const updatedFeatures = article.features.filter((_, i) => i !== index);
    onFieldChange('features', updatedFeatures);
  };

  const handleStatusLineAdd = () => {
    const newStatusLine = {
      prefix: '',
      value: '',
      valueColor: '#4DFFB0',
      isCommand: false
    };
    const currentStatusLines = article.terminal?.statusLines || [];
    onFieldChange('terminal', { 
      ...article.terminal, 
      statusLines: [...currentStatusLines, newStatusLine]
    });
  };

  const handleStatusLineChange = (index, field, value) => {
    const updatedLines = [...article.terminal.statusLines];
    updatedLines[index] = { ...updatedLines[index], [field]: value };
    onFieldChange('terminal', { 
      ...article.terminal, 
      statusLines: updatedLines 
    });
  };

  const handleStatusLineRemove = (index) => {
    const updatedLines = article.terminal.statusLines.filter((_, i) => i !== index);
    onFieldChange('terminal', { 
      ...article.terminal, 
      statusLines: updatedLines 
    });
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Edit Featured Section #{article.id}
      </Typography>

      <Stack spacing={3}>
        {/* Title Configuration */}
        <TextField
          fullWidth
          label="Title Text"
          value={article.title?.text || ''}
          onChange={(e) => onFieldChange('title', { ...article.title, text: e.target.value })}
          variant="outlined"
          placeholder="Enter the full title text"
          sx={{ 
            '& .MuiInputBase-input': { color: 'var(--Text)' },
            '& .MuiInputLabel-root': { color: 'var(--White)' }
          }}
        />
        
        <TextField
          fullWidth
          label="Title Highlight"
          value={article.title?.highlight || ''}
          onChange={(e) => onFieldChange('title', { ...article.title, highlight: e.target.value })}
          variant="outlined"
          placeholder="Part of title to highlight (e.g., DARKWATER)"
          sx={{ 
            '& .MuiInputBase-input': { color: 'var(--Text)' },
            '& .MuiInputLabel-root': { color: 'var(--White)' }
          }}
        />
        
        <TextField
          fullWidth
          label="Slug"
          value={article.slug || ''}
          onChange={(e) => onFieldChange('slug', e.target.value)}
          variant="outlined"
          placeholder="URL-friendly identifier"
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
          label="Badge Text"
          value={article.badge?.text || ''}
          onChange={(e) => onFieldChange('badge', { ...article.badge, text: e.target.value })}
          variant="outlined"
          placeholder="e.g., Flagship System"
          sx={{ 
            '& .MuiInputBase-input': { color: 'var(--Text)' },
            '& .MuiInputLabel-root': { color: 'var(--White)' }
          }}
        />

        {/* Terminal Configuration */}
        <Box>
          <Typography variant="subtitle1" gutterBottom sx={{ color: 'var(--White)', fontWeight: 600 }}>
            Terminal Configuration
          </Typography>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Terminal Title"
              value={article.terminal?.title || ''}
              onChange={(e) => onFieldChange('terminal', { ...article.terminal, title: e.target.value })}
              variant="outlined"
              sx={{ 
                '& .MuiInputBase-input': { color: 'var(--Text)' },
                '& .MuiInputLabel-root': { color: 'var(--White)' }
              }}
            />
            
            <TextField
              fullWidth
              label="Video Source"
              value={article.terminal?.video?.src || ''}
              onChange={(e) => onFieldChange('terminal', { 
                ...article.terminal, 
                video: { ...article.terminal?.video, src: e.target.value }
              })}
              variant="outlined"
              placeholder="e.g., video/stormbringer.mp4"
              sx={{ 
                '& .MuiInputBase-input': { color: 'var(--Text)' },
                '& .MuiInputLabel-root': { color: 'var(--White)' }
              }}
            />
            
            <TextField
              fullWidth
              label="Fallback Image"
              value={article.terminal?.fallbackImage || ''}
              onChange={(e) => onFieldChange('terminal', { ...article.terminal, fallbackImage: e.target.value })}
              variant="outlined"
              placeholder="Image to show after video ends"
              sx={{ 
                '& .MuiInputBase-input': { color: 'var(--Text)' },
                '& .MuiInputLabel-root': { color: 'var(--White)' }
              }}
            />
          </Stack>
        </Box>

        {/* Terminal Status Lines */}
        <Box>
          <Typography variant="subtitle1" gutterBottom sx={{ color: 'var(--White)', fontWeight: 600 }}>
            Terminal Status Lines
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleStatusLineAdd}
            sx={{ mb: 2 }}
          >
            Add Status Line
          </Button>
          
          {article.terminal?.statusLines?.map((line, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2, backgroundColor: 'var(--Dark-Base)' }}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label={`Line ${index + 1} Prefix`}
                  value={line.prefix}
                  onChange={(e) => handleStatusLineChange(index, 'prefix', e.target.value)}
                  variant="outlined"
                  placeholder="e.g., ✓ Quantum encryption:"
                  sx={{ 
                    '& .MuiInputBase-input': { color: 'var(--Text)' },
                    '& .MuiInputLabel-root': { color: 'var(--White)' }
                  }}
                />
                
                {!line.isCommand && (
                  <>
                    <TextField
                      fullWidth
                      label="Value"
                      value={line.value || ''}
                      onChange={(e) => handleStatusLineChange(index, 'value', e.target.value)}
                      variant="outlined"
                      placeholder="e.g., ACTIVE"
                      sx={{ 
                        '& .MuiInputBase-input': { color: 'var(--Text)' },
                        '& .MuiInputLabel-root': { color: 'var(--White)' }
                      }}
                    />
                    
                    <TextField
                      fullWidth
                      label="Value Color"
                      value={line.valueColor || ''}
                      onChange={(e) => handleStatusLineChange(index, 'valueColor', e.target.value)}
                      variant="outlined"
                      placeholder="e.g., #4DFFB0"
                      sx={{ 
                        '& .MuiInputBase-input': { color: 'var(--Text)' },
                        '& .MuiInputLabel-root': { color: 'var(--White)' }
                      }}
                    />
                  </>
                )}
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={line.isCommand || false}
                      onChange={(e) => handleStatusLineChange(index, 'isCommand', e.target.checked)}
                    />
                  }
                  label="Command Line (no value)"
                />
                
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleStatusLineRemove(index)}
                >
                  Remove Line
                </Button>
              </Stack>
            </Paper>
          ))}
        </Box>

        {/* Features */}
        <Box>
          <Typography variant="subtitle1" gutterBottom sx={{ color: 'var(--White)', fontWeight: 600 }}>
            Features
          </Typography>
          <Typography variant="caption" sx={{ color: 'var(--Gray)', display: 'block', mb: 2 }}>
            Add features to display in the featured section
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleFeatureAdd}
            sx={{ mb: 2 }}
          >
            Add Feature
          </Button>
          
          {article.features?.map((feature, index) => (
            <Paper key={feature.id} sx={{ p: 2, mb: 2, backgroundColor: 'var(--Dark-Base)' }}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label={`Feature ${index + 1} Text`}
                  value={feature.text}
                  onChange={(e) => handleFeatureChange(index, 'text', e.target.value)}
                  variant="outlined"
                  sx={{ 
                    '& .MuiInputBase-input': { color: 'var(--Text)' },
                    '& .MuiInputLabel-root': { color: 'var(--White)' }
                  }}
                />
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleFeatureRemove(index)}
                >
                  Remove Feature
                </Button>
              </Stack>
            </Paper>
          ))}
        </Box>

        {/* Call to Action */}
        <Box>
          <Typography variant="subtitle1" gutterBottom sx={{ color: 'var(--White)', fontWeight: 600 }}>
            Call to Action
          </Typography>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="CTA Text"
              value={article.cta?.text || ''}
              onChange={(e) => onFieldChange('cta', { ...article.cta, text: e.target.value })}
              variant="outlined"
              sx={{ 
                '& .MuiInputBase-input': { color: 'var(--Text)' },
                '& .MuiInputLabel-root': { color: 'var(--White)' }
              }}
            />
            
            <TextField
              fullWidth
              label="CTA Link"
              value={article.cta?.link || ''}
              onChange={(e) => onFieldChange('cta', { ...article.cta, link: e.target.value })}
              variant="outlined"
              placeholder="e.g., #contact"
              sx={{ 
                '& .MuiInputBase-input': { color: 'var(--Text)' },
                '& .MuiInputLabel-root': { color: 'var(--White)' }
              }}
            />
          </Stack>
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
              {loading ? 'Saving...' : 'Save Featured Section'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<PreviewIcon />}
              onClick={() => window.open('/oversiteai.io-web/', 'preview_window')}
              color="primary"
            >
              Preview Homepage
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
              Delete Featured Section
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default FeaturedEditor;