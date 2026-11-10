/* node scripts/sync-shared.js -> copies shared/hcdt-embed.css into every tool repository (sibling folders) */
const fs = require('fs'), path = require('path');
const src = path.join(__dirname, '..', 'shared', 'hcdt-embed.css');
const targets = ['HCDT_Poster_Generator', 'HCDT_Namecard_Generator', 'HCDT_PPT_Generator', 'HCDT_Toolkit', 'HCPD_Paper_Generator'];
const body = fs.readFileSync(src);
targets.forEach(t => {
  const dir = path.join(__dirname, '..', '..', t);
  if (!fs.existsSync(dir)) { console.log('skip (missing) ' + t); return; }
  fs.writeFileSync(path.join(dir, 'hcdt-embed.css'), body);
  console.log('hcdt-embed.css -> ' + t);
});
