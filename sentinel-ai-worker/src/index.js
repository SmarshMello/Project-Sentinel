import {SENTINEL_KNOWLEDGE} from './knowledge.js';

const MAX_PROBLEM=5000, MAX_LOGS=180000, MAX_HISTORY=8;
const jsonHeaders={'Content-Type':'application/json','Cache-Control':'no-store'};

function cors(origin, env){
  const allowed=(env.ALLOWED_ORIGINS||'').split(',').map(x=>x.trim()).filter(Boolean);
  return {
    'Access-Control-Allow-Origin': allowed.includes(origin)?origin:(allowed[0]||'null'),
    'Access-Control-Allow-Methods':'POST,OPTIONS',
    'Access-Control-Allow-Headers':'Content-Type',
    'Vary':'Origin',
  };
}
function reply(body,status,origin,env){return new Response(JSON.stringify(body),{status,headers:{...jsonHeaders,...cors(origin,env)}})}
function cleanText(value,max){return String(value||'').replace(/\0/g,'').slice(0,max)}
function validOrigin(origin,env){const a=(env.ALLOWED_ORIGINS||'').split(',').map(x=>x.trim());return a.includes(origin)}

async function verifyTurnstile(token,ip,env){
  if(env.REQUIRE_TURNSTILE!=='true') return true;
  if(!token||!env.TURNSTILE_SECRET_KEY) return false;
  const form=new FormData();form.append('secret',env.TURNSTILE_SECRET_KEY);form.append('response',token);if(ip)form.append('remoteip',ip);
  const r=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:form});
  const data=await r.json();return data.success===true;
}

function buildInput(data){
  const logs=(Array.isArray(data.logs)?data.logs:[]).slice(0,6);
  let remaining=MAX_LOGS;
  const logText=logs.map(log=>{const text=cleanText(log.text,remaining);remaining-=text.length;return `\n--- ${cleanText(log.name,120)} ---\n${text}`}).join('');
  const plugins=(Array.isArray(data.plugins)?data.plugins:[]).slice(0,30).map(p=>`${cleanText(p.name,80)} | version: ${cleanText(p.version,60)} | status: ${cleanText(p.status,30)} | note: ${cleanText(p.note,180)}`).join('\n');
  const history=(Array.isArray(data.history)?data.history:[]).slice(-MAX_HISTORY).map(m=>`${m.role==='assistant'?'Assistant':'User'}: ${cleanText(m.text,1800)}`).join('\n');
  return `CATEGORY: ${cleanText(data.category,80)}\nVERSIONS:\n- GTA: ${cleanText(data.versions?.gta,80)}\n- RPH: ${cleanText(data.versions?.rph,80)}\n- LSPDFR: ${cleanText(data.versions?.lspdfr,80)}\n\nSELECTED PLUGINS:\n${plugins||'Not supplied'}\n\nCURRENT PROBLEM:\n${cleanText(data.problem,MAX_PROBLEM)}\n\nRECENT CONVERSATION:\n${history||'None'}\n\nATTACHED LOGS / CONFIGS:${logText||' None'}`;
}

export default {
  async fetch(request,env){
    const origin=request.headers.get('Origin')||'';
    if(request.method==='OPTIONS') return new Response(null,{status:204,headers:cors(origin,env)});
    if(request.method!=='POST') return reply({error:'Method not allowed.'},405,origin,env);
    if(!validOrigin(origin,env)) return reply({error:'Origin not allowed.'},403,origin,env);
    if(!env.OPENAI_API_KEY) return reply({error:'The Worker is missing OPENAI_API_KEY.'},503,origin,env);
    const length=Number(request.headers.get('content-length')||0);
    if(length>300000) return reply({error:'Request is too large.'},413,origin,env);
    let data;try{data=await request.json()}catch{return reply({error:'Invalid JSON request.'},400,origin,env)}
    if(!cleanText(data.problem,MAX_PROBLEM).trim()) return reply({error:'Describe the problem first.'},400,origin,env);
    const ip=request.headers.get('CF-Connecting-IP')||'';
    if(!(await verifyTurnstile(data.turnstileToken,ip,env))) return reply({error:'Security verification failed or expired.'},403,origin,env);

    const schema={type:'object',additionalProperties:false,properties:{answer:{type:'string'},confidence:{type:'string',enum:['high','medium','low']},checks:{type:'array',items:{type:'string'},maxItems:5},sources:{type:'array',maxItems:5,items:{type:'object',additionalProperties:false,properties:{label:{type:'string'},url:{type:'string'}},required:['label','url']}}},required:['answer','confidence','checks','sources']};
    const payload={
      model:env.OPENAI_MODEL||'gpt-5-mini',
      instructions:`You are Sentinel AI, a narrow technical troubleshooter for GTA V Legacy, RAGE Plugin Hook, LSPDFR, and related mods. Use the supplied Project Sentinel knowledge as your primary authority. Be precise, cautious, and transparent. Do not claim you saw evidence absent from the user's text or logs. Do not identify a mod as compatible merely because it is popular. When logs are supplied, cite exact filenames and paraphrase relevant evidence without fabricating lines. Provide one likely diagnosis, then ordered repair steps. Keep the answer under 700 words.\n\n${SENTINEL_KNOWLEDGE}`,
      input:buildInput(data),
      max_output_tokens:1400,
      text:{format:{type:'json_schema',name:'sentinel_diagnosis',strict:true,schema}},
    };
    let r;
    try{r=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{'Authorization':`Bearer ${env.OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify(payload)})}
    catch{return reply({error:'Could not reach the AI service.'},502,origin,env)}
    const result=await r.json();
    if(!r.ok) return reply({error:result?.error?.message||'OpenAI request failed.'},502,origin,env);
    const raw=result.output_text||result.output?.flatMap(x=>x.content||[]).find(x=>x.type==='output_text')?.text;
    try{return reply(JSON.parse(raw),200,origin,env)}catch{return reply({answer:raw||'No diagnosis was returned.',confidence:'low',checks:[],sources:[]},200,origin,env)}
  }
};
