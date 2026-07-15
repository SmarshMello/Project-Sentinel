import {diagnosticRules} from '@site/src/data/diagnostics';

const confidenceWeight={high:8,medium:4,low:1};
const kindWeight={'root-cause':8,'missing-component':4,configuration:3,symptom:0};
const noteMarkers=[/sentinel doctor test notes/i,/likely root causes/i,/expected fix order/i,/recommended repair path/i,/user notes/i,/suggested fix/i,/expected result/i,/test notes/i];
const positiveSignals={
  'heap-adjuster-missing':[/heap\s*adjuster.*detected/i,/heapadjuster.*detected/i],
  'gameconfig-packfiles':[/verified\s+gameconfig\s+detected/i,/gameconfig.*verified/i],
  'rph-version':[/rage plugin hook v1\.130\.1406\.17682/i,/gta v legacy 1\.0\.3788\.0/i],
  'wrong-plugin-folder':[/loaded:\s*[^\r\n]+\.dll/i],
};
function resetTest(re,text){re.lastIndex=0;return re.test(text);}
function runtimeLines(text){const lines=text.split(/\r?\n/);let ignore=false;return lines.filter(line=>{if(noteMarkers.some(re=>re.test(line))){ignore=true;return false;}if(ignore&&/^\s*(?:\[?\d{1,2}:\d{2}:\d{2}|fatal|error|warning|info|exception)/i.test(line))ignore=false;return !ignore;});}
function matchingLines(lines,patterns,max=5){return lines.filter(line=>patterns.some(p=>resetTest(p,line))).slice(0,max);}
function confidencePercent(score,evidenceCount,conflicts){let pct=42+Math.min(43,score)+Math.min(10,evidenceCount*2)-Math.min(18,conflicts*6);return Math.max(35,Math.min(99,Math.round(pct)));}
function chainFor(rule,evidenceText){
  if(rule.id==='ragenativeui'){
    const chain=[];
    if(/duplicate assembly detected/i.test(evidenceText))chain.push('Duplicate RAGENativeUI assembly detected');
    if(/using[^\n]*ragenativeui[^\n]*version\s*[\d.]+/i.test(evidenceText)||/installed\s*:\s*[\d.]+/i.test(evidenceText))chain.push('Older RAGENativeUI copy selected');
    if(/expected(?: verified)? version\s*[\d.]+\+?|required\s*:\s*[\d.]+\+?/i.test(evidenceText))chain.push('Loaded version is below the required version');
    if(/missingmethodexception/i.test(evidenceText))chain.push('Required menu API method is unavailable');
    if(/failed to (?:initialize|register menu)/i.test(evidenceText))chain.push('Dependent police plugin initialization failed');
    if(/eup menu disabled/i.test(evidenceText))chain.push('EUP Menu was disabled as a downstream symptom');
    return chain;
  }
  if(rule.id==='heap-adjuster-missing')return ['Heap Adjuster was not detected','Stability component must be restored before further testing'];
  if(rule.id==='gameconfig-packfiles')return ['Installed GameConfig failed verification','Configuration should be replaced with the exact Legacy-build match'];
  return [];
}
export function analyzeDiagnostics(input,{context=''}={}){
 const raw=input||'';const evidence=runtimeLines(raw);const evidenceText=evidence.join('\n');const normalized=`${context}\n${evidenceText}`.toLowerCase();
 let matches=diagnosticRules.map(rule=>{
  const keywords=(rule.keywords||[]).filter(k=>normalized.includes(k.toLowerCase()));
  const patterns=(rule.logPatterns||[]).filter(p=>resetTest(p,evidenceText));
  const required=rule.requirePatterns||[];
  if(required.length&&!required.some(p=>resetTest(p,evidenceText)))return null;
  const evidenceLines=matchingLines(evidence,[...(rule.logPatterns||[]),...required]);
  if(!keywords.length&&!patterns.length&&!evidenceLines.length)return null;
  const contradictions=(positiveSignals[rule.id]||[]).filter(p=>resetTest(p,evidenceText));
  if(contradictions.length)return null;
  let score=keywords.length*2+patterns.length*6+(confidenceWeight[rule.confidence]||0)+(kindWeight[rule.kind]||0)+(rule.specificity||0);
  if(rule.id==='ragenativeui'){
    if(/duplicate assembly detected/i.test(evidenceText))score+=24;
    if(/using[^\n]*version\s*[\d.]+[\s\S]{0,160}expected(?: verified)? version\s*[\d.]+\+?/i.test(evidenceText))score+=24;
    if(/ragenativeui[\s\S]{0,300}installed\s*:\s*[\d.]+[\s\S]{0,120}required\s*:\s*[\d.]+\+?/i.test(evidenceText))score+=20;
    if(/missingmethodexception/i.test(evidenceText)&&/ragenativeui\./i.test(evidenceText))score+=18;
    if(/failed to (?:initialize|register menu)/i.test(evidenceText))score+=8;
  }
  if(rule.id==='heap-adjuster-missing'&&/heap\s*adjuster.*(?:not detected|missing|not found)/i.test(evidenceText))score+=8;
  if(rule.id==='gameconfig-packfiles'&&/hash does not match|incorrect gameconfig|gameconfig.*unverified/i.test(evidenceText))score+=12;
  return {...rule,score,evidenceLines,causalChain:chainFor(rule,evidenceText)};
 }).filter(Boolean);
 const ids=new Set(matches.map(m=>m.id));const suppressed=new Set();
 matches.forEach(m=>(m.suppresses||[]).forEach(id=>ids.has(id)&&suppressed.add(id)));
 if(ids.has('ragenativeui')){suppressed.add('lml-eup');suppressed.add('missing-dependency');}
 if(/loaded:\s*[^\r\n]+\.dll/i.test(evidenceText)&&!/plugin.*(?:not found|failed to load plugin|could not load plugin)/i.test(evidenceText))suppressed.add('wrong-plugin-folder');
 matches=matches.filter(m=>!suppressed.has(m.id));
 const hasSpecific=matches.some(m=>(m.specificity||0)>=3&&!['generic-crash','performance'].includes(m.id));
 if(hasSpecific)matches=matches.filter(m=>!['generic-crash','performance'].includes(m.id));
 matches.sort((a,b)=>b.score-a.score);
 matches=matches.map((m,i)=>{
   const conflictCount=matches.slice(0,i).filter(x=>x.kind==='root-cause').length;
   return {...m,confidencePercent:confidencePercent(m.score,m.evidenceLines?.length||0,conflictCount)};
 });
 const ruledOut=[];
 if(/heap\s*adjuster.*detected/i.test(evidenceText))ruledOut.push('Heap Adjuster missing');
 if(/verified\s+gameconfig\s+detected|gameconfig.*verified/i.test(evidenceText))ruledOut.push('Incorrect GameConfig');
 if(/packfile limit adjuster.*detected/i.test(evidenceText))ruledOut.push('Packfile Limit Adjuster missing');
 if(/gta v legacy 1\.0\.3788\.0/i.test(evidenceText)&&/rage plugin hook v1\.130\.1406\.17682/i.test(evidenceText))ruledOut.push('Verified GTA/RPH baseline mismatch');
 return {matches,ruledOut,ignoredLineCount:raw.split(/\r?\n/).length-evidence.length};
}
