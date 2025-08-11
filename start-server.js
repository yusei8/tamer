#!/usr/bin/env node

/**
 * Script de démarrage amélioré pour le serveur
 * Vérifie la configuration et démarre le serveur avec les bonnes options
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Démarrage du serveur...\n');

// Vérifications préliminaires
console.log('🔍 Vérifications préliminaires...');

// Vérifier que le dossier uploads existe
const uploadsDir = path.join(__dirname, 'public', 'rachef-uploads');
if (!fs.existsSync(uploadsDir)) {
  console.log('📁 Création du dossier uploads...');
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Vérifier que les fichiers de données existent
const dataFiles = ['src/data.json', 'src/datap.json', 'admin.json', 'msg.json'];
dataFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.log(`📄 Création du fichier ${file}...`);
    const defaultContent = file.endsWith('admin.json') || file.endsWith('msg.json') 
      ? '{"messages":[],"admins":[]}' 
      : '{}';
    fs.writeFileSync(filePath, defaultContent, 'utf8');
  }
});

console.log('✅ Vérifications terminées\n');

// Démarrer le serveur
console.log('🔄 Démarrage du serveur backend...\n');

const serverProcess = spawn('node', ['server.cjs'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || 'development'
  }
});

serverProcess.on('close', (code) => {
  console.log(`\n🛑 Serveur arrêté avec le code ${code}`);
});

serverProcess.on('error', (err) => {
  console.error('❌ Erreur lors du démarrage du serveur:', err);
});

// Gestionnaire de fermeture propre
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du serveur...');
  serverProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Arrêt du serveur...');
  serverProcess.kill('SIGTERM');
});
