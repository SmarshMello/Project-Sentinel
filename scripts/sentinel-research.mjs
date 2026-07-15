import fs from 'node:fs/promises';
import crypto from 'node:crypto';
const root=new URL('../',import.meta.url);
const query=String(process.env.SENTINEL_RESEARCH_QUERY||'').trim();
if(!query){console.log('No research query supplied.');process.exit(0);}
const path=new URL('static/data/research-results.json',root);
const read=async()=>{try{return JSON.parse(await fs.readFile(path,'utf8'));}catch{return {schemaVersion:1,updatedAt:null,discoveries:[]};}};
const headers={accept:'application/vnd.github+json','user-agent':'Project-Sentinel-Research/1.0',...(process.env.GITHUB_TOKEN?{authorization:`Bearer ${process.env.GITHUB_TOKEN}`}:{})};
const slug=(v)=>String(v).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70);
const res=await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query+' GTA V LSPDFR')}&sort=updated&order=desc&per_page=5`,{headers});
const payload=res.ok?await res.json():{items:[]};
const candidates=(payload.items||[]).map(repo=>({name:repo.name,fullName:repo.full_name,url:repo.html_url,description:repo.description||'',stars:repo.stargazers_count||0,updatedAt:repo.updated_at,source:'github'}));
const current=await read();
const id=`research-${slug(query)}-${crypto.createHash('sha1').update(query.toLowerCase()).digest('hex').slice(0,7)}`;
const record={id,name:query,shortName:query.slice(0,12),category:'Research discoveries',status:'research',version:'Not verified',developer:'Unknown',impact:'Unknown',confidence:Math.min(45,candidates.length?25+candidates.length*4:10),description:`Automatically discovered research request for ${query}. Compatibility is not verified.`,dependencies:[],tags:['Watcher discovery','Pending review'],guide:null,download:candidates[0]?.url||null,note:candidates.length?`Watcher found ${candidates.length} candidate source${candidates.length===1?'':'s'}. Review before approval.`:'No GitHub candidate was found; external-source research is still required.',sentinelPolice:false,researchDiscovered:true,researchStatus:'pending-review',requestedAt:new Date().toISOString(),candidates};
const discoveries=[record,...(current.discoveries||[]).filter(x=>x.id!==id)].slice(0,100);
await fs.mkdir(new URL('static/data/',root),{recursive:true});
await fs.writeFile(path,JSON.stringify({schemaVersion:1,updatedAt:new Date().toISOString(),discoveries},null,2)+'\n');
console.log(`Research record updated for ${query}; ${candidates.length} GitHub candidates found.`);
