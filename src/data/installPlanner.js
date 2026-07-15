import {registry, resolveDependency} from './registry';

const FOUNDATION=['openiv','scripthookv','rage-plugin-hook','lspdfr'];

export function createInstallPlan(projects){
  const seen=new Set();
  const visiting=new Set();
  const steps=[];
  const unresolved=[];
  const cycles=[];
  function add(project,reason,depth=0){
    if(!project)return;
    if(seen.has(project.id))return;
    if(visiting.has(project.id)){cycles.push(project.name);return;}
    visiting.add(project.id);
    for(const name of project.dependencies||[]){
      const dep=resolveDependency(name);
      if(dep)add(dep,`Required by ${project.name}`,depth+1);
      else unresolved.push({project:project.name,dependency:name});
    }
    visiting.delete(project.id);
    seen.add(project.id);
    steps.push({project,reason,depth});
  }
  FOUNDATION.forEach(id=>add(registry.find(p=>p.id===id),'Verified Sentinel foundation'));
  projects.forEach(p=>add(p,'Selected project'));
  return {steps,unresolved,cycles};
}
