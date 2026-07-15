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
  const analysis = useMemo(() => ran ? analyzeDiagnostics(text) : {matches: [], ignoredLineCount: 0}, [ran, text]);
  const matches = analysis.matches;
  const primary = matches[0];

  const readFiles = async (files) => {
    const file = files?.[0];
    if (!file) return;
    const maxBytes = 3 * 1024 * 1024;
    if (file.size > maxBytes) {
      setText('This file is larger than 3 MB. Open it in Notepad and paste the first error section and the lines immediately before it.');
      setFileName(file.name);
      setRan(false);
      return;
    }
    setText(await file.text());
    setFileName(file.name);
    setRan(false);
  };

  const reset = () => {setText(''); setFileName(''); setRan(false);};

  return <Layout title="Sentinel Doctor" description="Private, browser-based LSPDFR log analysis using Project Sentinel diagnostic rules.">
    <main className={styles.page}>
      <header className={styles.hero}><div className="container"><span>Local diagnostic workstation</span><Heading as="h1">Sentinel Doctor</Heading><p>Drop in a crash log or paste the evidence. Analysis stays in your browser and now separates likely root causes from downstream symptoms.</p></div></header>
      <section className={styles.body}><div className="container">
        <div className={styles.privacy}><b>Private by design</b><span>Files are read locally. Sentinel Doctor does not upload or modify them.</span></div>
        <div className={styles.workspace}>
          <article className={styles.inputCard}>
            <div className={styles.cardHead}><div><span>Step 1</span><Heading as="h2">Add the evidence</Heading></div>{fileName && <small>{fileName}</small>}</div>
            <FileDropZone accept=".log,.txt,.json,.xml,.ini,.cfg" onFiles={readFiles} label="Drag and drop a log here" hint="or click to browse · maximum 3 MB"/>
            <textarea value={text} onChange={(event) => {setText(event.target.value); setRan(false);}} placeholder="Paste RagePluginHook.log, lspdfr.log, a crash message, or the first exception and the lines around it…" spellCheck="false"/>
            <div className={styles.inputActions}><button type="button" className={styles.primary} disabled={!text.trim()} onClick={() => setRan(true)}>Analyze evidence</button><button type="button" onClick={reset}>Clear</button></div>
          </article>
          <aside className={styles.sideCard}><span>Best evidence</span><Heading as="h2">What to provide</Heading><ol><li>The first exception or failure.</li><li>Twenty to fifty lines before it.</li><li>Your exact GTA, RPH and LSPDFR versions.</li><li>The last mod or configuration changed.</li></ol><p>Do not include passwords, access tokens, email addresses, or private paths you do not want visible.</p></aside>
        </div>

        {ran && <section className={styles.results}>
          <div className={styles.resultsHead}><div><span>Step 2</span><Heading as="h2">Diagnostic report</Heading></div><strong>{matches.length ? `${matches.length} ranked finding${matches.length === 1 ? '' : 's'}` : 'No rule matched'}{analysis.ignoredLineCount > 0 ? ` · ${analysis.ignoredLineCount} note line${analysis.ignoredLineCount === 1 ? '' : 's'} ignored` : ''}</strong></div>
          {!matches.length ? <div className={styles.empty}><Heading as="h3">No confident match yet</Heading><p>Include the first exception, the lines before it, and the exact symptom.</p><Link to="/troubleshooter">Open Troubleshooting Wizard →</Link></div> : <>
            <article className={styles.primaryResult}><div className={styles.rank}>Most likely root cause</div><div><span>{primary.status} · {primary.confidence} confidence</span><Heading as="h3">{primary.title}</Heading><p>Ranked from contextual log patterns, specific wording, and suppression of redundant symptom rules.</p></div></article>
            <div className={styles.matchGrid}>{matches.slice(0, 5).map((match, index) => <article key={match.id} className={styles.matchCard}>
              <div className={styles.matchTop}><span>#{index + 1}</span><b>{index === 0 ? 'primary root cause' : (match.kind || 'supporting issue')}</b></div>
              <Heading as="h3">{match.title}</Heading>
              {!!match.evidenceLines?.length && <div className={styles.checks}><b>Matched evidence</b>{match.evidenceLines.map((line, i) => <span key={`${line}-${i}`}>“{line.trim().slice(0, 180)}”</span>)}</div>}
              <h4>Recommended repair path</h4><ol>{match.steps.slice(0, 4).map((step) => <li key={step}>{step}</li>)}</ol>
              {!!match.checks?.length && <div className={styles.checks}><b>Verify</b>{match.checks.map((check) => <span key={check}>✓ {check}</span>)}</div>}
              <Link to={match.guide}>Open related Sentinel guide →</Link>
            </article>)}</div>
            <div className={styles.disclaimer}><b>Review before changing files.</b> Back up the current build and test one change at a time. Doctor ranks evidence; it does not claim absolute proof.</div>
          </>}
        </section>}
      </div></section>
    </main>
  </Layout>;
}
