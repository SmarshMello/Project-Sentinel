import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const root=new URL('../',import.meta.url);
const query=String(process.env.SENTINEL_RESEARCH_QUERY||'').trim().replace(/\s+/g,' ');
const suppliedRequestId=String(process.env.SENTINEL_RESEARCH_REQUEST_ID||'').trim();
const scanId=String(process.env.SENTINEL_RESEARCH_SCAN_ID||'').trim();
if(!query){console.log('No research query supplied.');process.exit(0);}

const dataPath=new URL('static/data/research-results.json',root);
const read=async()=>{try{return JSON.parse(await fs.readFile(dataPath,'utf8'));}catch{return {schemaVersion:2,updatedAt:null,discoveries:[],requests:[]};}};
const headers={accept:'application/vnd.github+json','user-agent':'Project-Sentinel-Research/2.0',...(process.env.GITHUB_TOKEN?{authorization:`Bearer ${process.env.GITHUB_TOKEN}`}:{})};
const slug=(v)=>String(v).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70);
const norm=(v='')=>String(v).toLowerCase().replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
const generic=new Set(['mod','plugin','police','lspdfr','gta','gta5','gtav','grand','theft','auto','v','for','and','with']);
const queryTokens=norm(query).split(' ').filter(x=>x.length>1&&!generic.has(x));

function candidateScore(repo){
 const hay=norm([repo.name,repo.full_name,repo.description,...(repo.topics||[])].join(' '));
 const name=norm(repo.name);
 const exact=name===norm(query)||hay.includes(norm(query));
 const matched=queryTokens.filter(token=>hay.split(' ').includes(token));
 const overlap=queryTokens.length?matched.length/queryTokens.length:0;
 const ecosystem=/\blspdfr\b|\brage plugin hook\b|\bgta ?v\b|\bgrand theft auto\b/.test(hay);
 const popularity=Math.min(12,Math.log10((repo.stargazers_count||0)+1)*5);
 const freshness=repo.updated_at&&Date.now()-Date.parse(repo.updated_at)<1000*60*60*24*365*4?8:0;
 return Math.round((exact?45:0)+(overlap*35)+(ecosystem?20:0)+popularity+freshness);
}

const searchQueries=[`${query} LSPDFR`,`${query} GTA V mod`,query];
const repos=new Map();
for(const searchQuery of searchQueries){
 const res=await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=updated&order=desc&per_page=10`,{headers});
 if(!res.ok)continue;
 const payload=await res.json();
 for(const repo of payload.items||[])repos.set(repo.full_name,repo);
}

const candidates=[...repos.values()].map(repo=>({
 name:repo.name,fullName:repo.full_name,url:repo.html_url,description:repo.description||'',stars:repo.stargazers_count||0,
 updatedAt:repo.updated_at,topics:repo.topics||[],source:'github',score:candidateScore(repo)
})).sort((a,b)=>b.score-a.score).slice(0,8);
const credible=candidates.filter(x=>x.score>=58);
const current=await read();
const now=new Date().toISOString();
const requestId=/^[a-zA-Z0-9_-]{8,100}$/.test(suppliedRequestId)?suppliedRequestId:`request-${slug(query)}-${crypto.createHash('sha1').update(query.toLowerCase()).digest('hex').slice(0,7)}`;
const requests=[{
 id:requestId,requestId,scanId:scanId||null,query,status:credible.length?'resolved':'needs-manual-research',requestedAt:now,
 candidateCount:candidates.length,credibleCandidateCount:credible.length,candidates
},...(current.requests||[]).filter(x=>x.id!==requestId)].slice(0,200);
let discoveries=current.discoveries||[];

if(credible.length){
 const best=credible[0];
 const id=`research-${slug(best.name||query)}-${crypto.createHash('sha1').update((best.fullName||query).toLowerCase()).digest('hex').slice(0,7)}`;
 const record={
  id,name:best.name||query,shortName:null,aliases:[query,best.name].filter(Boolean),category:'Research discoveries',status:'research',
  version:'Not verified',developer:best.fullName?.split('/')[0]||'Unknown',impact:'Unknown',confidence:Math.min(65,Math.max(35,best.score)),
  description:best.description||`Watcher discovered a likely source for ${query}. Compatibility remains unverified.`,dependencies:[],
  tags:['Watcher discovery','Pending review','Automatic discovery'],guide:null,download:best.url,note:`Watcher found ${credible.length} credible candidate source${credible.length===1?'':'s'}. This record was added automatically as Research and must be reviewed before approval.`,
  sentinelPolice:false,researchDiscovered:true,researchStatus:'pending-review',requestedAt:now,candidates:credible
 };
 discoveries=[record,...discoveries.filter(x=>x.id!==id&&norm(x.name)!==norm(record.name))].slice(0,150);
 console.log(`Credible research record added for ${record.name}; best score ${best.score}.`);
}else{
 console.log(`No credible source found for ${query}. Request retained for manual research; no database record added.`);
}

await fs.mkdir(new URL('static/data/',root),{recursive:true});
await fs.writeFile(dataPath,JSON.stringify({schemaVersion:2,updatedAt:now,discoveries,requests},null,2)+'\n');
