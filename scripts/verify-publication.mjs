import fs from 'node:fs/promises';
const base=process.env.SENTINEL_PUBLIC_URL||'https://smarshmello.github.io/Project-Sentinel';
const paths=['/','/watcher','/dashboard','/doctor','/compatibility','/data/watcher-report.json'];
let failed=false;
for(const path of paths){try{const r=await fetch(base+path,{redirect:'follow'});const text=await r.text();if(!r.ok)throw new Error(`HTTP ${r.status}`);if(path.endsWith('.json')){const data=JSON.parse(text);if(!data.counts||!Array.isArray(data.items))throw new Error('invalid watcher schema');}else if(!/<html/i.test(text))throw new Error('not HTML');console.log('PASS',path);}catch(e){failed=true;console.error('FAIL',path,e.message);}}
if(failed)process.exit(1);
