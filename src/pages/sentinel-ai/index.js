import React,{useEffect,useMemo,useRef,useState} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import {plugins} from '@site/src/data/plugins';
import {diagnosticRules,conflictRules} from '@site/src/data/diagnostics';
import styles from './styles.module.css';

const PLANNER_KEY='sentinelPlannerSelection';
const MAX_LOG_CHARS=180000;
const CATEGORIES=['Startup / launch','Crash','Plugin not loading','EUP / uniforms','Vehicles / GameConfig','Performance / stutter','Keybind / controls','Other'];
const STARTER=[{role:'assistant',text:'I am the free Sentinel Expert System. Describe what is failing, select the mods you installed, and attach text logs when available. I will compare your report against Sentinel rules, known conflicts, and the current plugin database—without a paid AI service.',confidence:'system',sources:[{label:'Manual troubleshooting',url:'/guide/troubleshooting'}]}];

function readFile(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve({name:file.name,text:String(reader.result||'')});reader.onerror=()=>reject(new Error(`Could not read ${file.name}`));reader.readAsText(file);});}
function scoreRule(rule,text,logs){let score=0;for(const keyword of rule.keywords||[]){if(text.includes(keyword.toLowerCase()))score+=3;}for(const pattern of rule.logPatterns||[]){if(pattern.test(logs))score+=5;}return score;}
function formatDiagnosis(result,conflicts,versions){
 const lines=[];
 if(conflicts.length){lines.push('KNOWN CONFLICT DETECTED');for(const c of conflicts)lines.push(`• ${c.title}: ${c.detail}`);lines.push('');}
 lines.push(result.title.toUpperCase());
 lines.push(`Evidence level: ${result.status}`);
 lines.push('');
 lines.push('Recommended repair path:');
 result.steps.forEach((s,i)=>lines.push(`${i+1}. ${s}`));
 if(result.checks?.length){lines.push('');lines.push('Verify:');result.checks.forEach(x=>lines.push(`• ${x}`));}
 if(versions.gta||versions.rph||versions.lspdfr){lines.push('');lines.push(`Reported versions: GTA ${versions.gta||'not supplied'} · RPH ${versions.rph||'not supplied'} · LSPDFR ${versions.lspdfr||'not supplied'}`);}
 lines.push('');lines.push('Change one thing at a time, launch, and save a fresh log before continuing.');
 return lines.join('\n');
}

function SentinelExpertApp(){
 const [category,setCategory]=useState(CATEGORIES[0]);
 const [versions,setVersions]=useState({gta:'1.0.3788.0',rph:'1.130.1406.17682',lspdfr:'0.4.9 / 0.4.9572'});
 const [selected,setSelected]=useState(()=>plugins.filter(p=>p.sentinelPolice).map(p=>p.id));
 const [pluginSearch,setPluginSearch]=useState('');
 const [logs,setLogs]=useState([]);
 const [problem,setProblem]=useState('');
 const [messages,setMessages]=useState(STARTER);
 const [plannerStatus,setPlannerStatus]=useState('Sentinel Police defaults loaded');
 const [error,setError]=useState('');
 const fileRef=useRef(null);const bottomRef=useRef(null);

 function loadPlannerSelection(show=true){
  try{const raw=localStorage.getItem(PLANNER_KEY);if(!raw){if(show)setPlannerStatus('No saved planner selection found');return false;}const data=JSON.parse(raw);const ids=Array.isArray(data.ids)?data.ids.filter(id=>plugins.some(p=>p.id===id)):[];if(!ids.length){if(show)setPlannerStatus('Saved plan contained no matching plugins');return false;}setSelected(ids);setPlannerStatus(`Loaded ${ids.length} mods from Build Planner`);return true;}catch{if(show)setPlannerStatus('Could not read saved planner selection');return false;}
 }
 useEffect(()=>{loadPlannerSelection(false);},[]);
 useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:'smooth'});},[messages]);
 const chosenPlugins=useMemo(()=>plugins.filter(p=>selected.includes(p.id)),[selected]);
 const filteredPlugins=useMemo(()=>{const q=pluginSearch.trim().toLowerCase();if(!q)return plugins;return plugins.filter(p=>[p.name,p.shortName,p.category,p.developer,p.description,...(p.tags||[])].filter(Boolean).join(' ').toLowerCase().includes(q));},[pluginSearch]);

 async function addLogs(files){setError('');try{const allowed=[...files].filter(f=>/\.(log|txt|ini|xml|json|cfg)$/i.test(f.name));if(!allowed.length)throw new Error('Use .log, .txt, .ini, .xml, .json, or .cfg files.');const read=await Promise.all(allowed.slice(0,6).map(readFile));let room=MAX_LOG_CHARS-logs.reduce((n,f)=>n+f.text.length,0);const clipped=[];for(const item of read){if(room<=0)break;const text=item.text.slice(0,room);clipped.push({...item,text,truncated:text.length<item.text.length});room-=text.length;}setLogs(prev=>[...prev,...clipped].slice(0,6));}catch(e){setError(e.message);}}
 function diagnose(){
  const clean=problem.trim();if(!clean)return;
  setError('');setMessages(prev=>[...prev,{role:'user',text:clean}]);
  const text=`${category} ${clean} ${chosenPlugins.map(p=>`${p.name} ${p.note||''}`).join(' ')}`.toLowerCase();
  const logText=logs.map(l=>l.text).join('\n');
  const ranked=diagnosticRules.map(r=>({rule:r,score:scoreRule(r,text,logText)})).sort((a,b)=>b.score-a.score);
  let best=ranked[0];if(!best||best.score===0)best={rule:diagnosticRules.find(r=>r.id==='generic-crash'),score:1};
  const conflicts=conflictRules.filter(c=>c.ids.every(id=>selected.includes(id)));
  const confidence=conflicts.length||best.score>=8?'high':best.score>=4?'medium':'guided';
  const answer=formatDiagnosis(best.rule,conflicts,versions);
  const sources=[{label:'Open recommended guide',url:best.rule.guide},{label:'Compatibility Center',url:'/compatibility'}];
  setMessages(prev=>[...prev,{role:'assistant',text:answer,confidence,sources,checks:conflicts.map(c=>c.title)}]);
  setProblem('');
 }
 function togglePlugin(id){setSelected(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id]);}
 function reset(){setMessages(STARTER);setProblem('');setLogs([]);setError('');}
 return <Layout title="Sentinel Expert System" description="Free browser-based LSPDFR troubleshooting and log analysis."><main className={styles.page}>
  <header className={styles.hero}><div className="container"><div className={styles.kicker}>Zero-cost diagnostic intelligence</div><Heading as="h1">Sentinel <span>Expert System</span></Heading><p>A free, private troubleshooting assistant powered by Project Sentinel rules—not a paid API. It analyzes selected mods, common log signatures, versions, and known conflicts directly in your browser.</p><div className={styles.heroBadges}><span>✓ No API key</span><span>✓ No monthly cost</span><span>✓ Local log parsing</span><span>✓ Sentinel-grounded</span></div></div></header>
  <section className={styles.workspace}><div className="container"><div className={styles.grid}>
   <aside className={styles.sidebar}>
    <section className={styles.panel}><div className={styles.panelTitle}>System profile</div><label>Issue category<select value={category} onChange={e=>setCategory(e.target.value)}>{CATEGORIES.map(x=><option key={x}>{x}</option>)}</select></label><label>GTA V Legacy<input value={versions.gta} onChange={e=>setVersions({...versions,gta:e.target.value})}/></label><label>RAGE Plugin Hook<input value={versions.rph} onChange={e=>setVersions({...versions,rph:e.target.value})}/></label><label>LSPDFR<input value={versions.lspdfr} onChange={e=>setVersions({...versions,lspdfr:e.target.value})}/></label></section>
    <section className={`${styles.panel} ${styles.pluginPanel}`}><div className={styles.panelTitle}>Installed mods and plugins</div><div className={styles.plannerSync}><span>{plannerStatus}</span><button onClick={()=>loadPlannerSelection(true)}>Reload planner</button></div><input className={styles.pluginSearch} value={pluginSearch} onChange={e=>setPluginSearch(e.target.value)} placeholder={`Search ${plugins.length} database entries…`}/><div className={styles.pluginActions}><button onClick={()=>setSelected(v=>[...new Set([...v,...filteredPlugins.map(p=>p.id)])])}>Select visible</button><button onClick={()=>setSelected([])}>Clear all</button><strong>{selected.length} selected</strong></div><div className={styles.pluginList}>{filteredPlugins.map(p=><label className={styles.check} key={p.id}><input type="checkbox" checked={selected.includes(p.id)} onChange={()=>togglePlugin(p.id)}/><span><b>{p.shortName||p.name}</b><small>{p.category} · {p.status}</small></span></label>)}</div></section>
    <section className={styles.panel}><div className={styles.panelTitle}>Diagnostic files</div><button className={styles.upload} onClick={()=>fileRef.current?.click()}>＋ Add logs or configs</button><input ref={fileRef} hidden multiple type="file" accept=".log,.txt,.ini,.xml,.json,.cfg" onChange={e=>addLogs(e.target.files)}/><div className={styles.files}>{logs.map((f,i)=><div key={`${f.name}-${i}`}><span>📄 {f.name}{f.truncated?' (trimmed)':''}</span><button onClick={()=>setLogs(logs.filter((_,n)=>n!==i))}>×</button></div>)}</div><small>Files stay in your browser. Nothing is uploaded to a server.</small></section>
   </aside>
   <section className={styles.chatShell}><div className={styles.chatTop}><div><strong>Sentinel Diagnostic Technician</strong><span>Free local engine active</span></div><button onClick={reset}>Clear session</button></div><div className={styles.messages}>{messages.map((m,i)=><article key={i} className={`${styles.message} ${styles[m.role]}`}><div className={styles.avatar}>{m.role==='assistant'?'SE':'YOU'}</div><div className={styles.bubble}><div className={styles.messageLabel}>{m.role==='assistant'?'Sentinel Expert':'Diagnostic report'}{m.confidence&&<span className={styles.confidence}>{m.confidence}</span>}</div><div className={styles.answer}>{m.text}</div>{m.checks?.length>0&&<ul>{m.checks.map(x=><li key={x}>{x}</li>)}</ul>}{m.sources?.length>0&&<div className={styles.sources}>{m.sources.map(s=><Link key={s.url} to={s.url}>{s.label}</Link>)}</div>}</div></article>)}<div ref={bottomRef}/></div><div className={styles.composer}>{error&&<div className={styles.error}>{error}</div>}<textarea rows="5" value={problem} onChange={e=>setProblem(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();diagnose();}}} placeholder="Describe exactly what happens, when it happens, and what you installed immediately before the problem…" maxLength="5000"/><div className={styles.composerBottom}><span>{problem.length}/5000 · Enter to analyze</span><button disabled={!problem.trim()} onClick={diagnose}>Analyze problem</button></div></div></section>
  </div><div className={styles.notice}><strong>This is a rule-based expert system, not a generative AI.</strong> It is free and more predictable, but it cannot understand every possible error. Back up first, change one thing at a time, and use the linked guide when confidence is low. <Link to="/troubleshooter">Open guided wizard</Link>.</div></div></section>
 </main></Layout>;
}
export default function SentinelAI(){return <BrowserOnly fallback={<Layout title="Sentinel Expert System"><main className="container margin-vert--xl">Loading diagnostics…</main></Layout>}>{()=> <SentinelExpertApp/>}</BrowserOnly>}
