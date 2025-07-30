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

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const solutionId = req.params.id;
    const uploadDir = path.join(__dirname, `../public/data/solutions/${solutionId}`);
    
    // Create directory if it doesn't exist
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    // Keep original filename
    cb(null, file.originalname);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    // Only allow image files
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all solutions
app.get('/api/solutions', async (req, res) => {
  try {
    const solutionsDir = path.join(__dirname, '../public/data/solutions');
    const files = await fs.readdir(solutionsDir);
    const solutions = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await fs.readFile(path.join(solutionsDir, file), 'utf-8');
        solutions.push(JSON.parse(content));
      }
    }

    solutions.sort((a, b) => a.id - b.id);
    res.json(solutions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new solution
app.post('/api/solutions', async (req, res) => {
  try {
    const solutionData = req.body;
    const { id } = solutionData;
    
    // Check if solution already exists
    const filePath = path.join(__dirname, `../public/data/solutions/${id}.json`);
    try {
      await fs.access(filePath);
      return res.status(409).json({ error: 'Solution already exists' });
    } catch {
      // File doesn't exist, we can create it
    }
    
    // Create the JSON file
    await fs.writeFile(filePath, JSON.stringify(solutionData, null, 2));
    
    // Create directory for images if it doesn't exist
    const imageDir = path.join(__dirname, `../public/data/solutions/${id}`);
    await fs.mkdir(imageDir, { recursive: true });
    
    res.json({ success: true, message: 'Solution created successfully', solution: solutionData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save a solution
app.put('/api/solutions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const solutionData = req.body;
    
    // Ensure the ID matches
    solutionData.id = parseInt(id);
    
    const filePath = path.join(__dirname, `../public/data/solutions/${id}.json`);
    await fs.writeFile(filePath, JSON.stringify(solutionData, null, 2));
    
    res.json({ success: true, message: 'Solution saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload image for a solution
app.post('/api/solutions/:id/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const imageUrl = `/oversiteai.io-web/data/solutions/${req.params.id}/${req.file.filename}`;
    res.json({ 
      success: true, 
      url: imageUrl,
      filename: req.file.filename 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get images for a solution
app.get('/api/solutions/:id/images', async (req, res) => {
  try {
    const solutionDir = path.join(__dirname, `../public/data/solutions/${req.params.id}`);
    
    try {
      const files = await fs.readdir(solutionDir);
      const images = files
        .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
        .map(filename => ({
          filename,
          url: `/oversiteai.io-web/data/solutions/${req.params.id}/${filename}`
        }));
      
      res.json(images);
    } catch (error) {
      // Directory doesn't exist yet
      res.json([]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a single image from a solution
app.delete('/api/solutions/:id/delete-image', async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'No image URL provided' });
    }
    
    // Extract filename from URL
    const filename = imageUrl.split('/').pop();
    const imagePath = path.join(__dirname, `../public/data/solutions/${id}/${filename}`);
    
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

// Delete a solution (including its directory)
app.delete('/api/solutions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete JSON file
    const jsonPath = path.join(__dirname, `../public/data/solutions/${id}.json`);
    await fs.unlink(jsonPath).catch(() => {}); // Ignore if doesn't exist
    
    // Delete directory and all its contents
    const dirPath = path.join(__dirname, `../public/data/solutions/${id}`);
    await fs.rm(dirPath, { recursive: true, force: true }).catch(() => {});
    
    res.json({ success: true, message: 'Solution deleted successfully' });
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