import React, {useMemo, useState} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import FileDropZone from '@site/src/components/FileDropZone';
import {analyzeDiagnostics} from '@site/src/utils/diagnosticEngine';
import styles from './styles.module.css';

export default function DoctorPage() {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [ran, setRan] = useState(false);
  const [repairOpen, setRepairOpen] = useState(false);
  const [repairStep, setRepairStep] = useState(0);
  const [completed, setCompleted] = useState([]);
  const analysis = useMemo(() => ran ? analyzeDiagnostics(text) : {matches: [], ignoredLineCount: 0, ruledOut: [], timeline: [], needsMoreEvidence: []}, [ran, text]);
  const matches = analysis.matches;
  const primary = matches[0];

  const readFiles = async (files) => {
    const file = files?.[0];
    if (!file) return;
    const maxBytes = 3 * 1024 * 1024;
    if (file.size > maxBytes) {
      setText('This file is larger than 3 MB. Open it in Notepad and paste the first error section and the lines immediately before it.');
      setFileName(file.name); setRan(false); return;
    }
    setText(await file.text()); setFileName(file.name); setRan(false); setRepairOpen(false);
  };
  const reset = () => {setText(''); setFileName(''); setRan(false); setRepairOpen(false); setRepairStep(0); setCompleted([]);};
  const startRepair = () => {setRepairOpen(true);setRepairStep(0);setCompleted([]);};
  const finishStep = () => {setCompleted(v=>[...new Set([...v,repairStep])]); if(repairStep < primary.steps.length-1)setRepairStep(repairStep+1);};

  return <Layout title="Sentinel Doctor" description="Private, browser-based LSPDFR log analysis using Project Sentinel diagnostic rules.">
    <main className={styles.page}>
      <header className={styles.hero}><div className="container"><span>Local diagnostic workstation</span><Heading as="h1">Sentinel Doctor</Heading><p>Drop in a crash log or paste the evidence. Doctor builds a causal chain, uses positive and negative evidence, and turns the diagnosis into a guided repair plan.</p></div></header>
      <section className={styles.body}><div className="container">
        <div className={styles.privacy}><b>Private by design</b><span>Files are read locally. Sentinel Doctor does not upload or modify them.</span></div>
        <div className={styles.workspace}>
          <article className={styles.inputCard}>
            <div className={styles.cardHead}><div><span>Step 1</span><Heading as="h2">Add the evidence</Heading></div>{fileName && <small>{fileName}</small>}</div>
            <FileDropZone accept=".log,.txt,.json,.xml,.ini,.cfg" onFiles={readFiles} label="Drag and drop a log here" hint="or click to browse · maximum 3 MB"/>
            <textarea value={text} onChange={(event) => {setText(event.target.value); setRan(false); setRepairOpen(false);}} placeholder="Paste RagePluginHook.log, lspdfr.log, a crash message, or the first exception and the lines around it…" spellCheck="false"/>
            <div className={styles.inputActions}><button type="button" className={styles.primary} disabled={!text.trim()} onClick={() => {setRan(true);setRepairOpen(false);}}>Analyze evidence</button><button type="button" onClick={reset}>Clear</button></div>
          </article>
          <aside className={styles.sideCard}><span>Best evidence</span><Heading as="h2">What to provide</Heading><ol><li>The first exception or failure.</li><li>Twenty to fifty lines before it.</li><li>Your exact GTA, RPH and LSPDFR versions.</li><li>The last mod or configuration changed.</li></ol><p>Do not include passwords, access tokens, email addresses, or private paths you do not want visible.</p></aside>
        </div>

        {ran && <section className={styles.results}>
          <div className={styles.resultsHead}><div><span>Step 2</span><Heading as="h2">Diagnostic report</Heading></div><strong>{matches.length ? `${matches.length} ranked finding${matches.length === 1 ? '' : 's'}` : 'No rule matched'}{analysis.ignoredLineCount > 0 ? ` · ${analysis.ignoredLineCount} note line${analysis.ignoredLineCount === 1 ? '' : 's'} ignored` : ''}</strong></div>
          {!matches.length ? <div className={styles.empty}><Heading as="h3">No confident match yet</Heading><p>Include the first exception, the lines before it, and the exact symptom.</p><Link to="/troubleshooter">Open Troubleshooting Wizard →</Link></div> : <>
            <article className={styles.primaryResult}><div className={styles.rank}>Most likely root cause</div><div><span>{primary.status} · {primary.confidencePercent}% confidence</span><Heading as="h3">{primary.title}</Heading><p>Confidence combines specificity, causal continuity, direct exception evidence, and contradictory evidence.</p></div><button className={styles.repairButton} onClick={startRepair}>Start guided repair</button></article>
            {!!primary.causalChain?.length && <article className={styles.chainCard}><div><span>Causal chain</span><Heading as="h3">How the failure progressed</Heading></div><div className={styles.chain}>{primary.causalChain.map((item,i)=><React.Fragment key={item}><div className={styles.chainNode}>{item}</div>{i<primary.causalChain.length-1&&<div className={styles.chainArrow}>↓</div>}</React.Fragment>)}</div></article>}
            
            {!!analysis.timeline?.length && <article className={styles.chainCard}><div><span>Evidence timeline</span><Heading as="h3">Where the startup or session first broke</Heading></div><div className={styles.chain}>{analysis.timeline.slice(0,12).map((item)=><div className={styles.chainNode} key={`${item.time}-${item.index}`}><b>{item.time}</b> · {item.state==='failure'?'✕':item.state==='success'?'✓':item.state==='warning'?'!':'•'} {item.text}</div>)}</div></article>}
            {!!analysis.ruledOut?.length && <article className={styles.ruledOut}><div><span>Negative evidence</span><Heading as="h3">Ruled out by this log</Heading></div><div>{analysis.ruledOut.map(x=><span key={x}>✓ {x}</span>)}</div></article>}
            <div className={styles.matchGrid}>{matches.slice(0, 5).map((match, index) => <article key={match.id} className={styles.matchCard}>
              <div className={styles.matchTop}><span>#{index + 1}</span><b>{index === 0 ? 'primary root cause' : (match.kind || 'supporting issue')}</b><em>{match.confidencePercent}%</em></div>
              <Heading as="h3">{match.title}</Heading><small>{match.subsystem || 'General diagnostics'}</small>
              {!!match.evidenceLines?.length && <div className={styles.checks}><b>Matched evidence</b>{match.evidenceLines.map((line, i) => <span key={`${line}-${i}`}>“{line.trim().slice(0, 180)}”</span>)}</div>}
              <h4>Recommended repair path</h4><ol>{match.steps.slice(0, 4).map((step) => <li key={step}>{step}</li>)}</ol>
              {!!match.checks?.length && <div className={styles.checks}><b>Verify</b>{match.checks.map((check) => <span key={check}>✓ {check}</span>)}</div>}
              <Link to={match.guide}>Open related Sentinel guide →</Link>
            </article>)}</div>
            {repairOpen && <section className={styles.repairPanel}><div className={styles.repairHeader}><div><span>Step 3</span><Heading as="h2">Guided repair assistant</Heading><p>Work through one controlled change at a time. Sentinel does not modify files automatically.</p></div><button onClick={()=>setRepairOpen(false)}>Close</button></div><div className={styles.repairProgress}><div style={{width:`${((completed.length)/primary.steps.length)*100}%`}}/><span>{completed.length} of {primary.steps.length} complete</span></div><div className={styles.repairBody}><aside>{primary.steps.map((step,i)=><button key={step} className={`${i===repairStep?styles.activeStep:''} ${completed.includes(i)?styles.doneStep:''}`} onClick={()=>setRepairStep(i)}><span>{completed.includes(i)?'✓':i+1}</span>{step}</button>)}</aside><article><span>Current action</span><Heading as="h3">Step {repairStep+1} of {primary.steps.length}</Heading><p>{primary.steps[repairStep]}</p>{primary.checks?.[repairStep]&&<div className={styles.verifyBox}>Verify: {primary.checks[repairStep]}</div>}<div className={styles.repairActions}><button disabled={repairStep===0} onClick={()=>setRepairStep(repairStep-1)}>Back</button><button className={styles.primary} onClick={finishStep}>{repairStep===primary.steps.length-1?'Mark complete':'Done — next step'}</button></div></article></div></section>}
            <div className={styles.disclaimer}><b>Review before changing files.</b> Back up the current build and test one change at a time. Doctor ranks evidence; it does not claim absolute proof.</div>
          </>}
        </section>}
      </div></section>
    </main>
  </Layout>;
}
