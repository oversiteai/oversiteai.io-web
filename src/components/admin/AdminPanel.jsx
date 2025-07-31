import React, { useState, useEffect } from 'react';
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
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  MenuItem,
  Select,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
  Stack,
  Container,
  Alert
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  CloudUpload as CloudUploadIcon,
  CloudDownload as CloudDownloadIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  StarRate as StarRateIcon
} from '@mui/icons-material';
import { SnackbarProvider as ToastProvider, useSnackbar as useToast } from 'notistack';
import adminTheme from '../../adminTheme';
import { ArticleEditor, FeaturedEditor } from './editors';

function AdminPanelContent() {
  const navigate = useNavigate();
  const { contentType: urlContentType, id: urlId } = useParams();
  const { enqueueSnackbar: enqueueToast } = useToast();
  
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
  const [changesDialogOpen, setChangesDialogOpen] = useState(false);
  const [undoDialogOpen, setUndoDialogOpen] = useState(false);
  const [bulkUpdating, setBulkUpdating] = useState(false);

  // If we have URL parameters, select the article after loading
  useEffect(() => {
    if (urlId && articles.length > 0) {
      const article = articles.find(a => a.id === parseInt(urlId));
      if (article) {
        selectArticle(article);
      }
    }
  }, [urlId, articles]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load all articles on mount and when article type changes
  useEffect(() => {
    // Reset selected article when changing content type
    setSelectedArticle(null);
    setEditedArticle(null);
    setOriginalArticle(null);
    setSelectedArticleIds([]);
    // Clear articles before loading new ones to prevent stale data issues
    setArticles([]);
    loadArticles();
  }, [articleType]); // eslint-disable-line react-hooks/exhaustive-deps

  // Git status checking
  useEffect(() => {
    checkGitStatus();
    const interval = setInterval(checkGitStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkGitStatus = async () => {
    try {
      setGitLoading(true);
      const response = await fetch('http://localhost:3001/api/git/status');
      if (response.ok) {
        const data = await response.json();
        setGitStatus(data);
      }
    } catch (error) {
      console.error('Failed to check git status:', error);
    } finally {
      setGitLoading(false);
    }
  };

  const showToast = (message, variant = 'default') => {
    enqueueToast(message, {
      variant,
      autoHideDuration: 4000,
      anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
    });
  };

  const getSingularType = (type) => {
    const typeMap = {
      'solutions': 'solution',
      'case-studies': 'case study',
      'blog': 'blog post',
      'media': 'media article',
      'resources': 'resource',
      'featured': 'featured section'
    };
    return typeMap[type] || type;
  };

  const capitalizeArticleType = (type) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const loadArticles = async () => {
    setLoading(true);
    const currentType = articleType; // Capture current type to check later
    try {
      // Try API first (for development with backend)
      const response = await fetch(`http://localhost:3001/api/${currentType}`);
      if (response.ok) {
        const data = await response.json();
        // Only update if we're still loading the same type (prevent race conditions)
        if (currentType === articleType) {
          // Ensure data is an array
          if (Array.isArray(data)) {
            setArticles(data);
          } else {
            setArticles([]);
          }
        }
      } else {
        throw new Error('API not available');
      }
    } catch {
      // Fallback to static files - for solutions and featured
      if (currentType === articleType && (currentType === 'solutions' || currentType === 'featured')) {
        const loadedArticles = [];
        const maxItems = currentType === 'featured' ? 5 : 20;
        for (let i = 1; i <= maxItems; i++) {
          try {
            const response = await fetch(`data/${currentType}/${i}.json`);
            if (response.ok) {
              const data = await response.json();
              loadedArticles.push(data);
            }
          } catch {
            if (loadedArticles.length > 0) break;
          }
        }
        if (currentType === articleType) {
          setArticles(loadedArticles);
        }
      } else if (currentType === articleType) {
        setArticles([]);
        showToast(`No ${currentType} articles found. Create a new one to get started!`, 'info');
      }
    }
    if (currentType === articleType) {
      setLoading(false);
    }
  };

  const selectArticle = (article) => {
    if (hasUnsavedChanges()) {
      showToast('You have unsaved changes. Please save or cancel before switching articles.', 'warning');
      return;
    }
    setSelectedArticle(article);
    setEditedArticle({ ...article });
    setOriginalArticle({ ...article });
    navigate(`/admin/articles/${articleType}/${article.id}`);
  };

  const handleFieldChange = (field, value) => {
    setEditedArticle(prev => ({
      ...prev,
      [field]: value
    }));
    
    // If the featured field is being changed, update the articles list to reflect it
    if (field === 'featured' && editedArticle) {
      setArticles(prev => prev.map(article => 
        article.id === editedArticle.id 
          ? { ...article, featured: value }
          : article
      ));
    }
  };

  const hasUnsavedChanges = () => {
    if (!editedArticle || !originalArticle) return false;
    return JSON.stringify(editedArticle) !== JSON.stringify(originalArticle);
  };

  const saveArticle = async () => {
    if (!editedArticle) return;
    
    setSaving(true);
    const isNew = !articles.find(a => a.id === editedArticle.id);
    
    try {
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
        if (isNew) {
          await loadArticles();
        }
        // Update git status to reflect the new changes
        checkGitStatus();
      } else {
        throw new Error('Failed to save');
      }
    } catch {
      showToast('Failed to save. Make sure the API server is running.', 'error');
    }
    setSaving(false);
  };

  const deleteArticle = async () => {
    if (!editedArticle) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/${articleType}/${editedArticle.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const singularType = getSingularType(articleType);
        showToast(`${capitalizeArticleType(singularType)} deleted successfully!`, 'success');
        
        setArticles(prev => prev.filter(a => a.id !== editedArticle.id));
        setSelectedArticle(null);
        setEditedArticle(null);
        setOriginalArticle(null);
        setDeleteDialogOpen(false);
        navigate(`/admin/articles/${articleType}`);
        // Update git status to reflect the deletion
        checkGitStatus();
      } else {
        throw new Error('Failed to delete');
      }
    } catch {
      showToast('Failed to delete. Make sure the API server is running.', 'error');
    }
  };

  const createNewArticle = () => {
    if (hasUnsavedChanges()) {
      showToast('You have unsaved changes. Please save or cancel before creating a new article.', 'warning');
      return;
    }

    const existingIds = articles.map(a => a.id);
    const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    
    let newArticle;
    
    if (articleType === 'featured') {
      // Featured article structure
      newArticle = {
        id: newId,
        slug: '',
        isActive: true,
        order: newId,
        badge: {
          text: 'New Feature',
          icon: {
            viewBox: '0 0 14 15',
            path: '',
            strokeWidth: '1.16667'
          }
        },
        title: {
          text: '',
          highlight: '',
          highlightClass: 'gradient-text'
        },
        subtitle: '',
        features: [],
        cta: {
          text: 'Learn More',
          link: '#contact',
          variant: 'primary'
        },
        terminal: {
          title: 'SYSTEM',
          video: {
            src: '',
            autoplay: true,
            showOnIntersection: true,
            threshold: 0.3
          },
          fallbackImage: '',
          dots: [
            { color: 'blue' },
            { color: 'yellow' },
            { color: 'blue' }
          ],
          statusLines: []
        },
        background: {
          gradient: 'linear-gradient(180deg, #03262B 0%, var(--Dark-Base) 100%)',
          circles: []
        },
        type: articleType
      };
    } else {
      // Standard article structure
      newArticle = {
        id: newId,
        title: '',
        subtitle: '',
        teaser: '',
        primaryImage: '',
        images: [],
        body: '',
        tags: [],
        featured: false,
        type: articleType
      };
    }
    
    setArticles(prev => [...prev, newArticle]);
    selectArticle(newArticle);
  };

  const cancelEdit = () => {
    if (hasUnsavedChanges()) {
      setCancelDialogOpen(true);
    } else {
      setEditedArticle(null);
      setSelectedArticle(null);
      setOriginalArticle(null);
      navigate(`/admin/articles/${articleType}`);
    }
  };

  const confirmCancel = () => {
    setEditedArticle(null);
    setSelectedArticle(null);
    setOriginalArticle(null);
    setCancelDialogOpen(false);
    navigate(`/admin/articles/${articleType}`);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedArticleIds(articles.map(a => a.id));
    } else {
      setSelectedArticleIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedArticleIds.includes(id)) {
      setSelectedArticleIds(prev => prev.filter(selectedId => selectedId !== id));
    } else {
      setSelectedArticleIds(prev => [...prev, id]);
    }
  };

  const deleteSelectedArticles = async () => {
    try {
      const deletePromises = selectedArticleIds.map(id =>
        fetch(`http://localhost:3001/api/${articleType}/${id}`, {
          method: 'DELETE'
        })
      );
      
      const results = await Promise.all(deletePromises);
      const allSuccessful = results.every(r => r.ok);
      
      if (allSuccessful) {
        setArticles(prev => prev.filter(a => !selectedArticleIds.includes(a.id)));
        
        if (selectedArticle && selectedArticleIds.includes(selectedArticle.id)) {
          setSelectedArticle(null);
          setEditedArticle(null);
          setOriginalArticle(null);
        }
        
        const deleted = selectedArticleIds.length;
        setSelectedArticleIds([]);
        setBulkDeleteDialogOpen(false);
        
        const singularType = getSingularType(articleType);
        const articleName = deleted === 1 ? singularType : articleType;
        showToast(`Successfully deleted ${deleted} ${articleName}.`, 'success');
        // Update git status to reflect the deletions
        checkGitStatus();
      } else {
        showToast('Failed to delete articles. Make sure the API server is running.', 'error');
      }
    } catch {
      showToast('Failed to delete articles. Make sure the API server is running.', 'error');
    }
  };

  const toggleSelectedFeatured = async () => {
    setBulkUpdating(true);
    try {
      // Get selected articles
      const selectedArticles = articles.filter(a => selectedArticleIds.includes(a.id));
      
      // Determine the new featured state (if any are not featured, make all featured)
      const hasUnfeatured = selectedArticles.some(a => !a.featured);
      const newFeaturedState = hasUnfeatured;
      
      const response = await fetch(`http://localhost:3001/api/${articleType}/bulk-featured`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: selectedArticleIds,
          featured: newFeaturedState
        })
      });
      
      if (response.ok) {
        // Update local state
        setArticles(prev => prev.map(article => {
          if (selectedArticleIds.includes(article.id)) {
            return { ...article, featured: newFeaturedState };
          }
          return article;
        }));
        
        // Update edited article if it's one of the selected
        if (editedArticle && selectedArticleIds.includes(editedArticle.id)) {
          setEditedArticle(prev => ({ ...prev, featured: newFeaturedState }));
          setOriginalArticle(prev => ({ ...prev, featured: newFeaturedState }));
        }
        
        const updated = selectedArticleIds.length;
        const singularType = getSingularType(articleType);
        const articleName = updated === 1 ? singularType : articleType;
        showToast(`${updated} ${articleName} ${newFeaturedState ? 'featured' : 'unfeatured'} successfully!`, 'success');
        
        // Update git status to reflect the changes
        checkGitStatus();
      } else {
        showToast('Failed to update featured status. Make sure the API server is running.', 'error');
      }
    } catch {
      showToast('Failed to update featured status. Make sure the API server is running.', 'error');
    } finally {
      setBulkUpdating(false);
    }
  };


  const pushChanges = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/git/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: commitMessage || 'Update content via admin panel' })
      });

      if (response.ok) {
        showToast('Changes published successfully!', 'success');
        setPublishDialogOpen(false);
        setCommitMessage('');
        checkGitStatus();
      } else {
        const error = await response.json();
        showToast(`Failed to push: ${error.message}`, 'error');
      }
    } catch {
      showToast('Failed to push changes. Make sure the API server is running.', 'error');
    }
  };

  const pullChanges = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/git/pull', {
        method: 'POST'
      });

      if (response.ok) {
        showToast('Changes pulled successfully!', 'success');
        checkGitStatus();
        loadArticles();
      } else {
        const error = await response.json();
        showToast(`Failed to pull: ${error.message}`, 'error');
      }
    } catch {
      showToast('Failed to pull changes. Make sure the API server is running.', 'error');
    }
  };

  const undoAllChanges = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/git/undo', {
        method: 'POST'
      });

      if (response.ok) {
        showToast('All changes have been reverted!', 'success');
        setUndoDialogOpen(false);
        // Reset the current editing state
        setSelectedArticle(null);
        setEditedArticle(null);
        setOriginalArticle(null);
        // Reload articles and git status
        await loadArticles();
        await checkGitStatus();
      } else {
        const error = await response.json();
        showToast(`Failed to undo changes: ${error.message}`, 'error');
      }
    } catch {
      showToast('Failed to undo changes. Make sure the API server is running.', 'error');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {gitStatus && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent sx={{ py: 2 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h6" sx={{ color: 'var(--Blue)' }}>Content Status:</Typography>
                    {gitLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: gitStatus.changes && gitStatus.changes.length > 0 
                            ? 'var(--Yellow)' 
                            : 'var(--Text)',
                          cursor: gitStatus.changes && gitStatus.changes.length > 0 ? 'pointer' : 'default',
                          fontWeight: gitStatus.changes && gitStatus.changes.length > 0 ? 600 : 400
                        }}
                        onClick={
                          gitStatus.changes && gitStatus.changes.length > 0
                            ? () => setChangesDialogOpen(true)
                            : undefined
                        }
                      >
                        {gitStatus.changes && gitStatus.changes.length > 0
                          ? `${gitStatus.changes.length} unpublished ${gitStatus.changes.length === 1 ? 'change' : 'changes'}`
                          : 'All content published'
                        }
                      </Typography>
                    )}
                  </Box>
                  <Stack direction="row" spacing={2}>
                    {gitStatus.changes && gitStatus.changes.length > 0 && (
                      <Button
                        variant="outlined"
                        color="warning"
                        onClick={() => setUndoDialogOpen(true)}
                        disabled={gitLoading}
                      >
                        Undo All Changes
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      startIcon={<CloudDownloadIcon />}
                      onClick={pullChanges}
                      disabled={gitLoading || !gitStatus.behindRemote}
                    >
                      Pull
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<CloudUploadIcon />}
                      onClick={() => setPublishDialogOpen(true)}
                      disabled={gitLoading || !gitStatus.changes || gitStatus.changes.length === 0}
                    >
                      Publish
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <Card sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ pb: 0 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Content Type</InputLabel>
                <Select
                  value={articleType}
                  onChange={(e) => {
                    const newType = e.target.value;
                    setArticleType(newType);
                    navigate(`/admin/articles/${newType}`);
                  }}
                  label="Content Type"
                >
                  <ListSubheader sx={{ 
                    backgroundColor: 'var(--Dark-Base)', 
                    color: 'var(--Blue)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    lineHeight: '2.5rem',
                    borderBottom: '1px solid var(--Border)',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                  }}>Articles</ListSubheader>
                  <MenuItem value="solutions" sx={{ fontSize: '0.875rem', pl: 3 }}>Solutions</MenuItem>
                  <MenuItem value="case-studies" sx={{ fontSize: '0.875rem', pl: 3 }}>Case Studies</MenuItem>
                  <MenuItem value="blog" sx={{ fontSize: '0.875rem', pl: 3 }}>Blog Posts</MenuItem>
                  <MenuItem value="media" sx={{ fontSize: '0.875rem', pl: 3 }}>Media</MenuItem>
                  <MenuItem value="resources" sx={{ fontSize: '0.875rem', pl: 3 }}>Resources</MenuItem>
                  <ListSubheader sx={{ 
                    backgroundColor: 'var(--Dark-Base)', 
                    color: 'var(--Blue)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    lineHeight: '2.5rem',
                    borderBottom: '1px solid var(--Border)',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    mt: 1
                  }}>Other</ListSubheader>
                  <MenuItem value="featured" sx={{ fontSize: '0.875rem', pl: 3 }}>Featured</MenuItem>
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
                    />
                  }
                  label="All"
                />
              </Box>
            </CardContent>

            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
              <List dense>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <ListItem key={index}>
                      <Skeleton variant="text" width="100%" height={40} />
                    </ListItem>
                  ))
                ) : articles.length > 0 ? (
                  articles.map((article) => (
                    <ListItem
                      key={article.id}
                      disablePadding
                      sx={{ borderBottom: '1px solid var(--Border)' }}
                    >
                      <ListItemButton
                        selected={selectedArticle?.id === article.id}
                        onClick={() => selectArticle(article)}
                        sx={{ 
                          '&.Mui-selected': { 
                            backgroundColor: 'rgba(43, 180, 198, 0.2)',
                            '&:hover': { backgroundColor: 'rgba(43, 180, 198, 0.3)' }
                          },
                          '&:hover': { backgroundColor: 'rgba(43, 180, 198, 0.1)' }
                        }}
                      >
                        <Checkbox
                          edge="start"
                          checked={selectedArticleIds.includes(article.id)}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectOne(article.id);
                          }}
                        />
                        <Tooltip
                          title={typeof article.title === 'object' ? article.title?.text || '' : article.title || ''}
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
                                <Typography variant="body2" noWrap sx={{ color: 'var(--Text)', flex: 1 }}>
                                  {typeof article.title === 'object' ? article.title?.text || 'Untitled' : article.title || 'Untitled'}
                                </Typography>
                                {article.featured && (
                                  <StarIcon sx={{ fontSize: '1rem', color: 'var(--Yellow)' }} />
                                )}
                              </Box>
                            }
                          />
                        </Tooltip>
                      </ListItemButton>
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText 
                      primary={
                        <Typography variant="body2" color="text.secondary">
                          No {articleType} found.
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          Click "New" to create one.
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
              </List>
            </Box>

            <CardContent sx={{ pt: 0 }}>
              <Box display="flex" flexDirection="column" gap={1}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={createNewArticle}
                  color="primary"
                >
                  New {capitalizeArticleType(getSingularType(articleType))}
                </Button>
                {selectedArticleIds.length > 0 && (
                  <Stack spacing={1}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<StarRateIcon />}
                      onClick={toggleSelectedFeatured}
                      disabled={bulkUpdating}
                      sx={{ 
                        borderColor: 'var(--Yellow)',
                        color: 'var(--Yellow)',
                        '&:hover': {
                          borderColor: 'var(--Yellow)',
                          backgroundColor: 'rgba(255, 193, 7, 0.08)'
                        }
                      }}
                    >
                      {bulkUpdating ? 'Updating...' : `Toggle Featured (${selectedArticleIds.length})`}
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => setBulkDeleteDialogOpen(true)}
                    >
                      Delete Selected ({selectedArticleIds.length})
                    </Button>
                  </Stack>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8, lg: 9 }}>
          <Card sx={{ height: '80vh', overflow: 'auto' }}>
            <CardContent>
              {editedArticle ? (
                <>
                  {articleType === 'featured' ? (
                    <FeaturedEditor
                      article={editedArticle}
                      onSave={saveArticle}
                      onCancel={cancelEdit}
                      onDelete={() => setDeleteDialogOpen(true)}
                      onFieldChange={handleFieldChange}
                      loading={saving}
                    />
                  ) : (
                    <ArticleEditor
                      article={editedArticle}
                      articleType={articleType}
                      onSave={saveArticle}
                      onCancel={cancelEdit}
                      onDelete={() => setDeleteDialogOpen(true)}
                      onFieldChange={handleFieldChange}
                      loading={saving}
                    />
                  )}
                </>
              ) : (
                <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                  <Typography variant="h6" color="text.secondary">
                    Select an article to edit or create a new one
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete {capitalizeArticleType(getSingularType(articleType))}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{typeof editedArticle?.title === 'object' ? editedArticle?.title?.text : editedArticle?.title}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={deleteArticle} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Delete Dialog */}
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
          <Button onClick={deleteSelectedArticles} color="error" variant="contained">Delete All</Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>Unsaved Changes</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have unsaved changes. Are you sure you want to discard them?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>Keep Editing</Button>
          <Button onClick={confirmCancel} color="error" variant="contained">Discard Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Publish Dialog */}
      <Dialog
        open={publishDialogOpen}
        onClose={() => setPublishDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Publish Changes</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Enter a description of your changes:
          </DialogContentText>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            placeholder="e.g., Updated solutions content"
            variant="outlined"
            sx={{ mb: 3 }}
          />
          
          {gitStatus?.changes && gitStatus.changes.length > 0 && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'var(--White)' }}>
                Files to be published ({gitStatus.changes.length}):
              </Typography>
              <Box sx={{ 
                maxHeight: '200px', 
                overflow: 'auto', 
                backgroundColor: 'var(--Dark-Secondary)', 
                borderRadius: 1, 
                p: 2,
                border: '1px solid var(--Border)'
              }}>
                {gitStatus.changes.map((change, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      size="small"
                      label={
                        change.status === 'M' ? 'Modified' :
                        change.status === 'A' ? 'Added' :
                        change.status === 'D' ? 'Deleted' :
                        change.status === '??' ? 'New' :
                        change.status === 'R' ? 'Renamed' :
                        change.status
                      }
                      sx={{
                        backgroundColor: 
                          change.status === 'M' ? 'warning.dark' :
                          change.status === 'A' ? 'success.dark' :
                          change.status === 'D' ? 'error.dark' :
                          change.status === '??' ? 'info.dark' :
                          'grey.700',
                        color: 'white',
                        fontSize: '0.75rem',
                        height: '20px',
                        mr: 1
                      }}
                    />
                    <Typography variant="body2" sx={{ 
                      fontFamily: 'monospace', 
                      fontSize: '0.875rem',
                      color: 'var(--Text)'
                    }}>
                      {change.path}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPublishDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={pushChanges} 
            variant="contained" 
            color="success"
            disabled={!commitMessage.trim()}
          >
            Publish
          </Button>
        </DialogActions>
      </Dialog>

      {/* Changes Dialog */}
      <Dialog
        open={changesDialogOpen}
        onClose={() => setChangesDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Unpublished Changes</DialogTitle>
        <DialogContent>
          <List>
            {gitStatus?.changes?.map((change, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={change.path}
                  secondary={
                    <Typography variant="caption" color={
                      change.status === 'M' ? 'warning.main' :
                      change.status === 'A' ? 'success.main' :
                      change.status === 'D' ? 'error.main' :
                      'text.secondary'
                    }>
                      {change.status === 'M' && 'Modified'}
                      {change.status === 'A' && 'Added'}
                      {change.status === 'D' && 'Deleted'}
                      {change.status === '??' && 'Untracked'}
                      {change.status === 'R' && 'Renamed'}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangesDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Undo All Changes Dialog */}
      <Dialog
        open={undoDialogOpen}
        onClose={() => setUndoDialogOpen(false)}
      >
        <DialogTitle>Undo All Changes</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to undo all unpublished changes? This will revert all modifications, additions, and deletions in your content.
          </DialogContentText>
          {gitStatus?.changes && gitStatus.changes.length > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              This will undo {gitStatus.changes.length} {gitStatus.changes.length === 1 ? 'change' : 'changes'} and cannot be reversed.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUndoDialogOpen(false)}>Cancel</Button>
          <Button onClick={undoAllChanges} color="warning" variant="contained">Undo All Changes</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

function AdminPanel() {
  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      <ToastProvider maxSnack={3}>
        <Box sx={{ 
          backgroundColor: 'var(--Dark-Base)',
          minHeight: '100vh',
          pt: '100px' // Increased padding to properly clear the header
        }}>
          <AdminPanelContent />
        </Box>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default AdminPanel;