import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  ImageList,
  ImageListItem,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
  Stack,
  Container,
  Badge,
  Grid,
  Alert
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
  Upload as UploadIcon,
  Image as ImageIcon,
  BrokenImage as BrokenImageIcon,
  Description as DescriptionIcon,
  Publish as PublishIcon,
  Sync as SyncIcon,
  CloudUpload as CloudUploadIcon,
  CloudDownload as CloudDownloadIcon
} from '@mui/icons-material';
import { SnackbarProvider as ToastProvider, useSnackbar as useToast } from 'notistack';
import RichTextEditor from './RichTextEditor';
import adminTheme from '../adminTheme';

function AdminPanelContent() {
  const navigate = useNavigate();
  const { contentType: urlContentType, id: urlId } = useParams();
  const { enqueueSnackbar: enqueueToast, closeSnackbar: closeToast } = useToast();
  
  // Debug: Check if theme is loaded
  console.log('Admin Theme:', adminTheme);
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [editedArticle, setEditedArticle] = useState(null);
  const [originalArticle, setOriginalArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [articleType, setArticleType] = useState(urlContentType || 'solutions');
  const [selectedArticleIds, setSelectedArticleIds] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [gitStatus, setGitStatus] = useState(null);
  const [gitLoading, setGitLoading] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');
  const editorRef = useRef(null);
  const imageUploadRef = useRef(null);

  // If we have URL parameters, select the article after loading
  useEffect(() => {
    if (urlId && articles.length > 0) {
      const article = articles.find(a => a.id === parseInt(urlId));
      if (article) {
        selectArticle(article);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlId, articles]);

  // Load all articles on mount and when article type changes
  useEffect(() => {
    loadArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleType]);

  // Check git status periodically
  useEffect(() => {
    checkGitStatus();
    const interval = setInterval(checkGitStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Use notistack for toast notifications
  const showToast = (message, severity = 'success') => {
    enqueueToast(message, { 
      variant: severity,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
      preventDuplicate: false,
      autoHideDuration: 6000,
      // Use our theme's Alert styling
      content: (key, message) => (
        <Alert 
          severity={severity} 
          variant="standard"
          onClose={() => closeToast(key)}
          sx={{ width: '100%', minWidth: '300px' }}
        >
          {message}
        </Alert>
      )
    });
  };

  const loadArticles = async () => {
    setLoading(true);
    // Clear selection when switching article types
    setSelectedArticle(null);
    setEditedArticle(null);
    setOriginalArticle(null);
    setSelectedArticleIds([]);
    
    try {
      // Try API first (for development with backend)
      const response = await fetch(`http://localhost:3001/api/${articleType}`);
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      } else {
        throw new Error('API not available');
      }
    } catch {
      // Fallback to static files - for now only solutions are available
      if (articleType === 'solutions') {
        const loadedArticles = [];
        for (let i = 1; i <= 20; i++) {
          try {
            const response = await fetch(`/oversiteai.io-web/data/${articleType}/${i}.json`);
            if (response.ok) {
              const data = await response.json();
              loadedArticles.push(data);
            }
          } catch {
            if (loadedArticles.length > 0) break;
          }
        }
        setArticles(loadedArticles);
      } else {
        // For other article types, show empty list for now
        setArticles([]);
        showToast(`No ${articleType} articles found. Create a new one to get started!`, 'info');
      }
    }
    setLoading(false);
  };

  const selectArticle = (article) => {
    // Check for unsaved changes before switching
    if (hasUnsavedChanges()) {
      showToast('You have unsaved changes. Please save or cancel before switching articles.', 'warning');
      return;
    }
    
    setSelectedArticle(article);
    setEditedArticle({ ...article });
    setOriginalArticle({ ...article });
  };

  const handleFieldChange = (field, value) => {
    setEditedArticle(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Removed unused functions handleImageChange and addImage
  // Images are now managed through upload and gallery

  const removeImage = async (index) => {
    const imageToDelete = editedArticle.images[index];
    
    try {
      // Make API call to delete the image from the file system
      const response = await fetch(`http://localhost:3001/api/${articleType}/${editedArticle.id}/delete-image`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: imageToDelete })
      });

      if (response.ok) {
        // Remove from the images array only if deletion was successful
        const newImages = editedArticle.images.filter((_, i) => i !== index);
        setEditedArticle(prev => ({
          ...prev,
          images: newImages
        }));
        
        // If this was the primary image, clear it
        if (editedArticle.primaryImage === imageToDelete) {
          setEditedArticle(prev => ({
            ...prev,
            primaryImage: ''
          }));
        }
        
        showToast('Image deleted successfully', 'success');
      } else {
        showToast('Failed to delete image from server', 'error');
      }
    } catch {
      showToast('Error: API server not running. Run "npm run dev:api" to enable image deletion.', 'error');
    }
  };

  const handleTagsChange = (tags) => {
    setEditedArticle(prev => ({
      ...prev,
      tags
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    for (const file of files) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch(`http://localhost:3001/api/${articleType}/${editedArticle.id}/upload`, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          // Add the uploaded image URL to the images array
          setEditedArticle(prev => ({
            ...prev,
            images: [...prev.images, data.url]
          }));
        } else {
          showToast(`Failed to upload ${file.name}`, 'error');
        }
      } catch {
        showToast('Error: API server not running. Run "npm run dev:api" to enable uploads.', 'error');
      }
    }
    
    // Clear the input
    e.target.value = '';
  };

  const saveArticle = async () => {
    setSaving(true);

    try {
      // Check if this is a new article (not yet saved to file)
      const isNew = !articles.find(a => a.id === editedArticle.id && !a.title.startsWith('New '));
      
      // Try to save via API
      const response = await fetch(
        isNew 
          ? `http://localhost:3001/api/${articleType}`
          : `http://localhost:3001/api/${articleType}/${editedArticle.id}`,
        {
          method: isNew ? 'POST' : 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editedArticle)
        }
      );

      if (response.ok) {
        const singularType = getSingularType(articleType);
        showToast(`${capitalizeArticleType(singularType)} ${isNew ? 'created' : 'saved'} successfully!`, 'success');
        setSelectedArticle(editedArticle);
        setOriginalArticle({ ...editedArticle });
        
        // Update the articles list
        setArticles(prev => 
          prev.map(a => a.id === editedArticle.id ? editedArticle : a)
        );
      } else {
        throw new Error('Failed to save');
      }
    } catch {
      // If API fails, show message about needing the backend
      showToast('Error: API server not running. Run "npm run dev:api" in another terminal to enable saving.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteArticle = async () => {
    setSaving(true);

    try {
      const response = await fetch(`http://localhost:3001/api/${articleType}/${editedArticle.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const singularType = getSingularType(articleType);
        showToast(`${capitalizeArticleType(singularType)} deleted successfully!`, 'success');
        
        // Remove from articles list
        setArticles(prev => prev.filter(a => a.id !== editedArticle.id));
        
        // Clear selection
        setSelectedArticle(null);
        setEditedArticle(null);
        setOriginalArticle(null);
        setDeleteDialogOpen(false);
      } else {
        throw new Error('Failed to delete');
      }
    } catch {
      showToast('Error: API server not running. Run "npm run dev:api" in another terminal to enable deletion.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const hasUnsavedChanges = () => {
    if (!editedArticle) return false;
    if (!originalArticle) return true; // New article that hasn't been saved
    return JSON.stringify(editedArticle) !== JSON.stringify(originalArticle);
  };

  // Helper function to get singular form of article type
  const getSingularType = (type) => {
    if (type.endsWith('ies')) {
      return type.slice(0, -3) + 'y';
    } else if (type.endsWith('s')) {
      return type.slice(0, -1);
    }
    return type;
  };

  // Helper function to capitalize article type (handles multi-word types)
  const capitalizeArticleType = (type) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const createNewArticle = () => {
    // Check for unsaved changes
    if (hasUnsavedChanges()) {
      showToast('Please save or cancel your current changes before creating a new article.', 'warning');
      return;
    }
    
    // Find the next available ID
    const maxId = Math.max(...articles.map(a => a.id), 0);
    const newId = maxId + 1;
    
    const articleTypeName = capitalizeArticleType(articleType);
    
    const singularType = getSingularType(articleType);
    const singularTypeName = capitalizeArticleType(singularType);
    
    const newArticle = {
      id: newId,
      title: '',
      subtitle: '',
      teaser: '',
      primaryImage: '',
      images: [],
      body: '',
      tags: [],
      type: articleType // Add article type to the data
    };
    
    // Add to articles list
    setArticles(prev => [...prev, newArticle]);
    
    // Select the new article but mark it as unsaved
    setSelectedArticle(newArticle);
    setEditedArticle({ ...newArticle });
    setOriginalArticle(null); // Keep original as null so hasUnsavedChanges returns true
    
    showToast(`New ${singularType} created. Remember to save your changes!`, 'info');
  };

  const cancelEdit = () => {
    if (hasUnsavedChanges()) {
      setCancelDialogOpen(true);
      return;
    }
    
    performCancel();
  };

  const performCancel = () => {
    // If this was a new article that wasn't saved, remove it from the list
    if (selectedArticle && selectedArticle.title.startsWith('New ') && 
        !articles.find(a => a.id === selectedArticle.id && !a.title.startsWith('New '))) {
      setArticles(prev => prev.filter(a => a.id !== selectedArticle.id));
    }
    
    // Clear selection
    setSelectedArticle(null);
    setEditedArticle(null);
    setOriginalArticle(null);
    setCancelDialogOpen(false);
  };

  const bulkDeleteArticles = async () => {
    setSaving(true);
    let deleted = 0;

    try {
      for (const id of selectedArticleIds) {
        try {
          const response = await fetch(`http://localhost:3001/api/${articleType}/${id}`, {
            method: 'DELETE'
          });
          if (response.ok) {
            deleted++;
          }
        } catch (err) {
          console.error(`Failed to delete article ${id}:`, err);
        }
      }

      if (deleted > 0) {
        // Remove deleted articles from the list
        setArticles(prev => prev.filter(a => !selectedArticleIds.includes(a.id)));
        
        // Clear selections
        setSelectedArticleIds([]);
        if (selectedArticle && selectedArticleIds.includes(selectedArticle.id)) {
          setSelectedArticle(null);
          setEditedArticle(null);
          setOriginalArticle(null);
        }
        
        const singularType = getSingularType(articleType);
        const articleName = deleted === 1 ? singularType : articleType;
        showToast(`Successfully deleted ${deleted} ${articleName}.`, 'success');
      } else {
        showToast('Failed to delete articles. Make sure the API server is running.', 'error');
      }
    } catch {
      showToast('Error: API server not running. Run "npm run dev:api" in another terminal.', 'error');
    } finally {
      setSaving(false);
      setBulkDeleteDialogOpen(false);
    }
  };

  const handleArticleToggle = (id) => {
    setSelectedArticleIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(articleId => articleId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedArticleIds(articles.map(a => a.id));
    } else {
      setSelectedArticleIds([]);
    }
  };

  const handleChipDelete = (tagToDelete) => {
    handleTagsChange(editedArticle.tags.filter(tag => tag !== tagToDelete));
  };

  const handleAddTag = (event) => {
    if (event.key === 'Enter' && event.target.value.trim()) {
      const newTag = event.target.value.trim();
      if (!editedArticle.tags.includes(newTag)) {
        handleTagsChange([...editedArticle.tags, newTag]);
      }
      event.target.value = '';
    }
  };

  // Git status checking
  const checkGitStatus = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/git/status');
      if (response.ok) {
        const status = await response.json();
        setGitStatus(status);
      }
    } catch (error) {
      // Silently fail if API is not running
      console.error('Git status check failed:', error);
    }
  };

  // Git pull
  const handleGitPull = async () => {
    setGitLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/git/pull', {
        method: 'POST'
      });
      
      if (response.ok) {
        showToast('Successfully pulled latest changes', 'success');
        await checkGitStatus();
        await loadArticles(); // Reload articles after pull
      } else {
        showToast('Failed to pull changes', 'error');
      }
    } catch (error) {
      showToast('Error: API server not running', 'error');
    } finally {
      setGitLoading(false);
    }
  };

  // Git push
  const handleGitPush = async () => {
    setGitLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/git/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: commitMessage || 'Update content via admin panel' 
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        showToast('Successfully published changes', 'success');
        setPublishDialogOpen(false);
        setCommitMessage('');
        await checkGitStatus();
      } else if (result.noChanges) {
        showToast('No changes to publish', 'info');
        setPublishDialogOpen(false);
      } else {
        showToast('Failed to publish changes', 'error');
      }
    } catch (error) {
      showToast('Error: API server not running', 'error');
    } finally {
      setGitLoading(false);
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={adminTheme}>
        <CssBaseline />
        <Box className="admin-panel" sx={{ minHeight: '100vh', backgroundColor: 'background.default', pt: '5vw' }}>
          <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
              <CircularProgress size={60} />
            </Box>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      <Box className="admin-panel" sx={{ minHeight: '100vh', backgroundColor: 'background.default', pt: '5vw' }}>
        <Container maxWidth="xl" sx={{ py: 4, position: 'relative' }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h4" component="h1">
              Content Editor
            </Typography>
            {gitStatus && (
              <Box display="flex" gap={1}>
                {gitStatus.behindRemote && (
                  <Chip
                    icon={<CloudDownloadIcon />}
                    label={`${gitStatus.behindCount} behind`}
                    color="warning"
                    size="small"
                    onClick={handleGitPull}
                    disabled={gitLoading}
                  />
                )}
                {gitStatus.hasLocalChanges && (
                  <Chip
                    icon={<CloudUploadIcon />}
                    label={`${gitStatus.changedFiles.length} changes`}
                    color="info"
                    size="small"
                    onClick={() => setPublishDialogOpen(true)}
                    disabled={gitLoading}
                  />
                )}
                {!gitStatus.hasLocalChanges && !gitStatus.behindRemote && (
                  <Chip
                    icon={<SyncIcon />}
                    label="Up to date"
                    color="success"
                    size="small"
                  />
                )}
              </Box>
            )}
          </Box>
          <Box display="flex" gap={2}>
            {gitStatus?.hasLocalChanges && (
              <Button
                variant="contained"
                startIcon={<PublishIcon />}
                onClick={() => setPublishDialogOpen(true)}
                disabled={gitLoading}
                color="primary"
              >
                Publish Changes
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/')}
              sx={{ borderColor: 'var(--Blue)', color: 'var(--Blue)' }}
            >
              Back to Site
            </Button>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <Card sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ pb: 0 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Article Type</InputLabel>
                <Select
                  value={articleType}
                  onChange={(e) => setArticleType(e.target.value)}
                  label="Article Type"
                >
                  <MenuItem value="solutions">Solutions</MenuItem>
                  <MenuItem value="case-studies">Case Studies</MenuItem>
                  <MenuItem value="blog">Blog Posts</MenuItem>
                  <MenuItem value="news">News</MenuItem>
                  <MenuItem value="resources">Resources</MenuItem>
                </Select>
              </FormControl>

              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography variant="h6">
                  {capitalizeArticleType(articleType)}
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedArticleIds.length === articles.length && articles.length > 0}
                      indeterminate={selectedArticleIds.length > 0 && selectedArticleIds.length < articles.length}
                      onChange={handleSelectAll}
                      color="primary"
                    />
                  }
                  label="All"
                  sx={{ m: 0 }}
                />
              </Box>

              <Stack direction="row" spacing={2} mb={2}>
                <Box
                  onClick={() => {
                    if (hasUnsavedChanges()) {
                      showToast('Please save or cancel your current changes before creating a new article.', 'warning');
                    }
                  }}
                  sx={{ display: 'inline-block' }}
                >
                  <Button
                    variant="contained"
                    startIcon={<DescriptionIcon />}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent Box onClick from firing
                      createNewArticle();
                    }}
                    disabled={hasUnsavedChanges()}
                    color="primary"
                  >
                    New {capitalizeArticleType(getSingularType(articleType))}
                  </Button>
                </Box>
                {selectedArticleIds.length > 0 && (
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={() => setBulkDeleteDialogOpen(true)}
                    sx={{ borderColor: 'var(--Red)', color: 'var(--Red)' }}
                  >
                    Delete ({selectedArticleIds.length})
                  </Button>
                )}
              </Stack>
            </CardContent>

            <Divider />

            <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
              {articles.length > 0 ? (
                articles.map(article => (
                  <ListItem
                    key={article.id}
                    disablePadding
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        checked={selectedArticleIds.includes(article.id)}
                        onChange={() => handleArticleToggle(article.id)}
                        color="primary"
                      />
                    }
                  >
                    <ListItemButton
                      selected={selectedArticle?.id === article.id}
                      onClick={() => selectArticle(article)}
                      sx={{
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(43, 180, 198, 0.2)',
                          '&:hover': { backgroundColor: 'rgba(43, 180, 198, 0.3)' }
                        }
                      }}
                    >
                      <Tooltip
                        title={article.title}
                        placement="right"
                        arrow
                        enterDelay={500}
                      >
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="body2" sx={{ color: 'var(--Green)', fontWeight: 600 }}>
                                #{article.id}
                              </Typography>
                              <Typography variant="body2" noWrap sx={{ color: 'var(--Text)' }}>
                                {article.title}
                              </Typography>
                            </Box>
                          }
                        />
                      </Tooltip>
                    </ListItemButton>
                  </ListItem>
                ))
              ) : (
                <Box p={3} textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    No {articleType} found.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Click "New" to create one.
                  </Typography>
                </Box>
              )}
            </List>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8, lg: 9 }}>
          {selectedArticle ? (
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Edit {capitalizeArticleType(getSingularType(articleType))} #{editedArticle.id}
                </Typography>

                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Title"
                    value={editedArticle.title}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
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
                    value={editedArticle.subtitle}
                    onChange={(e) => handleFieldChange('subtitle', e.target.value)}
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
                    value={editedArticle.teaser}
                    onChange={(e) => handleFieldChange('teaser', e.target.value)}
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
                      {editedArticle.primaryImage ? (
                        <Box
                          component="img"
                          src={editedArticle.primaryImage}
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

                      {editedArticle.images.length > 0 ? (
                        <ImageList cols={4} gap={16}>
                          {editedArticle.images.map((image, index) => (
                            <ImageListItem 
                              key={index}
                              sx={{ 
                                cursor: 'pointer',
                                position: 'relative',
                                border: editedArticle.primaryImage === image ? '2px solid var(--Green)' : '1px solid var(--Border)',
                                borderRadius: 1,
                                overflow: 'hidden',
                                '&:hover .delete-overlay': { opacity: 1 }
                              }}
                              onClick={() => handleFieldChange('primaryImage', image)}
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
                              {editedArticle.primaryImage === image && (
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
                      value={editedArticle.body}
                      onChange={(value) => handleFieldChange('body', value)}
                      images={editedArticle.images || []}
                      placeholder={`Enter your ${getSingularType(articleType)} content here...`}
                    />
                  </Box>

                  <Box>
                    <Typography variant="subtitle1" gutterBottom sx={{ color: 'var(--White)', fontWeight: 600 }}>
                      Tags
                    </Typography>
                    <Paper sx={{ p: 2, backgroundColor: 'var(--Dark-Base)' }}>
                      <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                        {editedArticle.tags.map((tag, index) => (
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
                        onClick={saveArticle}
                        disabled={saving}
                        color="primary"
                      >
                        {saving ? 'Saving...' : `Save ${capitalizeArticleType(getSingularType(articleType))}`}
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<PreviewIcon />}
                        onClick={() => window.open(`/oversiteai.io-web/${getSingularType(articleType)}/detail/${editedArticle.id}`, 'preview_window')}
                        color="primary"
                      >
                        Preview
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={cancelEdit}
                        color="inherit"
                      >
                        Cancel
                      </Button>
                    </Stack>
                    <Button
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      onClick={() => setDeleteDialogOpen(true)}
                      disabled={saving}
                      sx={{ borderColor: 'var(--Red)', color: 'var(--Red)' }}
                    >
                      Delete {capitalizeArticleType(getSingularType(articleType))}
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ) : (
            <Card sx={{ height: '100%', minHeight: '400px' }}>
              <CardContent sx={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Typography variant="h6" color="text.secondary">
                  Select a article from the list to edit
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete {capitalizeArticleType(getSingularType(articleType))}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{editedArticle?.title}"? This will also delete all associated images.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={deleteArticle} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk delete confirmation dialog */}
      <Dialog
        open={bulkDeleteDialogOpen}
        onClose={() => setBulkDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Multiple {capitalizeArticleType(articleType)}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedArticleIds.length} {selectedArticleIds.length === 1 ? getSingularType(articleType) : articleType}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={bulkDeleteArticles} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel confirmation dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>Unsaved Changes</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have unsaved changes. Are you sure you want to cancel?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>Continue Editing</Button>
          <Button onClick={performCancel} color="error">
            Discard Changes
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Publish dialog */}
      <Dialog
        open={publishDialogOpen}
        onClose={() => setPublishDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Publish Changes</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            The following files will be published:
          </DialogContentText>
          {gitStatus?.changedFiles && (
            <Paper variant="outlined" sx={{ p: 2, mb: 2, maxHeight: 200, overflowY: 'auto' }}>
              {gitStatus.changedFiles.map((file, index) => (
                <Typography key={index} variant="body2" sx={{ fontFamily: 'monospace' }}>
                  {file.status} {file.path}
                </Typography>
              ))}
            </Paper>
          )}
          <TextField
            fullWidth
            label="Commit Message"
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            placeholder="Update content via admin panel"
            multiline
            rows={2}
            variant="outlined"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPublishDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleGitPush} 
            color="primary" 
            variant="contained"
            disabled={gitLoading}
            startIcon={gitLoading ? <CircularProgress size={20} /> : <PublishIcon />}
          >
            {gitLoading ? 'Publishing...' : 'Publish'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
      </Box>
    </ThemeProvider>
  );
}

// Wrapper component to provide notistack
function AdminPanel() {
  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      <ToastProvider 
        maxSnack={5}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        dense
        preventDuplicate={false}
      >
        <style>
          {`
            .notistack-SnackbarContainer {
              top: 250px !important;
            }
          `}
        </style>
        <AdminPanelContent />
      </ToastProvider>
    </ThemeProvider>
  );
}

export default AdminPanel;