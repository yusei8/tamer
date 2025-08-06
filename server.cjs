const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const unzipper = require('unzipper');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/rachef-uploads', express.static(path.join(__dirname, 'public/rachef-uploads')));

// Paths to JSON files
const dataPath = path.join(__dirname, 'src', 'data.json');
const datapPath = path.join(__dirname, 'src', 'datap.json');
const adminPath = path.join(__dirname, 'admin.json');
const messagesPath = path.join(__dirname, 'msg.json');

// Encryption functions
const encrypt = (text) => {
  return Buffer.from(text.split('').map(char => 
    String.fromCharCode(char.charCodeAt(0) + 3)
  .join('')).toString('base64');
};

const decrypt = (encrypted) => {
  try {
    return Buffer.from(encrypted, 'base64').toString().split('').map(char => 
      String.fromCharCode(char.charCodeAt(0) - 3)
    .join('');
  } catch {
    return '';
  }
};

// Multer configuration
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, 'public/rachef-uploads'));
    },
    filename: function (req, file, cb) {
      const timestamp = Date.now();
      const originalName = file.originalname;
      cb(null, `${timestamp}-${originalName}`);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ 
      error: 'No file received',
      details: 'The "file" field is required'
    });
  }

  const filePath = `/rachef-uploads/${req.file.filename}`;
  
  res.json({ 
    success: true, 
    filename: req.file.filename,
    filePath: filePath,
    originalName: req.file.originalname,
    size: req.file.size
  });
});

// Data endpoints
app.get('/api/load-data', (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error reading data.json' });
    try {
      res.json(JSON.parse(data));
    } catch (e) {
      res.status(500).json({ error: 'Corrupted data.json' });
    }
  });
});

app.post('/api/save-data', (req, res) => {
  fs.writeFile(dataPath, JSON.stringify(req.body, null, 2), 'utf8', (err) => {
    if (err) return res.status(500).json({ error: 'Error writing data.json' });
    res.json({ success: true });
  });
});

// Datap endpoints
app.get('/api/load-datap', (req, res) => {
  fs.readFile(datapPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error reading datap.json' });
    try {
      res.json(JSON.parse(data));
    } catch (e) {
      res.status(500).json({ error: 'Corrupted datap.json' });
    }
  });
});

app.post('/api/save-datap', (req, res) => {
  fs.writeFile(datapPath, JSON.stringify(req.body, null, 2), 'utf8', (err) => {
    if (err) return res.status(500).json({ error: 'Error writing datap.json' });
    res.json({ success: true });
  });
});

// Admin endpoints
app.get('/api/load-admins', (req, res) => {
  fs.readFile(adminPath, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.json({ admins: [] });
      }
      return res.status(500).json({ error: 'Error reading admin.json' });
    }
    try {
      res.json(JSON.parse(data));
    } catch (e) {
      res.status(500).json({ error: 'Corrupted admin.json' });
    }
  });
});

app.post('/api/save-admins', (req, res) => {
  fs.writeFile(adminPath, JSON.stringify(req.body, null, 2), 'utf8', (err) => {
    if (err) return res.status(500).json({ error: 'Error writing admin.json' });
    res.json({ success: true });
  });
});

// Message endpoints
app.post('/api/save-message', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newMessage = {
    id: Date.now().toString(),
    name: encrypt(name),
    email: encrypt(email),
    phone: phone ? encrypt(phone) : '',
    subject: encrypt(subject),
    message: encrypt(message),
    timestamp: new Date().toISOString(),
    read: false
  };

  fs.readFile(messagesPath, 'utf8', (err, data) => {
    let messages = [];
    
    if (err && err.code !== 'ENOENT') {
      return res.status(500).json({ error: 'Error reading msg.json' });
    }
    
    if (!err) {
      try {
        messages = JSON.parse(data).messages || [];
      } catch (e) {
        console.error('Corrupted msg.json, creating new file');
      }
    }

    messages.unshift(newMessage);

    fs.writeFile(messagesPath, JSON.stringify({ messages }, null, 2), 'utf8', (err) => {
      if (err) return res.status(500).json({ error: 'Error writing msg.json' });
      res.json({ success: true, messageId: newMessage.id });
    });
  });
});

app.get('/api/load-messages', (req, res) => {
  fs.readFile(messagesPath, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.json({ messages: [] });
      }
      return res.status(500).json({ error: 'Error reading msg.json' });
    }
    
    try {
      const messages = JSON.parse(data).messages || [];
      
      const decryptedMessages = messages.map(msg => ({
        ...msg,
        name: decrypt(msg.name),
        email: decrypt(msg.email),
        phone: msg.phone ? decrypt(msg.phone) : '',
        subject: decrypt(msg.subject),
        message: decrypt(msg.message)
      }));
      
      res.json({ messages: decryptedMessages });
    } catch (e) {
      res.status(500).json({ error: 'Corrupted msg.json' });
    }
  });
});

app.put('/api/mark-message-read/:messageId', (req, res) => {
  fs.readFile(messagesPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error reading msg.json' });
    
    try {
      const messages = JSON.parse(data).messages || [];
      const messageIndex = messages.findIndex(msg => msg.id === req.params.messageId);
      
      if (messageIndex === -1) {
        return res.status(404).json({ error: 'Message not found' });
      }
      
      messages[messageIndex].read = true;
      
      fs.writeFile(messagesPath, JSON.stringify({ messages }, null, 2), 'utf8', (err) => {
        if (err) return res.status(500).json({ error: 'Error writing msg.json' });
        res.json({ success: true });
      });
    } catch (e) {
      res.status(500).json({ error: 'Corrupted msg.json' });
    }
  });
});

app.delete('/api/delete-message/:messageId', (req, res) => {
  fs.readFile(messagesPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error reading msg.json' });
    
    try {
      let messages = JSON.parse(data).messages || [];
      messages = messages.filter(msg => msg.id !== req.params.messageId);
      
      fs.writeFile(messagesPath, JSON.stringify({ messages }, null, 2), 'utf8', (err) => {
        if (err) return res.status(500).json({ error: 'Error writing msg.json' });
        res.json({ success: true });
      });
    } catch (e) {
      res.status(500).json({ error: 'Corrupted msg.json' });
    }
  });
});

// File Manager endpoints
const requireAdminAuth = (req, res, next) => {
  next();
};

const getFolderSize = (folderPath) => {
  let totalSize = 0;
  
  const traverse = (currentPath) => {
    try {
      const items = fs.readdirSync(currentPath);
      
      for (const item of items) {
        const itemPath = path.join(currentPath, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          traverse(itemPath);
        } else {
          totalSize += stats.size;
        }
      }
    } catch (error) {
      console.error(`Error traversing ${currentPath}:`, error);
    }
  };
  
  traverse(folderPath);
  return totalSize;
};

// System info endpoint
app.get('/api/filemanager/system-info', requireAdminAuth, (req, res) => {
  try {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    
    const cpus = os.cpus();
    const platform = os.platform();
    const arch = os.arch();
    const hostname = os.hostname();
    const uptime = os.uptime();
    
    const currentPath = path.resolve('./');
    const projectSize = getFolderSize(currentPath);
    
    res.json({
      success: true,
      system: {
        hostname,
        platform,
        arch,
        uptime: Math.floor(uptime),
        nodeVersion: process.version
      },
      memory: {
        total: totalMemory,
        used: usedMemory,
        free: freeMemory,
        percentage: Math.round((usedMemory / totalMemory) * 100)
      },
      cpu: {
        count: cpus.length,
        model: cpus[0]?.model || 'Unknown',
        speed: cpus[0]?.speed || 0
      },
      project: {
        size: projectSize,
        path: currentPath
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error getting system info', 
      details: error.message 
    });
  }
});

// File explorer endpoint
app.get('/api/filemanager/explore', requireAdminAuth, (req, res) => {
  const targetPath = req.query.path || './';
  const fullPath = path.resolve(targetPath);
  const rootPath = path.resolve('./');
  
  if (!fullPath.startsWith(rootPath)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  try {
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'Directory not found' });
    }
    
    const items = fs.readdirSync(fullPath).map(name => {
      const itemPath = path.join(fullPath, name);
      const stats = fs.statSync(itemPath);
      
      return {
        name,
        path: path.relative(rootPath, itemPath),
        type: stats.isDirectory() ? 'directory' : 'file',
        size: stats.isFile() ? stats.size : null,
        modified: stats.mtime.toISOString(),
        extension: stats.isFile() ? path.extname(name).toLowerCase() : null
      };
    });
    
    items.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    
    res.json({
      currentPath: path.relative(rootPath, fullPath),
      parentPath: fullPath !== rootPath ? path.relative(rootPath, path.dirname(fullPath)) : null,
      items
    });
  } catch (error) {
    res.status(500).json({ error: 'Error reading directory', details: error.message });
  }
});

// Catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});
