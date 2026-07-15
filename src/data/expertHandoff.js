const STORAGE_KEY='sentinel-expert-context-v1';

function compactProject(project){
  return {
    id:project.id,
    name:project.name,
    version:project.watcher?.detectedVersion||project.version||'Not locked',
    status:project.status,
    category:project.category,
    profile:project.profile,
    watcherStatus:project.watcher?.status||null,
    watcherHealth:Number.isFinite(project.watcher?.healthScore)?project.watcher.healthScore:null,
  };
}

export function createExpertContext(question,result){
  const projects=(result?.projects||result?.mentions||[]).map(compactProject);
  return {
    schema:1,
    createdAt:new Date().toISOString(),
    question,
    verdict:result?.verdict||'Sentinel recommendation',
    summary:result?.summary||'',
    confidence:result?.reasoning?.confidence??null,
    recommendation:result?.reasoning?.recommendation||result?.verdict||'',
    warnings:result?.warnings||[],
    validationChecklist:result?.validationChecklist||[],
    installPlan:(result?.installPlan||[]).map((step,index)=>({
      order:index+1,
      id:step.project.id,
      name:step.project.name,
      version:step.project.version||'Not locked',
      reason:step.reason,
      profile:step.project.profile,
    })),
    projects,
  };
}

export function saveExpertContext(context){
  if(typeof window==='undefined')return false;
  try{window.localStorage.setItem(STORAGE_KEY,JSON.stringify(context));return true;}catch{return false;}
}

export function loadExpertContext(){
  if(typeof window==='undefined')return null;
  try{const raw=window.localStorage.getItem(STORAGE_KEY);return raw?JSON.parse(raw):null;}catch{return null;}
}

export function clearExpertContext(){
  if(typeof window==='undefined')return;
  try{window.localStorage.removeItem(STORAGE_KEY);}catch{}
}

export function expertContextToText(context){
  const lines=[
    'PROJECT SENTINEL EXPERT RECOMMENDATION',
    '======================================',
    `Generated: ${new Date(context.createdAt||Date.now()).toLocaleString()}`,
    `Question: ${context.question||'—'}`,
    `Verdict: ${context.verdict||'—'}`,
    context.confidence!=null?`Confidence: ${context.confidence}%`:null,
    '',
    context.summary||'',
  ].filter(v=>v!==null);
  if(context.projects?.length){lines.push('','PROJECTS');context.projects.forEach(p=>lines.push(`- ${p.name} · ${p.version} · ${p.status}${p.watcherStatus?` · Watcher ${p.watcherStatus}`:''}`));}
  if(context.warnings?.length){lines.push('','WARNINGS');context.warnings.forEach(x=>lines.push(`- ${x}`));}
  if(context.installPlan?.length){lines.push('','INSTALL ORDER');context.installPlan.forEach(x=>lines.push(`${x.order}. ${x.name} — ${x.reason}`));}
  if(context.validationChecklist?.length){lines.push('','VALIDATION CHECKLIST');context.validationChecklist.forEach(x=>lines.push(`[ ] ${x}`));}
  lines.push('','Source: Project Sentinel Unified Registry and latest published Watcher report.','This report is guidance, not automatic proof. Back up the build and test one change at a time.');
  return lines.join('\n');
}

export function downloadExpertContext(context){
  if(typeof window==='undefined')return;
  const blob=new Blob([expertContextToText(context)],{type:'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const anchor=document.createElement('a');
  anchor.href=url;
  anchor.download=`sentinel-expert-${new Date().toISOString().slice(0,10)}.txt`;
  document.body.appendChild(anchor);anchor.click();anchor.remove();URL.revokeObjectURL(url);
}
