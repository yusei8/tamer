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
app.use('/rachef-uploads', express.static(path.join(__dirname, 'public/rachef-uploads')));

// Chemins vers les fichiers JSON
const dataPath = path.join(__dirname, 'src', 'data.json');
const datapPath = path.join(__dirname, 'src', 'datap.json');
const adminPath = path.join(__dirname, 'admin.json');
const messagesPath = path.join(__dirname, 'msg.json');

// Fonction de chiffrement simple (même que authStore)
const encrypt = (text) => {
  return Buffer.from(text.split('').map(char => 
    String.fromCharCode(char.charCodeAt(0) + 3)
  ).join('')).toString('base64');
};

const decrypt = (encrypted) => {
  try {
    return Buffer.from(encrypted, 'base64').toString().split('').map(char => 
      String.fromCharCode(char.charCodeAt(0) - 3)
    ).join('');
  } catch {
    return '';
  }
};

// Configurer le stockage pour multer
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

// Upload d'image
app.post('/api/upload', (req, res) => {
  console.log('=== DÉBUT UPLOAD ===');
  console.log('Headers:', req.headers);
  console.log('Content-Type:', req.get('Content-Type'));
  
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Erreur Multer:', err);
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ 
            error: 'Fichier trop volumineux', 
            details: 'Taille maximum autorisée: 10MB' 
          });
        }
        return res.status(400).json({ 
          error: 'Erreur de fichier', 
          details: err.message 
        });
      }
      return res.status(500).json({ 
        error: 'Erreur serveur lors de l\'upload', 
        details: err.message 
      });
    }

    if (!req.file) {
      console.log('Aucun fichier reçu dans req.file');
      return res.status(400).json({ 
        error: 'Aucun fichier reçu',
        details: 'Le champ "file" est requis'
      });
    }

    console.log('Fichier reçu:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      filename: req.file.filename
    });

    const filePath = `/rachef-uploads/${req.file.filename}`;
    
    res.json({ 
      success: true, 
      filename: req.file.filename,
      filePath: filePath,
      originalName: req.file.originalname,
      size: req.file.size
    });
    
    console.log('Upload réussi:', filePath);
    console.log('=== FIN UPLOAD ===');
  });
});

// GET data.json
app.get('/api/load-data', (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Erreur lecture data.json' });
    try {
      res.json(JSON.parse(data));
    } catch (e) {
      res.status(500).json({ error: 'data.json corrompu' });
    }
  });
});

// POST data.json
app.post('/api/save-data', (req, res) => {
  fs.writeFile(dataPath, JSON.stringify(req.body, null, 2), 'utf8', (err) => {
    if (err) return res.status(500).json({ error: 'Erreur écriture data.json' });
    res.json({ success: true });
  });
});

// GET datap.json
app.get('/api/load-datap', (req, res) => {
  fs.readFile(datapPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Erreur lecture datap.json' });
    try {
      res.json(JSON.parse(data));
    } catch (e) {
      res.status(500).json({ error: 'datap.json corrompu' });
    }
  });
});

// POST datap.json
app.post('/api/save-datap', (req, res) => {
  fs.writeFile(datapPath, JSON.stringify(req.body, null, 2), 'utf8', (err) => {
    if (err) return res.status(500).json({ error: 'Erreur écriture datap.json' });
    res.json({ success: true });
  });
});

// GET admin.json (données chiffrées)
app.get('/api/load-admins', (req, res) => {
  fs.readFile(adminPath, 'utf8', (err, data) => {
    if (err) {
      // Si le fichier n'existe pas, retourner un objet vide
      if (err.code === 'ENOENT') {
        return res.json({ admins: [] });
      }
      return res.status(500).json({ error: 'Erreur lecture admin.json' });
    }
    try {
      res.json(JSON.parse(data));
    } catch (e) {
      res.status(500).json({ error: 'admin.json corrompu' });
    }
  });
});

// POST admin.json (sauvegarder les données d'admin chiffrées)
app.post('/api/save-admins', (req, res) => {
  fs.writeFile(adminPath, JSON.stringify(req.body, null, 2), 'utf8', (err) => {
    if (err) return res.status(500).json({ error: 'Erreur écriture admin.json' });
    res.json({ success: true });
  });
});

// POST - Sauvegarder un message de contact (chiffré)
app.post('/api/save-message', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Champs obligatoires manquants' });
  }

  // Créer le message avec ID unique et timestamp
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

  // Lire les messages existants
  fs.readFile(messagesPath, 'utf8', (err, data) => {
    let messages = [];
    
    if (err && err.code !== 'ENOENT') {
      return res.status(500).json({ error: 'Erreur lecture msg.json' });
    }
    
    if (!err) {
      try {
        const parsedData = JSON.parse(data);
        messages = parsedData.messages || [];
      } catch (e) {
        console.error('msg.json corrompu, initialisation d\'un nouveau fichier');
      }
    }

    // Ajouter le nouveau message
    messages.unshift(newMessage); // Nouveau message en premier

    // Sauvegarder
    const dataToSave = { messages };
    fs.writeFile(messagesPath, JSON.stringify(dataToSave, null, 2), 'utf8', (err) => {
      if (err) return res.status(500).json({ error: 'Erreur écriture msg.json' });
      res.json({ success: true, messageId: newMessage.id });
    });
  });
});

// GET - Récupérer tous les messages (pour admin)
app.get('/api/load-messages', (req, res) => {
  fs.readFile(messagesPath, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.json({ messages: [] });
      }
      return res.status(500).json({ error: 'Erreur lecture msg.json' });
    }
    
    try {
      const parsedData = JSON.parse(data);
      const messages = parsedData.messages || [];
      
      // Déchiffrer les messages pour l'admin
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
      res.status(500).json({ error: 'msg.json corrompu' });
    }
  });
});

// PUT - Marquer un message comme lu
app.put('/api/mark-message-read/:id', (req, res) => {
  fs.readFile(messagesPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Erreur lecture msg.json' });
    
    try {
      const parsedData = JSON.parse(data);
      const messages = parsedData.messages || [];
      
      const messageIndex = messages.findIndex(msg => msg.id === req.params.id);
      if (messageIndex === -1) {
        return res.status(404).json({ error: 'Message non trouvé' });
      }
      
      messages[messageIndex].read = true;
      
      fs.writeFile(messagesPath, JSON.stringify({ messages }, null, 2), 'utf8', (err) => {
        if (err) return res.status(500).json({ error: 'Erreur écriture msg.json' });
        res.json({ success: true });
      });
    } catch (e) {
      res.status(500).json({ error: 'msg.json corrompu' });
    }
  });
});

// DELETE - Supprimer un message
app.delete('/api/delete-message/:id', (req, res) => {
  fs.readFile(messagesPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Erreur lecture msg.json' });
    
    try {
      const parsedData = JSON.parse(data);
      let messages = parsedData.messages || [];
      
      messages = messages.filter(msg => msg.id !== req.params.id);
      
      fs.writeFile(messagesPath, JSON.stringify({ messages }, null, 2), 'utf8', (err) => {
        if (err) return res.status(500).json({ error: 'Erreur écriture msg.json' });
        res.json({ success: true });
      });
    } catch (e) {
      res.status(500).json({ error: 'msg.json corrompu' });
    }
  });
});

// ========================================
// FILE MANAGER ENDPOINTS
// ========================================

// Middleware de vérification d'authentification pour File Manager
const requireAdminAuth = (req, res, next) => {
  // Pour la démo, nous faisons confiance au frontend pour les vérifications
  // En production, vérifier le token JWT ou la session
  next();
};

// Fonction utilitaire pour calculer la taille d'un dossier
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
      // Ignorer les erreurs d'accès
    }
  };
  
  traverse(folderPath);
  return totalSize;
};

// Obtenir les informations système
app.get('/api/filemanager/system-info', requireAdminAuth, (req, res) => {
  try {
    // Informations RAM
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    
    // Informations CPU
    const cpus = os.cpus();
    const platform = os.platform();
    const arch = os.arch();
    const hostname = os.hostname();
    const uptime = os.uptime();
    
    // Informations disque (pour le répertoire courant)
    const currentPath = path.resolve('./');
    let diskInfo = null;
    
    try {
      if (platform === 'win32') {
        // Windows - utiliser statvfs si disponible, sinon estimation
        const stats = fs.statSync(currentPath);
        diskInfo = {
          total: 500 * 1024 * 1024 * 1024, // 500GB estimation
          free: 200 * 1024 * 1024 * 1024,  // 200GB estimation
          used: 300 * 1024 * 1024 * 1024   // 300GB estimation
        };
      } else {
        // Linux/Mac - utiliser statvfs
        const { execSync } = require('child_process');
        const output = execSync(`df -B1 "${currentPath}"`, { encoding: 'utf8' });
        const lines = output.split('\n');
        const data = lines[1].split(/\s+/);
        
        diskInfo = {
          total: parseInt(data[1]),
          used: parseInt(data[2]),
          free: parseInt(data[3])
        };
      }
    } catch (error) {
      // Fallback avec estimation
      diskInfo = {
        total: 500 * 1024 * 1024 * 1024, // 500GB
        free: 200 * 1024 * 1024 * 1024,  // 200GB libre
        used: 300 * 1024 * 1024 * 1024   // 300GB utilisé
      };
    }
    
    // Taille du projet actuel
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
      disk: {
        total: diskInfo.total,
        used: diskInfo.used,
        free: diskInfo.free,
        percentage: Math.round((diskInfo.used / diskInfo.total) * 100)
      },
      project: {
        size: projectSize,
        path: currentPath
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Erreur récupération informations système', 
      details: error.message 
    });
  }
});

// Explorer les fichiers et dossiers
app.get('/api/filemanager/explore', requireAdminAuth, (req, res) => {
  const targetPath = req.query.path || './';
  const fullPath = path.resolve(targetPath);
  
  // Sécurité : empêcher d'accéder à des répertoires non autorisés
  const rootPath = path.resolve('./');
  if (!fullPath.startsWith(rootPath)) {
    return res.status(403).json({ error: 'Accès non autorisé à ce répertoire' });
  }
  
  try {
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'Répertoire non trouvé' });
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
    
    // Trier : dossiers d'abord, puis fichiers par nom
    items.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
    
    res.json({
      currentPath: path.relative(rootPath, fullPath),
      parentPath: fullPath !== rootPath ? path.relative(rootPath, path.dirname(fullPath)) : null,
      items
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lecture répertoire', details: error.message });
  }
});

// Lire le contenu d'un fichier
app.get('/api/filemanager/read-file', requireAdminAuth, (req, res) => {
  const filePath = req.query.path;
  if (!filePath) {
    return res.status(400).json({ error: 'Chemin de fichier requis' });
  }
  
  const fullPath = path.resolve(filePath);
  const rootPath = path.resolve('./');
  
  if (!fullPath.startsWith(rootPath)) {
    return res.status(403).json({ error: 'Accès non autorisé à ce fichier' });
  }
  
  try {
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'Fichier non trouvé' });
    }
    
    const stats = fs.statSync(fullPath);
    if (!stats.isFile()) {
      return res.status(400).json({ error: 'Pas un fichier' });
    }
    
    // Vérifier si c'est un fichier texte
    const ext = path.extname(fullPath).toLowerCase();
    const textExtensions = ['.txt', '.js', '.ts', '.jsx', '.tsx', '.json', '.css', '.html', '.md', '.env', '.cfg', '.config', '.xml', '.yml', '.yaml'];
    
    if (!textExtensions.includes(ext)) {
      return res.status(400).json({ error: 'Type de fichier non pris en charge pour l\'édition' });
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    res.json({
      content,
      size: stats.size,
      modified: stats.mtime.toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lecture fichier', details: error.message });
  }
});

// Sauvegarder le contenu d'un fichier
app.post('/api/filemanager/save-file', requireAdminAuth, (req, res) => {
  const { path: filePath, content } = req.body;
  
  if (!filePath || content === undefined) {
    return res.status(400).json({ error: 'Chemin et contenu requis' });
  }
  
  const fullPath = path.resolve(filePath);
  const rootPath = path.resolve('./');
  
  if (!fullPath.startsWith(rootPath)) {
    return res.status(403).json({ error: 'Accès non autorisé à ce fichier' });
  }
  
  try {
    // Créer le répertoire parent si nécessaire
    const dirPath = path.dirname(fullPath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    fs.writeFileSync(fullPath, content, 'utf8');
    res.json({ success: true, message: 'Fichier sauvegardé' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur écriture fichier', details: error.message });
  }
});

// Supprimer un fichier ou dossier
app.delete('/api/filemanager/delete', requireAdminAuth, (req, res) => {
  const filePath = req.query.path;
  if (!filePath) {
    return res.status(400).json({ error: 'Chemin requis' });
  }
  
  const fullPath = path.resolve(filePath);
  const rootPath = path.resolve('./');
  
  if (!fullPath.startsWith(rootPath) || fullPath === rootPath) {
    return res.status(403).json({ error: 'Suppression non autorisée' });
  }
  
  try {
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'Fichier/dossier non trouvé' });
    }
    
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      fs.rmSync(fullPath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(fullPath);
    }
    
    res.json({ success: true, message: 'Supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur suppression', details: error.message });
  }
});

// Renommer un fichier ou dossier
app.post('/api/filemanager/rename', requireAdminAuth, (req, res) => {
  const { oldPath, newName } = req.body;
  
  if (!oldPath || !newName) {
    return res.status(400).json({ error: 'Ancien chemin et nouveau nom requis' });
  }
  
  const fullOldPath = path.resolve(oldPath);
  const newPath = path.join(path.dirname(fullOldPath), newName);
  const rootPath = path.resolve('./');
  
  if (!fullOldPath.startsWith(rootPath) || !newPath.startsWith(rootPath)) {
    return res.status(403).json({ error: 'Opération non autorisée' });
  }
  
  try {
    if (!fs.existsSync(fullOldPath)) {
      return res.status(404).json({ error: 'Fichier/dossier non trouvé' });
    }
    
    if (fs.existsSync(newPath)) {
      return res.status(400).json({ error: 'Un fichier avec ce nom existe déjà' });
    }
    
    fs.renameSync(fullOldPath, newPath);
    res.json({ success: true, message: 'Renommé avec succès', newPath: path.relative(rootPath, newPath) });
  } catch (error) {
    res.status(500).json({ error: 'Erreur renommage', details: error.message });
  }
});

// Upload de fichiers pour File Manager
const fileManagerUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = req.body.path || './';
      const fullPath = path.resolve(uploadPath);
      
      // Créer le répertoire si nécessaire
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
      
      cb(null, fullPath);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  }),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  }
});

app.post('/api/filemanager/upload', requireAdminAuth, fileManagerUpload.array('files'), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Aucun fichier reçu' });
    }
    
    const uploadedFiles = req.files.map(file => ({
      originalName: file.originalname,
      filename: file.filename,
      size: file.size,
      path: path.relative(path.resolve('./'), file.path)
    }));
    
    res.json({ success: true, files: uploadedFiles });
  } catch (error) {
    res.status(500).json({ error: 'Erreur upload', details: error.message });
  }
});

// Télécharger un fichier
app.get('/api/filemanager/download', requireAdminAuth, (req, res) => {
  const filePath = req.query.path;
  if (!filePath) {
    return res.status(400).json({ error: 'Chemin requis' });
  }
  
  const fullPath = path.resolve(filePath);
  const rootPath = path.resolve('./');
  
  if (!fullPath.startsWith(rootPath)) {
    return res.status(403).json({ error: 'Accès non autorisé' });
  }
  
  try {
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'Fichier non trouvé' });
    }
    
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      // Créer un zip du dossier
      const archive = archiver('zip', { zlib: { level: 9 } });
      
      res.attachment(`${path.basename(fullPath)}.zip`);
      archive.pipe(res);
      
      archive.directory(fullPath, false);
      archive.finalize();
    } else {
      res.download(fullPath);
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur téléchargement', details: error.message });
  }
});

// Créer une backup complète
app.post('/api/filemanager/backup', requireAdminAuth, (req, res) => {
  try {
    const backupName = `backup-${new Date().toISOString().replace(/[:.]/g, '-')}.zip`;
    const backupPath = path.join(__dirname, 'backups');
    
    // Créer le dossier de backup
    if (!fs.existsSync(backupPath)) {
      fs.mkdirSync(backupPath, { recursive: true });
    }
    
    const archive = archiver('zip', { zlib: { level: 9 } });
    const output = fs.createWriteStream(path.join(backupPath, backupName));
    
    archive.pipe(output);
    
    // Ajouter tous les fichiers du projet, en excluant certains dossiers
    archive.glob('**/*', {
      cwd: __dirname,
      ignore: [
        'node_modules/**',
        'backups/**',
        'dist/**',
        '.git/**',
        '*.log',
        'tmp/**'
      ]
    });
    
    output.on('close', () => {
      res.json({ 
        success: true, 
        message: 'Backup créée avec succès',
        filename: backupName,
        size: archive.pointer()
      });
    });
    
    archive.finalize();
  } catch (error) {
    res.status(500).json({ error: 'Erreur création backup', details: error.message });
  }
});

// Extraire un fichier ZIP
app.post('/api/filemanager/extract-zip', requireAdminAuth, (req, res) => {
  const { zipPath, extractPath, overwrite } = req.body;
  
  if (!zipPath) {
    return res.status(400).json({ error: 'Chemin ZIP requis' });
  }
  
  const fullZipPath = path.resolve(zipPath);
  const fullExtractPath = path.resolve(extractPath || path.dirname(fullZipPath));
  const rootPath = path.resolve('./');
  
  if (!fullZipPath.startsWith(rootPath) || !fullExtractPath.startsWith(rootPath)) {
    return res.status(403).json({ error: 'Opération non autorisée' });
  }
  
  try {
    if (!fs.existsSync(fullZipPath)) {
      return res.status(404).json({ error: 'Fichier ZIP non trouvé' });
    }
    
    const extractedFiles = [];
    
    fs.createReadStream(fullZipPath)
      .pipe(unzipper.Parse())
      .on('entry', (entry) => {
        const fileName = entry.path;
        const type = entry.type;
        const outputPath = path.join(fullExtractPath, fileName);
        
        if (type === 'File') {
          if (!overwrite && fs.existsSync(outputPath)) {
            entry.autodrain();
            return;
          }
          
          // Créer le dossier parent si nécessaire
          const dirPath = path.dirname(outputPath);
          if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
          }
          
          entry.pipe(fs.createWriteStream(outputPath));
          extractedFiles.push(fileName);
        } else {
          entry.autodrain();
        }
      })
      .on('finish', () => {
        res.json({ 
          success: true, 
          message: 'Extraction terminée',
          extractedFiles
        });
      })
      .on('error', (error) => {
        res.status(500).json({ error: 'Erreur extraction', details: error.message });
      });
  } catch (error) {
    res.status(500).json({ error: 'Erreur extraction ZIP', details: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur backend lancé sur http://0.0.0.0:${PORT}`);
}); 
