import {resolveDependency, statusMeta} from './registry';

const STATUS_PENALTY={verified:0,community:8,documented:12,testing:22,conflict:30,legacy:28,research:38,deprecated:50};

export function evaluateProjects(projects, conflictHits=[]){
  const reasons=[];
  let confidence=96;
  if(!projects.length)return {confidence:0,recommendation:'More information needed',reasons:[{kind:'neutral',text:'Name at least one project so Sentinel can evaluate it.'}]};
  for(const project of projects){
    const meta=statusMeta[project.status];
    const penalty=STATUS_PENALTY[project.status]??15;
    confidence-=Math.round(penalty/projects.length);
    if(project.status==='verified')reasons.push({kind:'positive',text:`${project.name} is Sentinel Verified for the current documented baseline.`});
    else reasons.push({kind:'warning',text:`${project.name} is classified as ${meta?.label||project.status}, so its result needs more caution.`});
    if(project.watcherTracked){
      if(project.watcher?.status==='healthy')reasons.push({kind:'positive',text:`${project.name}'s latest monitored source check is healthy.`});
      else {confidence-=6;reasons.push({kind:'warning',text:`${project.name}'s latest source signal is ${String(project.watcher?.status||'unknown').replaceAll('-',' ')}.`});}
    } else {
      confidence-=4;
      reasons.push({kind:'neutral',text:`${project.name} is not yet covered by Watcher, so live source health is unavailable.`});
    }
  }
  for(const hit of conflictHits){confidence-=24;reasons.unshift({kind:'negative',text:hit.reason});}
  const unresolved=[];
  projects.forEach(project=>(project.dependencies||[]).forEach(name=>{if(!resolveDependency(name))unresolved.push(`${project.name}: ${name}`);}));
  if(unresolved.length){confidence-=Math.min(12,unresolved.length*2);reasons.push({kind:'warning',text:`${unresolved.length} dependency name${unresolved.length===1?' is':'s are'} documented but not represented as a full registry profile.`});}
  confidence=Math.max(12,Math.min(99,confidence));
  let recommendation='Proceed with staged testing';
  if(conflictHits.length)recommendation='Do not combine these projects';
  else if(projects.some(p=>['deprecated','research'].includes(p.status)))recommendation='Do not use in a production build';
  else if(projects.some(p=>['conflict','legacy','testing'].includes(p.status)))recommendation='Use an isolated test branch';
  else if(projects.every(p=>p.status==='verified'))recommendation='Approved for the documented Sentinel baseline';
  return {confidence,recommendation,reasons};
}

export function buildValidationChecklist(projects){
  const checks=[
    'Launch GTA V without loading optional plugins.',
    'Start RAGE Plugin Hook and confirm the console reports no dependency errors.',
    'Load LSPDFR and go on duty before adding the next optional project.',
  ];
  const categories=new Set(projects.map(p=>p.category));
  if([...categories].some(x=>/callout/i.test(x)))checks.push('Force or naturally receive one callout and complete it without an exception.');
  if([...categories].some(x=>/uniform|eup/i.test(x)))checks.push('Open EUP Menu, change an outfit, and verify textures persist after duty reload.');
  if(projects.some(p=>/backup/i.test(`${p.name} ${(p.tags||[]).join(' ')}`)))checks.push('Request one patrol unit and one specialist backup unit.');
  if(projects.some(p=>/traffic|ped|policing/i.test(`${p.name} ${(p.tags||[]).join(' ')}`)))checks.push('Complete a traffic stop, pedestrian interaction, arrest, and transport handoff.');
  checks.push('Review RAGEPluginHook.log after a 15-minute test patrol.');
  return checks;
}
