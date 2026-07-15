import React, {useMemo, useRef, useState} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import {diagnosticRules} from '@site/src/data/diagnostics';
import styles from './styles.module.css';

const confidenceScore = {high: 3, medium: 2, low: 1};

function analyze(text) {
  const normalized = text.toLowerCase();
  return diagnosticRules.map((rule) => {
    const keywordHits = (rule.keywords || []).filter((keyword) => normalized.includes(keyword.toLowerCase()));
    const patternHits = (rule.logPatterns || []).filter((pattern) => pattern.test(text));
    const score = keywordHits.length + patternHits.length * 2 + (confidenceScore[rule.confidence] || 0);
    return {...rule, keywordHits, patternHits: patternHits.length, score};
  }).filter((match) => match.keywordHits.length || match.patternHits)
    .sort((a, b) => b.score - a.score || (confidenceScore[b.confidence] || 0) - (confidenceScore[a.confidence] || 0));
}

export default function DoctorPage() {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [ran, setRan] = useState(false);
  const inputRef = useRef(null);
  const matches = useMemo(() => ran ? analyze(text) : [], [ran, text]);
  const primary = matches[0];

  const readFile = async (file) => {
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

  const reset = () => {
    setText('');
    setFileName('');
    setRan(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  return <Layout title="Sentinel Doctor" description="Private, browser-based LSPDFR log analysis using Project Sentinel diagnostic rules.">
    <main className={styles.page}>
      <header className={styles.hero}><div className="container"><span>Local diagnostic workstation</span><Heading as="h1">Sentinel Doctor</Heading><p>Paste a crash log or open a text log. Analysis happens inside your browser; the file is not uploaded to Project Sentinel.</p></div></header>
      <section className={styles.body}><div className="container">
        <div className={styles.privacy}><b>Private by design</b><span>This first release reads text locally and compares it with verified Sentinel diagnostic rules. It does not modify your game files.</span></div>
        <div className={styles.workspace}>
          <article className={styles.inputCard}>
            <div className={styles.cardHead}><div><span>Step 1</span><Heading as="h2">Add the evidence</Heading></div>{fileName && <small>{fileName}</small>}</div>
            <div className={styles.fileRow}>
              <input ref={inputRef} type="file" accept=".log,.txt,.json,.xml,.ini,.cfg" onChange={(event) => readFile(event.target.files?.[0])}/>
              <button type="button" onClick={() => inputRef.current?.click()}>Open log file</button>
              <span>or paste below</span>
            </div>
            <textarea value={text} onChange={(event) => {setText(event.target.value); setRan(false);}} placeholder="Paste RagePluginHook.log, lspdfr.log, a crash message, or the first exception and the lines around it…" spellCheck="false"/>
            <div className={styles.inputActions}><button type="button" className={styles.primary} disabled={!text.trim()} onClick={() => setRan(true)}>Analyze evidence</button><button type="button" onClick={reset}>Clear</button></div>
          </article>

          <aside className={styles.sideCard}><span>Best evidence</span><Heading as="h2">What to provide</Heading><ol><li>The first exception or failure.</li><li>Twenty to fifty lines before it.</li><li>Your exact GTA, RPH and LSPDFR versions.</li><li>The last mod or configuration changed.</li></ol><p>Do not paste passwords, access tokens, email addresses, or private Windows paths you do not want visible.</p></aside>
        </div>

        {ran && <section className={styles.results}>
          <div className={styles.resultsHead}><div><span>Step 2</span><Heading as="h2">Diagnostic report</Heading></div><strong>{matches.length ? `${matches.length} possible cause${matches.length === 1 ? '' : 's'}` : 'No rule matched'}</strong></div>
          {!matches.length ? <div className={styles.empty}><Heading as="h3">No confident match yet</Heading><p>The log may need more context. Include the first exception, the lines before it, and the exact symptom. You can also use the guided troubleshooter.</p><Link to="/troubleshooter">Open Troubleshooting Wizard →</Link></div> : <>
            <article className={styles.primaryResult}><div className={styles.rank}>Most likely</div><div><span>{primary.status} · {primary.confidence} confidence</span><Heading as="h3">{primary.title}</Heading><p>Matched {primary.keywordHits.length} keyword signal{primary.keywordHits.length === 1 ? '' : 's'} and {primary.patternHits} log pattern{primary.patternHits === 1 ? '' : 's'}.</p></div></article>
            <div className={styles.matchGrid}>{matches.slice(0, 4).map((match, index) => <article key={match.id} className={styles.matchCard}>
              <div className={styles.matchTop}><span>#{index + 1}</span><b>{match.confidence} confidence</b></div>
              <Heading as="h3">{match.title}</Heading>
              {!!match.keywordHits.length && <p className={styles.signals}>Signals: {match.keywordHits.slice(0, 5).join(', ')}</p>}
              <h4>Recommended repair path</h4><ol>{match.steps.slice(0, 4).map((step) => <li key={step}>{step}</li>)}</ol>
              {!!match.checks?.length && <div className={styles.checks}><b>Verify</b>{match.checks.map((check) => <span key={check}>✓ {check}</span>)}</div>}
              <Link to={match.guide}>Open related Sentinel guide →</Link>
            </article>)}</div>
            <div className={styles.disclaimer}><b>Review before changing files.</b> Sentinel Doctor ranks known patterns; it does not prove causation. Back up the current build and test one change at a time.</div>
          </>}
        </section>}
      </div></section>
    </main>
  </Layout>;
}
