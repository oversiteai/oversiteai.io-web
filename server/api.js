import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { exec } from 'child_process';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execAsync = promisify(exec);

const app = express();
app.use(express.json());

// Enable CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// Sanitize filename to remove special characters and spaces
const sanitizeFilename = (filename) => {
  // Get the file extension
  const ext = path.extname(filename).toLowerCase();
  // Get the filename without extension
  let name = path.basename(filename, ext);
  
  // Convert to lowercase for consistency
  name = name.toLowerCase();
  
  // Replace spaces and underscores with hyphens
  name = name.replace(/[\s_]+/g, '-');
  
  // Remove any non-alphanumeric characters except hyphens
  name = name.replace(/[^a-z0-9\-]/g, '');
  
  // Remove multiple consecutive hyphens
  name = name.replace(/-+/g, '-');
  
  // Remove leading and trailing hyphens
  name = name.replace(/^-+|-+$/g, '');
  
  // Limit filename length to 100 characters
  if (name.length > 100) {
    name = name.substring(0, 100);
  }
  
  // If the name is empty after sanitization, use a timestamp
  if (!name) {
    name = `image-${Date.now()}`;
  }
  
  // Add a timestamp suffix to ensure uniqueness
  const timestamp = Date.now();
  const uniqueName = `${name}-${timestamp}`;
  
  return uniqueName + ext;
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const { contentType, id } = req.params;
    const uploadDir = path.join(__dirname, `../public/data/${contentType}/${id}`);
    
    // Create directory if it doesn't exist
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    // Sanitize the filename
    const sanitizedFilename = sanitizeFilename(file.originalname);
    cb(null, sanitizedFilename);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB max file size (for video files)
  },
  fileFilter: (req, file, cb) => {
    // Allow image and video files
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg|mp4/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || file.mimetype === 'video/mp4';
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed (jpg, jpeg, png, gif, webp, svg, mp4)'));
    }
  }
});





// Generic upload endpoint for all content types
app.post('/api/:contentType/:id/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const { contentType, id } = req.params;
    const imageUrl = `data/${contentType}/${id}/${req.file.filename}`;
    
    res.json({ 
      success: true, 
      url: imageUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      sanitizedName: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get images for any content type
app.get('/api/:contentType/:id/images', async (req, res) => {
  try {
    const { contentType, id } = req.params;
    const contentDir = path.join(__dirname, `../public/data/${contentType}/${id}`);
    
    try {
      const files = await fs.readdir(contentDir);
      const images = files
        .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
        .map(filename => ({
          filename,
          url: `data/${contentType}/${id}/${filename}`
        }));
      
      res.json(images);
    } catch {
      // Directory doesn't exist yet
      res.json([]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a single image from any content type
app.delete('/api/:contentType/:id/images/:filename', async (req, res) => {
  try {
    const { contentType, id, filename } = req.params;
    const imagePath = path.join(__dirname, `../public/data/${contentType}/${id}/${filename}`);
    
    // Delete the file
    try {
      await fs.unlink(imagePath);
      res.json({ success: true, message: 'Image deleted successfully' });
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, but that's okay
        res.json({ success: true, message: 'Image already deleted' });
      } else {
        throw error;
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Generic articles endpoints that work for all content types
// Get all articles of a specific type
app.get('/api/:contentType', async (req, res) => {
  try {
    const { contentType } = req.params;
    const dataDir = path.join(__dirname, `../public/data/${contentType}`);
    
    // Check if directory exists
    try {
      await fs.access(dataDir);
    } catch {
      // Directory doesn't exist, return empty array
      return res.json([]);
    }
    
    const files = await fs.readdir(dataDir);
    const articles = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await fs.readFile(path.join(dataDir, file), 'utf-8');
        articles.push(JSON.parse(content));
      }
    }

    articles.sort((a, b) => a.id - b.id);
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new article
app.post('/api/:contentType', async (req, res) => {
  try {
    const { contentType } = req.params;
    const articleData = req.body;
    const { id } = articleData;
    
    // Check if article already exists
    const filePath = path.join(__dirname, `../public/data/${contentType}/${id}.json`);
    try {
      await fs.access(filePath);
      return res.status(409).json({ error: `${contentType} article already exists` });
    } catch {
      // File doesn't exist, we can create it
    }
    
    // Create directory if it doesn't exist
    const dataDir = path.join(__dirname, `../public/data/${contentType}`);
    await fs.mkdir(dataDir, { recursive: true });
    
    // Create the JSON file
    await fs.writeFile(filePath, JSON.stringify(articleData, null, 2));
    
    // Create directory for images if it doesn't exist (for content types that support images)
    if (contentType !== 'featured') {
      const imageDir = path.join(__dirname, `../public/data/${contentType}/${id}`);
      await fs.mkdir(imageDir, { recursive: true });
    }
    
    res.json({ success: true, message: `${contentType} article created successfully`, article: articleData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an article
app.put('/api/:contentType/:id', async (req, res) => {
  try {
    const { contentType, id } = req.params;
    const articleData = req.body;
    
    // Ensure the ID matches
    articleData.id = parseInt(id);
    
    // Create directory if it doesn't exist
    const dataDir = path.join(__dirname, `../public/data/${contentType}`);
    await fs.mkdir(dataDir, { recursive: true });
    
    const filePath = path.join(__dirname, `../public/data/${contentType}/${id}.json`);
    await fs.writeFile(filePath, JSON.stringify(articleData, null, 2));
    
    res.json({ success: true, message: `${contentType} article saved successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an article
app.delete('/api/:contentType/:id', async (req, res) => {
  try {
    const { contentType, id } = req.params;
    
    // Delete JSON file
    const jsonPath = path.join(__dirname, `../public/data/${contentType}/${id}.json`);
    await fs.unlink(jsonPath).catch(() => {}); // Ignore if doesn't exist
    
    // Delete directory and all its contents (for content types with images)
    if (contentType !== 'featured') {
      const dirPath = path.join(__dirname, `../public/data/${contentType}/${id}`);
      await fs.rm(dirPath, { recursive: true, force: true }).catch(() => {});
    }
    
    res.json({ success: true, message: `${contentType} article deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk update featured status
app.post('/api/:contentType/bulk-featured', async (req, res) => {
  try {
    const { contentType } = req.params;
    const { ids, featured } = req.body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'No article IDs provided' });
    }
    
    const dataDir = path.join(__dirname, `../public/data/${contentType}`);
    const updatePromises = [];
    
    for (const id of ids) {
      const filePath = path.join(dataDir, `${id}.json`);
      
      // Read the existing article
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        const article = JSON.parse(content);
        
        // Update the featured status
        article.featured = featured;
        
        // Write back to file
        updatePromises.push(
          fs.writeFile(filePath, JSON.stringify(article, null, 2))
        );
      } catch (error) {
        console.error(`Failed to update article ${id}:`, error);
      }
    }
    
    await Promise.all(updatePromises);
    
    res.json({ 
      success: true, 
      message: `Successfully updated featured status for ${updatePromises.length} articles`,
      updated: updatePromises.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Git status endpoint - checks for changes in public/data directory
app.get('/api/git/status', async (req, res) => {
  try {
    const projectRoot = path.join(__dirname, '..');
    
    // Check for uncommitted changes in public/data
    const { stdout: statusOutput } = await execAsync('git status --porcelain public/data', { cwd: projectRoot });
    const hasLocalChanges = statusOutput.trim().length > 0;
    
    let behindCount = 0;
    let aheadCount = 0;
    
    try {
      // Check if we're behind the remote
      await execAsync('git fetch', { cwd: projectRoot });
      const { stdout: behindOutput } = await execAsync('git rev-list HEAD..origin/main --count', { cwd: projectRoot });
      behindCount = parseInt(behindOutput.trim()) || 0;
      
      // Check if we're ahead of the remote
      const { stdout: aheadOutput } = await execAsync('git rev-list origin/main..HEAD --count', { cwd: projectRoot });
      aheadCount = parseInt(aheadOutput.trim()) || 0;
    } catch (fetchError) {
      // If git fetch fails (e.g., no network), just continue with local status
      console.warn('Git fetch failed (network issue?):', fetchError.message);
    }
    
    // Get list of changed files
    const changedFiles = statusOutput.trim().split('\n').filter(line => line).map(line => {
      const [status, ...pathParts] = line.trim().split(' ');
      return {
        status: status,
        path: pathParts.join(' ')
      };
    });
    
    res.json({
      hasLocalChanges,
      behindRemote: behindCount > 0,
      aheadRemote: aheadCount > 0,
      behindCount,
      aheadCount,
      changes: changedFiles
    });
  } catch (error) {
    console.error('Git status error:', error);
    res.status(500).json({ error: error.message });
  }
});


// Git pull endpoint
app.post('/api/git/pull', async (req, res) => {
  try {
    const projectRoot = path.join(__dirname, '..');
    const { stdout, stderr } = await execAsync('git pull origin main', { cwd: projectRoot });
    
    res.json({
      success: true,
      message: 'Successfully pulled latest changes',
      output: stdout,
      stderr
    });
  } catch (error) {
    console.error('Git pull error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Git undo endpoint - reverts all changes in public/data
app.post('/api/git/undo', async (req, res) => {
  try {
    const projectRoot = path.join(__dirname, '..');
    
    // Clean any untracked files in public/data
    await execAsync('git clean -fd public/data', { cwd: projectRoot });
    
    // Checkout public/data to revert all changes
    await execAsync('git checkout public/data', { cwd: projectRoot });
    
    res.json({
      success: true,
      message: 'Successfully reverted all changes'
    });
  } catch (error) {
    console.error('Git undo error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Git push endpoint - commits and pushes changes in public/data
app.post('/api/git/push', async (req, res) => {
  try {
    const projectRoot = path.join(__dirname, '..');
    const { message = 'Update content via admin panel' } = req.body;
    
    // Add all changes in public/data
    await execAsync('git add public/data', { cwd: projectRoot });
    
    // Commit with message
    const commitMessage = `${message}`;
    await execAsync(`git commit -m "${commitMessage}"`, { cwd: projectRoot });
    
    // Push to remote
    const { stdout } = await execAsync('git push origin main', { cwd: projectRoot });
    
    res.json({
      success: true,
      message: 'Successfully published changes',
      output: stdout
    });
  } catch (error) {
    console.error('Git push error:', error);
    
    // Check if error is because there are no changes to commit
    if (error.message.includes('nothing to commit')) {
      return res.json({
        success: false,
        message: 'No changes to publish',
        noChanges: true
      });
    }
    
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});