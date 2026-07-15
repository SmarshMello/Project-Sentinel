import React, {useEffect, useMemo, useRef, useState} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {plugins} from '@site/src/data/plugins';
import styles from './styles.module.css';

const MAX_LOG_CHARS = 180000;
const PLANNER_KEY = 'sentinelPlannerSelection';
const STARTER = [{role:'assistant', text:'Describe what is happening, what changed before it started, and any error text you see. Add versions or logs when available. I will diagnose one step at a time and prioritize Sentinel-verified fixes.', confidence:'ready', sources:[]}];
const CATEGORIES = ['Startup / loading','Crash or freeze','Plugin not loading','EUP / uniforms','Keybinds / controls','Performance / stutter','Vehicles / lighting','Other'];
const DEFAULT_SELECTED = ['stop-the-ped','ultimate-backup','compulite','eup-menu'];

function readFile(file){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>resolve({name:file.name,text:String(reader.result||'')});
    reader.onerror=()=>reject(new Error(`Could not read ${file.name}`));
    reader.readAsText(file);
  });
}

function SentinelAIApp(){
  const {siteConfig}=useDocusaurusContext();
  const endpoint=siteConfig.customFields?.sentinelAiEndpoint||'';
  const turnstileSiteKey=siteConfig.customFields?.turnstileSiteKey||'';
  const [messages,setMessages]=useState(STARTER);
  const [problem,setProblem]=useState('');
  const [category,setCategory]=useState(CATEGORIES[0]);
  const [versions,setVersions]=useState({gta:'1.0.3788.0',rph:'1.130.1406.17682',lspdfr:'0.4.9 / 0.4.9572'});
  const [selected,setSelected]=useState(DEFAULT_SELECTED);
  const [pluginSearch,setPluginSearch]=useState('');
  const [plannerStatus,setPlannerStatus]=useState('No saved planner selection found');
  const [logs,setLogs]=useState([]);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [turnstileToken,setTurnstileToken]=useState('');
  const fileRef=useRef(null);
  const bottomRef=useRef(null);

  function loadPlannerSelection(showMessage=false){
    try{
      const saved=JSON.parse(localStorage.getItem(PLANNER_KEY)||'null');
      const validIds=Array.isArray(saved?.ids)?saved.ids.filter(id=>plugins.some(p=>p.id===id)):[];
      if(validIds.length){
        setSelected(validIds);
        const label=saved.profileLabel||saved.profile||'saved build';
        setPlannerStatus(`Loaded ${validIds.length} components from ${label}`);
        if(showMessage) setError('');
        return true;
      }
    }catch{}
    setPlannerStatus('No saved planner selection found');
    return false;
  }

  useEffect(()=>{loadPlannerSelection(false);},[]);
  useEffect(()=>{
    const onStorage=e=>{if(e.key===PLANNER_KEY)loadPlannerSelection(false);};
    const onFocus=()=>loadPlannerSelection(false);
    window.addEventListener('storage',onStorage);
    window.addEventListener('focus',onFocus);
    return()=>{window.removeEventListener('storage',onStorage);window.removeEventListener('focus',onFocus);};
  },[]);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:'smooth'});},[messages,busy]);
  useEffect(()=>{
    if(!turnstileSiteKey) return;
    window.sentinelTurnstileCallback=(token)=>setTurnstileToken(token);
    const script=document.createElement('script');
    script.src='https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async=true; script.defer=true;
    document.head.appendChild(script);
    return()=>{delete window.sentinelTurnstileCallback;};
  },[turnstileSiteKey]);

  const chosenPlugins=useMemo(()=>plugins.filter(p=>selected.includes(p.id)).map(p=>({id:p.id,name:p.name,version:p.version,status:p.status,note:p.note,category:p.category})),[selected]);
  const filteredPlugins=useMemo(()=>{
    const q=pluginSearch.trim().toLowerCase();
    if(!q) return plugins;
    return plugins.filter(p=>[p.name,p.shortName,p.category,p.developer,p.description,...(p.tags||[])].filter(Boolean).join(' ').toLowerCase().includes(q));
  },[pluginSearch]);

  async function addLogs(files){
    setError('');
    try{
      const allowed=[...files].filter(f=>/\.(log|txt|ini|xml|json|cfg)$/i.test(f.name));
      if(!allowed.length) throw new Error('Use text-based log or configuration files: .log, .txt, .ini, .xml, .json, or .cfg.');
      const read=await Promise.all(allowed.slice(0,6).map(readFile));
      const current=logs.reduce((n,f)=>n+f.text.length,0);
      let room=MAX_LOG_CHARS-current;
      const clipped=[];
      for(const item of read){if(room<=0)break; const text=item.text.slice(0,room); clipped.push({...item,text,truncated:text.length<item.text.length}); room-=text.length;}
      setLogs(prev=>[...prev,...clipped].slice(0,6));
    }catch(e){setError(e.message);}
  }

  async function send(){
    const clean=problem.trim();
    if(!clean||busy)return;
    if(!endpoint){setError('Sentinel AI is installed, but the secure Worker endpoint has not been connected yet. Follow sentinel-ai-worker/SETUP.md.');return;}
    if(turnstileSiteKey&&!turnstileToken){setError('Complete the security check before submitting.');return;}
    setBusy(true); setError('');
    const userMessage={role:'user',text:clean};
    const next=[...messages,userMessage]; setMessages(next); setProblem('');
    try{
      const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
        problem:clean,category,versions,plugins:chosenPlugins,
        logs:logs.map(f=>({name:f.name,text:f.text})),
        history:next.slice(-8).map(({role,text})=>({role,text})),
        turnstileToken,
      })});
      const data=await response.json().catch(()=>({}));
      if(!response.ok) throw new Error(data.error||`Sentinel AI request failed (${response.status}).`);
      setMessages(prev=>[...prev,{role:'assistant',text:data.answer||'No answer was returned.',confidence:data.confidence||'unknown',sources:Array.isArray(data.sources)?data.sources:[],checks:Array.isArray(data.checks)?data.checks:[]}]);
      setTurnstileToken('');
      if(window.turnstile) window.turnstile.reset();
    }catch(e){setError(e.message);setMessages(prev=>prev.filter(m=>m!==userMessage));setProblem(clean);}
    finally{setBusy(false);}
  }

  function reset(){setMessages(STARTER);setProblem('');setLogs([]);setError('');}
  function togglePlugin(id){setSelected(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id]);}
  function selectVisible(){setSelected(v=>[...new Set([...v,...filteredPlugins.map(p=>p.id)])]);}
  function clearPlugins(){setSelected([]);}

  return <Layout title="Sentinel AI" description="AI-powered LSPDFR troubleshooting grounded in Project Sentinel.">
    <main className={styles.page}>
      <header className={styles.hero}><div className="container"><div className={styles.kicker}>Project Sentinel diagnostic intelligence</div><Heading as="h1">Sentinel <span>AI</span></Heading><p>Describe the failure, attach logs, and receive a focused repair plan grounded in the Sentinel Police build, compatibility registry, and troubleshooting guides.</p><div className={styles.heroBadges}><span>🔒 Secure backend</span><span>📄 Log analysis</span><span>🧭 Guided repairs</span><span>⚠ Experimental</span></div></div></header>
      <section className={styles.workspace}><div className="container"><div className={styles.grid}>
        <aside className={styles.sidebar}>
          <section className={styles.panel}><div className={styles.panelTitle}>System profile</div>
            <label>Issue category<select value={category} onChange={e=>setCategory(e.target.value)}>{CATEGORIES.map(x=><option key={x}>{x}</option>)}</select></label>
            <label>GTA V Legacy<input value={versions.gta} onChange={e=>setVersions({...versions,gta:e.target.value})}/></label>
            <label>RAGE Plugin Hook<input value={versions.rph} onChange={e=>setVersions({...versions,rph:e.target.value})}/></label>
            <label>LSPDFR<input value={versions.lspdfr} onChange={e=>setVersions({...versions,lspdfr:e.target.value})}/></label>
          </section>
          <section className={`${styles.panel} ${styles.pluginPanel}`}>
            <div className={styles.panelTitle}>Installed mods and plugins</div>
            <div className={styles.plannerSync}><span>{plannerStatus}</span><button onClick={()=>loadPlannerSelection(true)}>Reload planner</button></div>
            <input className={styles.pluginSearch} value={pluginSearch} onChange={e=>setPluginSearch(e.target.value)} placeholder={`Search ${plugins.length} database entries…`}/>
            <div className={styles.pluginActions}><button onClick={selectVisible}>Select visible</button><button onClick={clearPlugins}>Clear all</button><strong>{selected.length} selected</strong></div>
            <div className={styles.pluginList}>{filteredPlugins.map(p=><label className={styles.check} key={p.id} title={`${p.category} · ${p.status}`}><input type="checkbox" checked={selected.includes(p.id)} onChange={()=>togglePlugin(p.id)}/><span><b>{p.shortName||p.name}</b><small>{p.category}</small></span></label>)}</div>
            {!filteredPlugins.length&&<div className={styles.emptyPlugins}>No matching database entries.</div>}
            <small>Selections from the Build Planner are loaded automatically. You can still add or remove any mod before submitting a diagnosis.</small>
          </section>
          <section className={styles.panel}><div className={styles.panelTitle}>Diagnostic files</div><button className={styles.upload} onClick={()=>fileRef.current?.click()}>＋ Add logs or configs</button><input ref={fileRef} hidden multiple type="file" accept=".log,.txt,.ini,.xml,.json,.cfg" onChange={e=>addLogs(e.target.files)}/><div className={styles.files}>{logs.map((f,i)=><div key={`${f.name}-${i}`}><span>📄 {f.name}{f.truncated?' (trimmed)':''}</span><button onClick={()=>setLogs(logs.filter((_,n)=>n!==i))}>×</button></div>)}</div><small>Files are read in your browser and sent only when you click Analyze. Avoid personal data, passwords, and license keys.</small></section>
        </aside>
        <section className={styles.chatShell}>
          <div className={styles.chatTop}><div><strong>Sentinel AI Technician</strong><span>{endpoint?'Backend configured':'Setup required'}</span></div><button onClick={reset}>Clear session</button></div>
          <div className={styles.messages}>{messages.map((m,i)=><article key={i} className={`${styles.message} ${styles[m.role]}`}><div className={styles.avatar}>{m.role==='assistant'?'AI':'YOU'}</div><div className={styles.bubble}><div className={styles.messageLabel}>{m.role==='assistant'?'Sentinel AI':'Diagnostic report'}{m.confidence&&m.role==='assistant'&&<span className={styles.confidence}>{m.confidence} confidence</span>}</div><div className={styles.answer}>{m.text}</div>{m.checks?.length>0&&<ul>{m.checks.map(x=><li key={x}>{x}</li>)}</ul>}{m.sources?.length>0&&<div className={styles.sources}>{m.sources.map(s=><Link key={s.url} to={s.url}>{s.label||s.url}</Link>)}</div>}</div></article>)}{busy&&<article className={`${styles.message} ${styles.assistant}`}><div className={styles.avatar}>AI</div><div className={styles.bubble}><div className={styles.typing}><i/><i/><i/> Analyzing versions, plugins, and logs…</div></div></article>}<div ref={bottomRef}/></div>
          <div className={styles.composer}>{error&&<div className={styles.error}>{error}</div>}<textarea rows="5" value={problem} onChange={e=>setProblem(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}} placeholder="Example: RAGE Plugin Hook launches GTA, but LSPDFR never loads. F4 shows no LSPD First Response plugin…" maxLength="5000"/>{turnstileSiteKey&&<div className="cf-turnstile" data-sitekey={turnstileSiteKey} data-callback="sentinelTurnstileCallback"/>}<div className={styles.composerBottom}><span>{problem.length}/5000 · Enter to send · Shift+Enter for a new line</span><button disabled={busy||!problem.trim()} onClick={send}>{busy?'Analyzing…':'Analyze problem'}</button></div></div>
        </section>
      </div><div className={styles.notice}><strong>Back up before changing files.</strong> Sentinel AI can make mistakes. Follow one repair step at a time and prefer answers marked Sentinel Verified. <Link to="/guide/troubleshooting">Open manual troubleshooting</Link>.</div></div></section>
    </main>
  </Layout>;
}
export default function SentinelAI(){return <BrowserOnly fallback={<Layout title="Sentinel AI"><main className="container margin-vert--xl">Loading Sentinel AI…</main></Layout>}>{()=> <SentinelAIApp/>}</BrowserOnly>}
