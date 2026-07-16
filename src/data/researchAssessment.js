const clamp=(value,min=0,max=100)=>Math.max(min,Math.min(max,Math.round(Number(value)||0)));

export function researchDimensions(project){
  if(!project?.researchDiscovered)return null;
  const sources=project.sources||[];
  const identity=clamp(project.identityConfidence??project.confidence??0);
  const sourceCredibility=clamp(project.sourceCredibility??(sources.length?Math.max(...sources.map(s=>s.score||0)):project.confidence||0));
  const documentation=clamp(project.documentationConfidence??(
    (project.description?.length>140?28:project.description?.length>50?18:8)+
    (project.developer&&project.developer!=='Unknown'?18:0)+
    ((project.dependencies||[]).length?18:0)+
    (sources.length>=3?22:sources.length*6)
  ));
  const compatibility=clamp(project.compatibilityConfidence??0);
  return {identity,sourceCredibility,documentation,compatibility};
}

export function compatibilityAssessment(projects,hardConflicts=[]){
  const research=projects.filter(p=>p.researchDiscovered||p.status==='research');
  if(hardConflicts.length)return null;
  if(!research.length)return null;
  const dimensions=research.map(researchDimensions).filter(Boolean);
  const compatibility=Math.min(...dimensions.map(d=>d.compatibility));
  const identity=Math.min(...dimensions.map(d=>d.identity));
  return {
    verdict: compatibility>=70?'Likely compatible — verify in a test branch':compatibility>=40?'Compatibility evidence is limited':'Compatibility not yet verified',
    summary: compatibility>=70
      ?'Research found supporting compatibility evidence, but the project is still awaiting Sentinel verification.'
      :'Sentinel verified that the project exists, but it has not found enough evidence to approve this combination.',
    confidence: Math.max(25,Math.min(88,Math.round(identity*.45+compatibility*.55))),
    recommendation: compatibility>=70?'Proceed with staged testing':'Use an isolated test branch',
    dimensions,
  };
}
