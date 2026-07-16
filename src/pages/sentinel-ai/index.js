import React,{useEffect,useMemo,useRef,useState} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {answerExpertQuestion,expertExamples,statusMeta} from '@site/src/data/expertEngine';
import {createExpertContext,downloadExpertContext,saveExpertContext} from '@site/src/data/expertHandoff';
import {researchDimensions} from '@site/src/data/researchAssessment';
import styles from './styles.module.css';

function WatcherBadge({p}){if(!p.watcherTracked)return <span className={styles.untracked}>Not monitored</span>;const w=p.watcher;return <span className={w.status==='healthy'?styles.liveGood:styles.liveWarn}>{w.status==='healthy'?'Live healthy':String(w.status||'unknown').replaceAll('-',' ')}</span>}
function Card({p}){const health=p.watcher?.healthScore;const dimensions=researchDimensions(p);return <article className={styles.card}><div className={styles.cardHead}><div><small>{p.category}</small><h3>{p.name}</h3></div><span>{statusMeta[p.status]?.label||p.status}</span></div><p>{p.description}</p><dl><div><dt>Version</dt><dd>{p.watcher?.detectedVersion||p.version||'Not locked'}</dd></div><div><dt>Registry confidence</dt><dd>{p.confidence??'—'}%</dd></div><div><dt>Watcher health</dt><dd>{Number.isFinite(health)?`${health}%`:'Not monitored'}</dd></div><div><dt>Source</dt><dd><WatcherBadge p={p}/></dd></div></dl>{p.watcher?.intelligence?.recommendation&&<aside>{p.watcher.intelligence.recommendation}</aside>}{p.note&&<aside>{p.note}</aside>}{dimensions&&<div className={styles.dimensionMini}><span>Identity <b>{dimensions.identity}%</b></span><span>Sources <b>{dimensions.sourceCredibility}%</b></span><span>Docs <b>{dimensions.documentation}%</b></span><span>Compatibility <b>{dimensions.compatibility}%</b></span></div>}{p.sources?.length>0&&<div className={styles.sourceLinks}>{p.sources.slice(0,3).map(source=><a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.domain||'Source'} ↗</a>)}</div>}<footer><Link to={p.profile}>Open profile →</Link>{p.guide&&<Link to={p.guide}>Guide</Link>}</footer></article>}
function WatcherPanel({w}){if(!w)return null;return <section className={styles.watcherPanel}><div><small>Live Watcher intelligence</small><h2>{w.tracked} monitored result{w.tracked===1?'':'s'} used</h2><p>{w.degraded.length?`${w.degraded.length} source signal${w.degraded.length===1?'':'s'} currently need attention.`:'All matched monitored sources are healthy.'}</p></div><div><span><b>{w.updates.length}</b> update signals</span><span><b>{w.degraded.length}</b> degraded sources</span></div></section>}
function Reasoning({data}){if(!data)return null;return <section className={styles.reasoning}><div className={styles.confidence}><small>Recommendation confidence</small><strong>{data.confidence}%</strong><span>{data.recommendation}</span></div><div><h2>Why Sentinel reached this answer</h2><ul>{data.reasons.map((item,i)=><li className={styles[item.kind]||''} key={`${item.text}-${i}`}>{item.text}</li>)}</ul></div></section>}
function ResearchProgress({state}){
 if(!state||state.phase==='idle')return null;
 const complete=['found','not-found','manual-review','failed','key-needed'].includes(state.phase);
 const title={
  queued:'Sentinel Research queued',running:'Research Engine is researching this project',publishing:'Research finished — publishing findings',
  found:'Research Engine found a candidate project', 'manual-review':'Research complete — review needed', 'not-found':'Research Engine complete',failed:'Research Engine failed','key-needed':'Research key required'
 }[state.phase]||'Watcher research';
 return <section className={`${styles.researchProgress} ${complete?styles.researchComplete:''}`}>
  <div className={styles.researchProgressHead}><div><small>Live Sentinel Research</small><h2>{title}</h2><p>{state.message}</p></div><strong>{Math.max(0,Math.min(100,state.percent||0))}%</strong></div>
  <div className={styles.researchTrack}><span style={{width:`${Math.max(2,Math.min(100,state.percent||0))}%`}}/></div>
  {state.activeStep&&<div className={styles.researchStep}>{state.activeStep}</div>}
  {state.candidates?.length>0&&<div className={styles.researchCandidates}>{state.candidates.slice(0,4).map((candidate)=><article key={candidate.url}><div><strong>{candidate.title||candidate.name||'Candidate source'}</strong><small>{candidate.domain||candidate.source||'Web source'} · confidence score {candidate.score??'—'}</small><p>{candidate.description||candidate.snippet||'No description available.'}</p></div><a href={candidate.url} target="_blank" rel="noreferrer">Open source →</a></article>)}</div>}
  {state.runUrl&&<a href={state.runUrl} target="_blank" rel="noreferrer">Open Sentinel Research run →</a>}
 </section>;
}

function ResearchAssessment({data,projects}){if(!data)return null;const research=projects.filter(p=>p.researchDiscovered||p.status==='research');return <section className={styles.assessment}><div><small>Research assessment</small><h2>What Sentinel knows — and what it does not</h2><p>Existence and source credibility are separate from compatibility approval.</p></div><div className={styles.assessmentGrid}>{research.map((project,index)=>{const d=data.dimensions[index]||researchDimensions(project);return <article key={project.id}><strong>{project.name}</strong><span>Identity <b>{d.identity}%</b></span><span>Source credibility <b>{d.sourceCredibility}%</b></span><span>Documentation <b>{d.documentation}%</b></span><span>Compatibility evidence <b>{d.compatibility}%</b></span></article>})}</div><footer><b>Recommendation:</b> {data.recommendation}. {data.summary}</footer></section>}

function Result({r,onDoctor,onExport,onSave,saved,researchState,onResearch}){if(!r)return <div className={styles.empty}><b>SE</b><Heading as="h2">Grounded answers, not guesses.</Heading><p>Ask about a version, dependency, install order, compatibility combination, category, or troubleshooting symptom.</p></div>;return <div className={styles.result}><section className={`${styles.verdict} ${styles[r.tone]||''}`}><small>Sentinel verdict</small><Heading as="h2">{r.verdict}</Heading><p>{r.summary}</p></section><Reasoning data={r.reasoning}/><ResearchAssessment data={r.researchAssessment} projects={r.projects||[]}/><WatcherPanel w={r.watcher}/>{r.type==='unknown'&&<section className={styles.researchBox}><div><small>Unknown project research</small><h2>{r.unknownProject}</h2><p>Sentinel will not guess. Sentinel Research can search for credible official sources, then Sentinel will automatically re-run this question after the findings are published.</p></div><button onClick={onResearch} disabled={['queued','running','publishing'].includes(researchState?.phase)}>{['queued','running','publishing'].includes(researchState?.phase)?'Researching…':'Research this project'}</button></section>}<ResearchProgress state={researchState}/>{r.warnings?.length>0&&<section className={styles.alert}><h2>Why Sentinel flagged it</h2><ul>{r.warnings.map(x=><li key={x}>{x}</li>)}</ul></section>}{r.installPlan?.length>0&&<section><h2 className={styles.sectionTitle}>Recommended install order</h2><ol className={styles.installPlan}>{r.installPlan.map((step,i)=><li key={step.project.id}><span>{i+1}</span><div><Link to={step.project.profile}>{step.project.name}</Link><small>{step.reason} · {step.project.version||'Version not locked'}</small></div></li>)}</ol>{r.installWarnings?.length>0&&<div className={styles.planWarnings}><strong>Manual dependency checks</strong>{r.installWarnings.map(x=><p key={`${x.project}-${x.dependency}`}>{x.project}: {x.dependency}</p>)}</div>}</section>}{r.validationChecklist?.length>0&&<section><h2 className={styles.sectionTitle}>Validation checkpoints</h2><ul className={styles.checklist}>{r.validationChecklist.map(x=><li key={x}>{x}</li>)}</ul></section>}{r.projects?.length>0&&<section><h2 className={styles.sectionTitle}>{r.type==='search'?'Registry matches':'Project intelligence'}</h2><div className={styles.cards}>{r.projects.map(p=><Card key={p.id} p={p}/>)}</div></section>}{r.dependencies?.some(x=>x.items.length)&&<section><h2 className={styles.sectionTitle}>Dependencies</h2><div className={styles.deps}>{r.dependencies.filter(x=>x.items.length).map(x=><article key={x.plugin.id}><strong>{x.plugin.name}</strong><ul>{x.items.map(d=><li key={d.name}>{d.project?<Link to={d.project.profile}>{d.name}</Link>:d.name}</li>)}</ul></article>)}</div></section>}{r.type==='doctor'&&<section className={styles.doctor}><div><small>Next best action</small><h2>Continue in Sentinel Doctor</h2><p>Add versions, symptoms, logs, and repair rules.</p></div><button className="button button--primary" onClick={onDoctor}>Open Doctor with context →</button></section>}{r&&<section className={styles.answerActions}><button onClick={onSave}>{saved?'Context saved':'Save build context'}</button><button onClick={onExport}>Download summary</button><button onClick={onDoctor}>Send to Doctor</button></section>}<div className={styles.source}>Sources: Sentinel Unified Registry + latest published Watcher report · Local browser engine · No external AI API</div></div>}
function App(){
  const {siteConfig}=useDocusaurusContext();
  const controlEndpoint=String(siteConfig.customFields?.watcherControlEndpoint||'').replace(/\/$/,'');
  const reportUrl=useBaseUrl('/data/watcher-report.json');
  const researchUrl=useBaseUrl('/data/research-results.json');
  const doctorUrl=useBaseUrl('/doctor');
  const[q,setQ]=useState(''),[r,setR]=useState(null),[history,setHistory]=useState([]),[saved,setSaved]=useState(false),[report,setReport]=useState(null),[discoveries,setDiscoveries]=useState([]),[liveState,setLiveState]=useState('loading'),[researchState,setResearchState]=useState({phase:'idle',percent:0,message:'',activeStep:null,runUrl:null});
  const pollToken=useRef(0);
  const activeResearch=useRef(null);
  const normalizeResearchQuery=(value='')=>String(value).toLowerCase().replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
  const researchStorageKey='sentinel-active-research-v1';
  useEffect(()=>{let active=true;Promise.allSettled([fetch(`${reportUrl}?expert=${Date.now()}`,{cache:'no-store'}),fetch(`${researchUrl}?expert=${Date.now()}`,{cache:'no-store'})]).then(async results=>{if(!active)return;const [reportResult,researchResult]=results;if(reportResult.status==='fulfilled'&&reportResult.value.ok){setReport(await reportResult.value.json());setLiveState('ready');}else setLiveState('offline');if(researchResult.status==='fulfilled'&&researchResult.value.ok){const data=await researchResult.value.json();setDiscoveries(data.discoveries||[]);}});return()=>{active=false;pollToken.current+=1};},[reportUrl,researchUrl]);
  const related=useMemo(()=>r?.mentions?.length?[`What version of ${r.mentions[0].name} should I use?`,`What does ${r.mentions[0].name} require?`,`What is the install order for ${r.mentions[0].name}?`]:expertExamples.slice(0,3),[r]);
  function context(){return r?createExpertContext(q,r):null;}
  function save(){const c=context();if(c&&saveExpertContext(c)){setSaved(true);window.setTimeout(()=>setSaved(false),1800);}}
  function exportSummary(){const c=context();if(c)downloadExpertContext(c);}
  function openDoctor(){const c=context();if(c)saveExpertContext(c);window.location.href=`${doctorUrl}?from=expert`;}
  function evaluate(clean,discoveryData=discoveries){const ans=answerExpertQuestion(clean,report,discoveryData);setR(ans);setQ(clean);setSaved(false);setHistory(h=>[{q:clean,v:ans.verdict},...h.filter(x=>x.q!==clean)].slice(0,6));return ans;}
  const sleep=(ms)=>new Promise(resolve=>window.setTimeout(resolve,ms));
  async function loadPublishedResearch(query,requestId,requestedAt,token,key){
    const normalized=normalizeResearchQuery(query);
    for(let attempt=0;attempt<80;attempt+=1){
      if(token!==pollToken.current)return null;
      setResearchState(state=>({...state,phase:'publishing',percent:96,message:`Research Engine finished. Retrieving the exact published result… (${attempt*3}s)`,activeStep:'Loading research result from the repository'}));
      try{
        const direct=await fetch(`${controlEndpoint}/research-result?requestId=${encodeURIComponent(requestId)}`,{headers:{'x-watcher-key':key},cache:'no-store'});
        if(direct.ok){
          const payload=await direct.json();
          if(payload.request)return {data:payload.data||{discoveries:payload.discoveries||[]},request:payload.request};
        }
      }catch{}
      try{
        const response=await fetch(`${researchUrl}?research=${Date.now()}`,{cache:'no-store'});
        if(response.ok){
          const data=await response.json();
          const requests=data.requests||[];
          const request=requests.find(item=>(requestId&&item.requestId===requestId)||(normalizeResearchQuery(item.query)===normalized&&Date.parse(item.requestedAt||0)>=requestedAt-5000));
          if(request)return {data,request};
        }
      }catch{}
      await sleep(3000);
    }
    return null;
  }
  async function monitorResearch(scanId,requestId,query,question,requestedAt,token,key){
    let runUrl=null;
    for(let attempt=0;attempt<90;attempt+=1){
      if(token!==pollToken.current)return;
      try{
        const response=await fetch(`${controlEndpoint}/status?scanId=${encodeURIComponent(scanId)}`,{headers:{'x-watcher-key':key},cache:'no-store'});
        if(!response.ok)throw new Error('status');
        const status=await response.json();
        runUrl=status.runUrl||runUrl;
        const finished=status.status==='completed';
        setResearchState({phase:finished?'publishing':status.found?'running':'queued',percent:finished?94:Math.max(3,status.percent||3),message:finished?'Sentinel Research completed the source research. Waiting for the new findings to publish…':status.found?'Sentinel Research is searching sources and evaluating candidates.':'Waiting for GitHub Actions to start the research run.',activeStep:status.activeStep||'Waiting for runner',runUrl});
        if(finished){
          if(status.conclusion!=='success')throw new Error('run-failed');
          const published=await loadPublishedResearch(query,requestId,requestedAt,token,key);
          if(!published)throw new Error('publish-timeout');
          const nextDiscoveries=published.data.discoveries||[];
          setDiscoveries(nextDiscoveries);
          if(published.request.status==='resolved'){
            const answer=answerExpertQuestion(question,report,nextDiscoveries);
            setR(answer);setHistory(h=>[{q:question,v:answer.verdict},...h.filter(x=>x.q!==question)].slice(0,6));
            activeResearch.current=null;window.sessionStorage.removeItem(researchStorageKey);
            setResearchState({phase:'found',percent:100,message:`Watcher found ${published.request.credibleCandidateCount||1} credible candidate source${published.request.credibleCandidateCount===1?'':'s'}. Sentinel re-evaluated your original question using the new Research record.`,activeStep:'Question automatically re-submitted with published findings',runUrl});
          }else if(published.request.status==='needs-manual-research'){
            activeResearch.current=null;window.sessionStorage.removeItem(researchStorageKey);
            setResearchState({phase:'manual-review',percent:100,message:`Research completed across ${(published.request.searchProviders||[]).length||'multiple'} public search sources. No candidate cleared the automatic credibility threshold, so Sentinel kept the project unverified and exposed the best candidates for review.`,activeStep:'Research complete — candidate review required',runUrl,candidates:published.request.candidates||[]});
          }else{
            activeResearch.current=null;window.sessionStorage.removeItem(researchStorageKey);
            setResearchState({phase:'not-found',percent:100,message:'Sentinel Research completed the internet search but found no relevant public source. Sentinel will continue treating the project as unknown.',activeStep:'No relevant public source found',runUrl,candidates:published.request.candidates||[]});
          }
          return;
        }
      }catch(error){
        if(String(error?.message)==='status'){await sleep(3000);continue;}
        activeResearch.current=null;window.sessionStorage.removeItem(researchStorageKey);
        setResearchState({phase:'failed',percent:100,message:'The Sentinel Research run could not be completed or its published result could not be confirmed. Open the run for details and try again.',activeStep:'Research stopped',runUrl});return;
      }
      await sleep(3000);
    }
    activeResearch.current=null;window.sessionStorage.removeItem(researchStorageKey);
    setResearchState({phase:'failed',percent:100,message:'Sentinel Research exceeded the ten-minute monitoring window. The GitHub run may still finish in the background.',activeStep:'Monitoring timed out',runUrl});
  }
  async function submitResearch(projectName=r?.unknownProject,question=q){
    if(!projectName||!controlEndpoint)return setResearchState({phase:'failed',percent:100,message:'Sentinel control endpoint is unavailable.',activeStep:'Research not started',runUrl:null});
    const key=window.sessionStorage.getItem('sentinel-watcher-admin-key')||'';
    if(!key)return setResearchState({phase:'key-needed',percent:0,message:'Open Watcher once and enter the private admin key, then return and search again.',activeStep:'Admin key required',runUrl:null});
    const normalized=normalizeResearchQuery(projectName);
    let stored=null;try{stored=JSON.parse(window.sessionStorage.getItem(researchStorageKey)||'null');}catch{}
    const existing=activeResearch.current||(stored&&stored.normalized===normalized&&Date.now()-stored.requestedAt<15*60*1000?stored:null);
    const token=++pollToken.current;
    if(existing?.scanId){
      activeResearch.current=existing;
      setResearchState({phase:'queued',percent:3,message:`Sentinel Research is already researching “${projectName}”. Reconnecting to the existing run instead of starting a duplicate.`,activeStep:'Reusing active research request',runUrl:existing.runUrl||null});
      await monitorResearch(existing.scanId,existing.requestId,projectName,question,existing.requestedAt,token,key);
      return;
    }
    const requestedAt=Date.now();
    const requestId=`expert-${requestedAt}-${crypto.randomUUID().slice(0,8)}`;
    const pending={requestId,query:projectName,normalized,question,requestedAt,scanId:null,runUrl:null};
    activeResearch.current=pending;
    window.sessionStorage.setItem(researchStorageKey,JSON.stringify(pending));
    setResearchState({phase:'queued',percent:2,message:`Sending “${projectName}” to Sentinel Research…`,activeStep:'Submitting one uniquely identified research request',runUrl:null});
    try{
      const response=await fetch(`${controlEndpoint}/research`,{method:'POST',headers:{'content-type':'application/json','x-watcher-key':key},body:JSON.stringify({query:projectName,question,requestId})});
      if(!response.ok)throw new Error('research');
      const payload=await response.json();
      const active={...pending,requestId:payload.requestId||requestId,scanId:payload.scanId};
      activeResearch.current=active;window.sessionStorage.setItem(researchStorageKey,JSON.stringify(active));
      setResearchState({phase:'queued',percent:3,message:payload.reused?'An identical Watcher request is already active. Reconnecting without launching another run.':'Research request accepted. Waiting for GitHub Actions to start.',activeStep:payload.reused?'Duplicate prevented — using existing run':'Sentinel Research queued',runUrl:null});
      await monitorResearch(active.scanId,active.requestId,projectName,question,requestedAt,token,key);
    }catch{
      activeResearch.current=null;window.sessionStorage.removeItem(researchStorageKey);
      setResearchState({phase:'failed',percent:100,message:'The research request could not be queued. Verify the Worker deployment and Watcher key.',activeStep:'Submission failed',runUrl:null});
    }
  }
  function ask(v=q){const clean=v.trim();if(!clean)return;pollToken.current+=1;setResearchState({phase:'idle',percent:0,message:'',activeStep:null,runUrl:null});const ans=evaluate(clean);if(ans.type==='unknown'){window.setTimeout(()=>submitResearch(ans.unknownProject,clean),0);}}
  return <Layout title="Sentinel Expert" description="Registry and Watcher-grounded LSPDFR answers"><main className={styles.page}><header className={styles.hero}><div><small>Sentinel Intelligence Layer · Live Research</small><Heading as="h1">Ask Sentinel.</Heading><p>Structured answers from the Unified Registry, Watcher sources, and reviewed research discoveries—without invented compatibility claims.</p><section><span>{59+discoveries.length} known projects</span><span className={liveState==='ready'?styles.heroLive:styles.heroMuted}>{liveState==='ready'?'Watcher connected':liveState==='loading'?'Connecting Watcher…':'Registry-only mode'}</span><span>Multi-project reasoning</span><span>Live unknown-mod research</span><span>Install planning</span><span>Doctor routing</span></section></div></header><div className={styles.layout}><aside className={styles.sidebar}><section><b>Try a verified question</b>{expertExamples.map(x=><button key={x} onClick={()=>ask(x)}>{x}</button>)}<button onClick={()=>ask('Can I use EUP and Lennys Mod Loader together?')}>Can I use EUP and Lenny's Mod Loader together?</button></section>{history.length>0&&<section><b>Session history</b>{history.map(x=><button key={x.q} onClick={()=>ask(x.q)}><strong>{x.q}</strong><small>{x.v}</small></button>)}</section>}</aside><section className={styles.main}><div className={styles.ask}><textarea rows="3" maxLength="500" value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();ask();}}} placeholder="Ask about a plugin, version, install order, dependency, conflict, category, or crash…"/><footer><span>{q.length}/500 · Enter to ask</span><button disabled={q.trim().length<3} onClick={()=>ask()}>Ask Sentinel</button></footer></div><Result r={r} onDoctor={openDoctor} onExport={exportSummary} onSave={save} saved={saved} researchState={researchState} onResearch={()=>submitResearch(r?.unknownProject,q)}/>{r&&<section className={styles.related}><b>Related questions</b><div>{related.map(x=><button key={x} onClick={()=>ask(x)}>{x}</button>)}</div></section>}</section></div></main></Layout>;
}
export default function SentinelAI(){return <BrowserOnly fallback={<Layout title="Sentinel Expert"><main className="container margin-vert--xl">Loading Sentinel intelligence…</main></Layout>}>{()=><App/>}</BrowserOnly>}
