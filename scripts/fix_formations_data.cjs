const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/data.json');
const datapPath = path.join(__dirname, '../src/datap.json');
const backup = (file) => fs.copyFileSync(file, file + '.bak');

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function main() {
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const datap = JSON.parse(fs.readFileSync(datapPath, 'utf-8'));

  backup(dataPath);
  backup(datapPath);

  const usedIds = new Set();
  const usedPaths = new Set();
  const usedPageIds = new Set();
  let corrections = [];

  data.formations.items.forEach((formation, idx) => {
    // ID unique
    let baseId = formation.id || slugify(formation.title || 'formation' + idx);
    let id = baseId;
    let i = 1;
    while (usedIds.has(id)) {
      id = baseId + i;
      i++;
    }
    if (formation.id !== id) {
      corrections.push(`Formation ${formation.title}: id corrigé de '${formation.id}' à '${id}'`);
      formation.id = id;
    }
    usedIds.add(id);

    // path unique
    let basePath = formation.path || `/formations/${id}`;
    let pathStr = basePath;
    i = 1;
    while (usedPaths.has(pathStr)) {
      pathStr = `/formations/${id}${i}`;
      i++;
    }
    if (formation.path !== pathStr) {
      corrections.push(`Formation ${formation.title}: path corrigé de '${formation.path}' à '${pathStr}'`);
      formation.path = pathStr;
    }
    usedPaths.add(pathStr);

    // pageId unique
    let basePageId = id + 'Formation';
    let pageId = basePageId;
    i = 1;
    while (usedPageIds.has(pageId)) {
      pageId = basePageId + i;
      i++;
    }
    if (formation.pageId !== pageId) {
      corrections.push(`Formation ${formation.title}: pageId corrigé de '${formation.pageId}' à '${pageId}'`);
      formation.pageId = pageId;
    }
    usedPageIds.add(pageId);

    // showOnHome booléen
    if (typeof formation.showOnHome !== 'boolean') {
      formation.showOnHome = !!formation.showOnHome;
      corrections.push(`Formation ${formation.title}: showOnHome corrigé en booléen (${formation.showOnHome})`);
    }

    // Vérifier la page dans datap.json
    if (!datap[pageId]) {
      datap[pageId] = {
        title: formation.title || '',
        description: formation.description || '',
        image: formation.image || '',
        programStructure: [],
        courseContent: [],
        careerOpportunities: [],
        cta: {
          title: `Lancez votre carrière dans ${formation.title || ''}`,
          description: '',
          buttonText: "S'inscrire maintenant"
        }
      };
      corrections.push(`Page ${pageId} ajoutée dans datap.json.`);
    }
  });

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.writeFileSync(datapPath, JSON.stringify(datap, null, 2), 'utf-8');

  console.log('Corrections effectuées :');
  corrections.forEach(c => console.log('- ' + c));
  console.log('Fichiers corrigés et backups créés.');
}

main(); 