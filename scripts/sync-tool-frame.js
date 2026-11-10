/* node scripts/sync-tool-frame.js  -> inlines assets/js/tool-frame.js into every page that carries the markers */
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'assets/js/tool-frame.js'), 'utf8').replace(/\r\n/g, '\n').trimEnd();
const START = '/* tool-frame:start */', END = '/* tool-frame:end */';
let ok = 0;
['index.html', 'wordpress/visual-guideline-block.html'].forEach(f => {
  const p = path.join(root, f); let s = fs.readFileSync(p, 'utf8'); const nl = s.includes('\r\n') ? '\r\n' : '\n';
  const a = s.indexOf(START), b = s.indexOf(END);
  if (a < 0 || b < 0) { console.error('markers missing in ' + f); process.exitCode = 1; return; }
  s = s.slice(0, a) + START + nl + src.replace(/\n/g, nl) + nl + END + s.slice(b + END.length);
  fs.writeFileSync(p, s); ok++; console.log('synced ' + f);
});
console.log(ok + ' file(s) synced');
