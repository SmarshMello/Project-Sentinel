import React, {useMemo} from 'react';
import Layout from '@theme/Layout';
import {normalizeHistory, useSentinelData} from '@site/src/components/MissionControl';
import styles from './styles.module.css';

const healthOf = (run) => run?.averageHealth ?? run?.health;
const runtimeOf = (run) => run?.durationSeconds ?? run?.runtimeSeconds;

function LineChart({runs,readValue,label,suffix=''}){
  const clean=runs.filter(r=>typeof readValue(r)==='number');
  if(clean.length<2)return <p className={styles.empty}>More published scans are needed for this chart.</p>;
  const values=clean.map(readValue),min=Math.min(...values),max=Math.max(...values),span=Math.max(1,max-min);
  const points=clean.map((r,i)=>`${(i/(clean.length-1))*100},${90-((readValue(r)-min)/span)*70}`).join(' ');
  return <div className={styles.chart}><div className={styles.chartHead}><strong>{label}</strong><span>{values[values.length-1]}{suffix} latest</span></div><svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label={label}><line x1="0" y1="90" x2="100" y2="90"/><line x1="0" y1="55" x2="100" y2="55"/><line x1="0" y1="20" x2="100" y2="20"/><polyline points={points}/>{clean.map((r,i)=>{const x=(i/(clean.length-1))*100,y=90-((readValue(r)-min)/span)*70;return <circle key={i} cx={x} cy={y} r="1.7"/>})}</svg><div className={styles.axis}><span>{new Date(clean[0].checkedAt).toLocaleDateString()}</span><span>{new Date(clean[clean.length-1].checkedAt).toLocaleDateString()}</span></div></div>
}

export default function Analytics(){
  const {loading,report,history,error}=useSentinelData();
  const runs=useMemo(()=>normalizeHistory(history).slice(-12),[history]);
  const metrics=useMemo(()=>{
    if(!runs.length) return {};
    const latest=runs[runs.length-1], previous=runs[runs.length-2];
    const healthValues=runs.map(healthOf).filter(Number.isFinite);
    const runtimeValues=runs.map(runtimeOf).filter(Number.isFinite);
    return {
      healthChange: previous ? healthOf(latest)-healthOf(previous) : 0,
      runtimeChange: previous && Number.isFinite(runtimeOf(previous)) ? runtimeOf(latest)-runtimeOf(previous) : 0,
      averageHealth: healthValues.length ? Math.round(healthValues.reduce((a,b)=>a+b,0)/healthValues.length) : 0,
      averageRuntime: runtimeValues.length ? Math.round(runtimeValues.reduce((a,b)=>a+b,0)/runtimeValues.length) : 0,
    };
  },[runs]);
  return <Layout title="Watcher Analytics"><main className={styles.page}><div className="container"><span className={styles.eyebrow}>WATCHER ANALYTICS</span><h1>Ecosystem intelligence</h1><p className={styles.lead}>Historical health, runtime and source reliability from published Watcher scans.</p>{loading&&<p>Loading analytics…</p>}{error&&<p>{error}</p>}{report&&<><section className={styles.summary}>{[
    ['Health',`${report.averageHealth}%`, metrics.healthChange ? `${metrics.healthChange>0?'▲ +':'▼ '}${metrics.healthChange}%`:'→'],
    ['Runtime',`${report.durationSeconds}s`, metrics.runtimeChange ? `${metrics.runtimeChange<0?'▼ ':'▲ +'}${Math.abs(metrics.runtimeChange)}s`:'→'],
    ['Average health',`${metrics.averageHealth}%`,'Published runs'],
    ['Average runtime',`${metrics.averageRuntime}s`,'Published runs'],
    ['Review queue',report.counts?.needsReview||0,'Current scan'],
    ['Updates',report.counts?.possibleUpdates||0,'Current scan']
  ].map(x=><div key={x[0]}><span>{x[0]}</span><strong>{x[1]}</strong><small>{x[2]}</small></div>)}</section><section className={styles.chartGrid}><LineChart runs={runs} readValue={healthOf} label="Ecosystem health trend" suffix="%"/><LineChart runs={runs} readValue={runtimeOf} label="Watcher runtime trend" suffix="s"/></section><section className={styles.panel}><h2>Recent scan history</h2><div className={styles.runs}>{runs.length?runs.slice().reverse().map((run,i)=>{const health=healthOf(run);const runtime=runtimeOf(run);return <div key={run.checkedAt||i}><span>{run.checkedAt?new Date(run.checkedAt).toLocaleString():'Published scan'}</span><div><i style={{width:`${health}%`}}/></div><strong>{health}%</strong><b>{Number.isFinite(runtime)?`${runtime}s`:'—'}</b></div>}):<p>No valid historical runs are published yet.</p>}</div></section><section className={styles.panel}><h2>Risk distribution</h2><div className={styles.risk}>{[['High',report.intelligenceCounts?.highRisk||0],['Medium',report.intelligenceCounts?.mediumRisk||0],['Low',report.intelligenceCounts?.lowRisk||0],['Stable',report.intelligenceCounts?.stable||0]].map(x=><div key={x[0]}><strong>{x[1]}</strong><span>{x[0]}</span></div>)}</div></section></>}</div></main></Layout>
}
