import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const root = new URL('../', import.meta.url);
const registry = JSON.parse(await fs.readFile(new URL('sentinel-watcher/sources.json', root), 'utf8'));
const previousPath = new URL('public/data/watcher-report.json', root);
let previous = null;
try { previous = JSON.parse(await fs.readFile(previousPath, 'utf8')); } catch {}

const timeoutMs = 8000;
const checkedAt = new Date().toISOString();
const userAgent = 'Project-Sentinel-Watcher/0.1 (+https://github.com/SmarshMello/Project-Sentinel)';

function hash(value){return crypto.createHash('sha256').update(value).digest('hex').slice(0,16)}
function githubRepo(url){const m=url.match(/^https?:\/\/github\.com\/([^/]+)\/([^/#?]+)/i);return m ? {owner:m[1],repo:m[2].replace(/\.git$/,'')} : null}
async function request(url, options={}){
  const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),timeoutMs);
  try{return await fetch(url,{redirect:'follow',signal:controller.signal,headers:{'user-agent':userAgent,'accept':'text/html,application/json',...(options.headers||{})},...options});}
  finally{clearTimeout(timer)}
}
async function inspect(source){
  const result={...source,checkedAt,reachable:false,httpStatus:null,finalUrl:source.url,sourceType:'website',archived:false,latestRelease:null,lastActivity:null,change:'none',note:''};
  try{
    const gh=githubRepo(source.url);
    if(gh){
      result.sourceType='github';
      const headers={accept:'application/vnd.github+json'};
      if(process.env.GITHUB_TOKEN) headers.authorization=`Bearer ${process.env.GITHUB_TOKEN}`;
      const repoRes=await request(`https://api.github.com/repos/${gh.owner}/${gh.repo}`,{headers});
      result.httpStatus=repoRes.status;
      if(repoRes.ok){
        const repo=await repoRes.json(); result.reachable=true; result.archived=Boolean(repo.archived); result.lastActivity=repo.pushed_at; result.finalUrl=repo.html_url;
        const relRes=await request(`https://api.github.com/repos/${gh.owner}/${gh.repo}/releases/latest`,{headers});
        if(relRes.ok){const rel=await relRes.json();result.latestRelease=rel.tag_name||rel.name;result.releasePublishedAt=rel.published_at;result.releaseUrl=rel.html_url;}
      } else result.note=`GitHub API returned ${repoRes.status}`;
    } else {
      const res=await request(source.url);
      result.httpStatus=res.status; result.finalUrl=res.url || source.url;
      result.reachable=res.ok || [401,403,429].includes(res.status);
      if([401,403,429].includes(res.status)) result.note='Source blocks or limits automated checks; manual review may be required.';
      else if(!res.ok) result.note=`Source returned HTTP ${res.status}.`;
      const metadata=[res.headers.get('etag'),res.headers.get('last-modified'),res.headers.get('content-length'),res.headers.get('content-type')].join('|');
      result.fingerprint=hash(`${res.status}|${result.finalUrl}|${metadata}`);
    }
  } catch(error){result.note=error.name==='AbortError'?'Check timed out.':`Check failed: ${error.message}`;}
  const old=previous?.items?.find(x=>x.id===source.id);
  if(!result.reachable) result.change='unreachable';
  else if(result.archived) result.change='archived';
  else if(old?.latestRelease && result.latestRelease && old.latestRelease!==result.latestRelease) result.change='updated';
  else if(old?.fingerprint && result.fingerprint && old.fingerprint!==result.fingerprint) result.change='page-changed';
  return result;
}

const items=[];
const concurrency=6;
for(let i=0;i<registry.sources.length;i+=concurrency){
  const batch=registry.sources.slice(i,i+concurrency);
  items.push(...await Promise.all(batch.map(inspect)));
  process.stdout.write('.');
}
console.log('');
const counts={tracked:items.length,reachable:items.filter(x=>x.reachable).length,updated:items.filter(x=>x.change==='updated'||x.change==='page-changed').length,unreachable:items.filter(x=>x.change==='unreachable').length,archived:items.filter(x=>x.archived).length,needsReview:items.filter(x=>x.change!=='none'||x.note).length};
const report={schemaVersion:1,watcherVersion:'0.1.0',checkedAt,counts,items};
await fs.mkdir(new URL('public/data/',root),{recursive:true});
await fs.writeFile(previousPath,JSON.stringify(report,null,2)+'\n');
await fs.mkdir(new URL('sentinel-watcher/reports/',root),{recursive:true});
await fs.writeFile(new URL('sentinel-watcher/reports/latest.json',root),JSON.stringify(report,null,2)+'\n');
const md=[`# Sentinel Watcher report`,``,`Generated: ${checkedAt}`,``,`| Metric | Count |`,`|---|---:|`,...Object.entries(counts).map(([k,v])=>`| ${k} | ${v} |`),``,`## Items needing review`,``,...items.filter(x=>x.change!=='none'||x.note).map(x=>`- **${x.name}** — ${x.change}${x.note?`: ${x.note}`:''} ([source](${x.finalUrl}))`)];
await fs.writeFile(new URL('sentinel-watcher/reports/latest.md',root),md.join('\n')+'\n');
console.log(JSON.stringify(counts));
