const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, '../src/data.json'),
  path.join(__dirname, '../src/datap.json'),
];

function cleanBlobs(obj, log = [], parent = '') {
  if (Array.isArray(obj)) {
    return obj.filter((item, idx) => {
      if (typeof item === 'string' && item.startsWith('blob:')) {
        log.push(`Supprimé blob: dans ${parent}[${idx}]`);
        return false;
      }
      if (typeof item === 'object' && item !== null) {
        cleanBlobs(item, log, parent + `[${idx}]`);
      }
      return true;
    });
  } else if (typeof obj === 'object' && obj !== null) {
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === 'string' && obj[key].startsWith('blob:')) {
        log.push(`Supprimé blob: dans ${parent}.${key}`);
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        cleanBlobs(obj[key], log, parent ? parent + '.' + key : key);
      }
    }
  }
  return obj;
}

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8');
  const json = JSON.parse(raw);
  const log = [];
  cleanBlobs(json, log);
  if (log.length) {
    fs.copyFileSync(file, file + '.bak');
    fs.writeFileSync(file, JSON.stringify(json, null, 2), 'utf8');
    console.log(`Nettoyé ${file} :\n` + log.join('\n'));
  } else {
    console.log(`Aucun blob: à nettoyer dans ${file}`);
  }
} 