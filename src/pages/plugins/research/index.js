import React, {useEffect, useMemo, useState} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {useLocation} from '@docusaurus/router';
import {findResearchProject} from '@site/src/data/researchRegistry';
import {researchDimensions} from '@site/src/data/researchAssessment';
import styles from './styles.module.css';

function Meter({label, value}) {
  return <div className={styles.meter}><div><span>{label}</span><strong>{value}%</strong></div><i><b style={{width: `${value}%`}}/></i></div>;
}

export default function ResearchProfile() {
  const location = useLocation();
  const dataUrl = useBaseUrl('/data/research-results.json');
  const projectId = useMemo(() => new URLSearchParams(location.search).get('project'), [location.search]);
  const [project, setProject] = useState(null);
  const [state, setState] = useState('loading');

  useEffect(() => {
    let active = true;
    fetch(`${dataUrl}?profile=${Date.now()}`, {cache: 'no-store'})
      .then(response => response.ok ? response.json() : Promise.reject(new Error('Research data unavailable')))
      .then(data => {
        if (!active) return;
        setProject(findResearchProject(data, projectId));
        setState('ready');
      })
      .catch(() => active && setState('error'));
    return () => { active = false; };
  }, [dataUrl, projectId]);

  const dimensions = researchDimensions(project);
  return <Layout title={project?.name || 'Research Profile'} description="Sentinel Research project profile">
    <main className={styles.page}>
      <div className="container">
        <Link className={styles.back} to="/plugins">← Plugin Database</Link>
        {state === 'loading' && <section className={styles.state}><Heading as="h1">Loading research profile…</Heading></section>}
        {state === 'error' && <section className={styles.state}><Heading as="h1">Research data unavailable</Heading><p>Refresh after GitHub Pages finishes publishing the latest research results.</p></section>}
        {state === 'ready' && !project && <section className={styles.state}><Heading as="h1">Research profile not found</Heading><p>This discovery may still be publishing or may have been replaced by a reviewed registry record.</p><Link className="button button--primary" to="/plugins">Return to Plugin Database</Link></section>}
        {project && <>
          <header className={styles.hero}>
            <div><small>{project.category}</small><Heading as="h1">{project.name}</Heading><p>{project.description}</p></div>
            <span>Research · Not verified</span>
          </header>
          <section className={styles.notice}><strong>Sentinel research status</strong><p>{project.note}</p></section>
          <div className={styles.grid}>
            <section className={styles.panel}>
              <Heading as="h2">Research assessment</Heading>
              {dimensions ? <div className={styles.meters}>
                <Meter label="Identity" value={dimensions.identity}/><Meter label="Source credibility" value={dimensions.sourceCredibility}/><Meter label="Documentation" value={dimensions.documentation}/><Meter label="Compatibility evidence" value={dimensions.compatibility}/>
              </div> : <p>Assessment details are not available yet.</p>}
            </section>
            <section className={styles.panel}>
              <Heading as="h2">Project facts</Heading>
              <dl><div><dt>Developer</dt><dd>{project.developer}</dd></div><div><dt>Version</dt><dd>{project.version}</dd></div><div><dt>Review state</dt><dd>{project.researchStatus}</dd></div><div><dt>Sentinel Police</dt><dd>No</dd></div></dl>
            </section>
          </div>
          <div className={styles.grid}>
            <section className={styles.panel}><Heading as="h2">Dependencies discovered</Heading>{project.dependencies?.length ? <ul>{project.dependencies.map(item => <li key={item}>{item}</li>)}</ul> : <p>No reliable dependencies have been extracted yet.</p>}</section>
            <section className={styles.panel}><Heading as="h2">Compatibility position</Heading><p>Compatibility has not been approved merely because the project was found. Use a separate test branch until Sentinel has documentation, repeatable testing, or credible compatibility evidence.</p></section>
          </div>
          <section className={styles.panel}><Heading as="h2">Research sources</Heading><div className={styles.sources}>{(project.sources || project.candidates || []).map((source, index) => <a key={`${source.url}-${index}`} href={source.url} target="_blank" rel="noreferrer"><strong>{source.title || source.name || source.domain || 'Public source'}</strong><span>{source.domain || source.source || 'Web'} · score {source.score ?? '—'}</span><p>{source.description || source.snippet || 'No summary available.'}</p></a>)}</div></section>
        </>}
      </div>
    </main>
  </Layout>;
}
