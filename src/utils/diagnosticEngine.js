import {diagnosticRules} from '../data/diagnostics.js';
const noteMarkers=[/sentinel doctor test notes/i,/likely root causes/i,/expected fix order/i,/recommended repair path/i,/user notes/i,/suggested fix/i,/expected result/i,/test notes/i];
const timestamp=/^\s*\[?(\d{1,2}:\d{2}:\d{2}(?:\.\d+)?)\]?/;
const successWords=/\b(?:verified|detected|loaded successfully|initialized successfully|passed|healthy|available|compatible|supported)\b/i;
const failureWords=/\b(?:error|fatal|exception|failed|failure|missing|not found|not detected|unsupported|invalid|blocked|timed out|mismatch|skipped|aborted|quarantined)\b/i;
function hit(re,text){re.lastIndex=0;return re.test(text)}
function splitEvidence(raw){const all=raw.split(/\r?\n/),kept=[];let ignoring=false;for(const line of all){if(noteMarkers.some(r=>hit(r,line))){ignoring=true;continue}if(ignoring&&timestamp.test(line))ignoring=false;if(!ignoring)kept.push(line)}return {lines:kept,ignored:all.length-kept.length}}
function evidenceFor(lines,patterns,max=6){return lines.filter(line=>patterns.some(p=>hit(p,line))&&(!successWords.test(line)||failureWords.test(line))).slice(0,max)}
function firstFailureIndex(lines){const i=lines.findIndex(l=>failureWords.test(l));return i<0?99999:i}
function causalChain(rule,text){const chains={
 'scripthookv-version':['Installed GTA build is unsupported by ScriptHookV','ScriptHookV initialization failed','ASI Loader was skipped','LSPDFR could not initialize','Police plugins were unavailable','Startup aborted'],
 'rph-version':['Installed GTA build is unsupported by RAGE Plugin Hook','RPH could not hook the game process','LSPDFR never received a valid host','Police plugins could not start'],
 'asi-loader':['ASI Loader or dinput8.dll failed','ASI plugins were not injected','OpenIV/ScriptHook components were unavailable','Modded startup could not continue'],
 'ragenativeui':['Wrong or duplicate RAGENativeUI copy was selected','Required menu API was unavailable','Dependent plugin initialization failed','EUP/menu features failed downstream'],
 'gameconfig-packfiles':['GameConfig failed exact-build verification','Archive/limit configuration became unreliable','DLC or vehicle content could not mount safely'],
 'xml-config':['Plugin opened its XML configuration','Parser reached malformed XML','Plugin initialization stopped at the reported line'],
 'plugin-timeout':['Plugin began execution','Plugin or game fiber stopped responding','RPH aborted the plugin after the timeout'],
 'callout-crash':['Callout started or was offered','Callout-specific handler threw an exception','Only that callout/plugin was aborted'],
};return chains[rule.id]||[]}
function versionBonus(id,text){if(id==='scripthookv-version'){const a=text.match(/installed gta build:\s*([\d.]+)/i),b=text.match(/supported by current scripthookv:\s*([\d.]+)/i);return a&&b&&a[1]!==b[1]?35:0}return 0}
export function analyzeDiagnostics(input,{context=''}={}){
 const raw=input||'',parsed=splitEvidence(raw),lines=parsed.lines,text=lines.join('\n'),combined=`${context}\n${text}`;
 let results=[];
 for(const rule of diagnosticRules){
   const positives=(rule.logPatterns||[]).filter(p=>hit(p,text));
   const keywordHits=(rule.keywords||[]).filter(k=>combined.toLowerCase().includes(k.toLowerCase()));
   const negatives=(rule.negativePatterns||[]).filter(p=>hit(p,text));
   if(!positives.length&&(!context.trim()||!keywordHits.length))continue;
   const directFailure=positives.some(p=>lines.some(l=>hit(p,l)&&failureWords.test(l)));
   if(negatives.length&&!directFailure)continue;
   const evidenceLines=evidenceFor(lines,rule.logPatterns||[]);
   if(!evidenceLines.length&&!directFailure&&negatives.length)continue;
   let score=(rule.specificity||0)*5+positives.length*10+keywordHits.length*2+versionBonus(rule.id,text)-negatives.length*24;
   const first=Math.min(...evidenceLines.map(l=>lines.indexOf(l)).filter(i=>i>=0),99999);
   score+=Math.max(0,12-Math.min(12,first-firstFailureIndex(lines)));
   if(directFailure)score+=12;
   results.push({...rule,score,evidenceLines,negativeHitCount:negatives.length,causalChain:causalChain(rule,text)});
 }
 const ids=new Set(results.map(r=>r.id)),suppressed=new Set();
 for(const r of results)for(const id of r.suppresses||[])if(ids.has(id))suppressed.add(id);
 if(ids.has('openiv-mods-folder'))suppressed.add('asi-loader');
 if(ids.has('scripthookv-version'))['asi-loader','rph-version','wrong-plugin-folder','generic-crash','plugin-timeout'].forEach(x=>suppressed.add(x));
 if(ids.has('rph-version'))['wrong-plugin-folder','generic-crash','plugin-timeout'].forEach(x=>suppressed.add(x));
 if(ids.has('ragenativeui'))['duplicate-assembly','missing-dependency','lml-eup','generic-crash'].forEach(x=>suppressed.add(x));
 if(ids.has('xml-config')||ids.has('ini-config'))suppressed.add('generic-crash');
 if(ids.has('callout-crash'))suppressed.add('generic-crash');
 results=results.filter(r=>!suppressed.has(r.id));
 const specific=results.some(r=>(r.specificity||0)>=6&&r.kind!=='symptom');if(specific)results=results.filter(r=>!['generic-crash','performance'].includes(r.id));
 results.sort((a,b)=>b.score-a.score);
 results=results.map((r,i)=>({...r,confidencePercent:Math.max(38,Math.min(99,Math.round(48+r.score*.55-i*4)))}));
 const ruledOut=[];
 const checks=[
  [/heap\s*adjuster.*detected/i,'Heap Adjuster missing'],[/packfile limit adjuster.*detected/i,'Packfile Limit Adjuster missing'],[/verified gameconfig detected|gameconfig.*verified/i,'Incorrect GameConfig'],[/ragenativeui.*(?:verified|loaded successfully|initialized successfully)/i,'RAGENativeUI dependency failure'],[/asi loader.*(?:loaded|initialized successfully)/i,'ASI Loader failure'],[/lspd first response.*loaded successfully/i,'LSPDFR base-plugin load failure'],[/battleye.*disabled|-nobattleye.*active/i,'BattlEye blocking startup']];
 for(const [p,label] of checks)if(hit(p,text)&&!results.some(r=>r.title.includes(label)))ruledOut.push(label);
 const timeline=lines.map((line,index)=>{const t=line.match(timestamp);if(!t)return null;let state='info';if(/fatal|exception|error|failed|unsupported|missing|not found|blocked|aborted/i.test(line))state='failure';else if(successWords.test(line))state='success';else if(/warning|skipped|unavailable/i.test(line))state='warning';return {time:t[1],text:line.replace(timestamp,'').trim().slice(0,180),state,index}}).filter(Boolean).slice(0,24);
 const needsMoreEvidence=!results.length?['Include the first exception and 20–50 lines before it.','Include exact GTA, RPH, LSPDFR and ScriptHookV versions.','State the last file or mod changed.']:[];
 return {matches:results,ruledOut,ignoredLineCount:parsed.ignored,timeline,needsMoreEvidence,engineVersion:'3.0.0'};
}
