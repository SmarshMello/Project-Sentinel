import {registry, resolveDependency, statusMeta} from './registry';
import {createInstallPlan} from './installPlanner';
import {buildValidationChecklist, evaluateProjects} from './expertReasoning';

const norm=(v='')=>String(v).toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9.+# -]/g,' ').replace(/\s+/g,' ').trim();
const alias={
 'stop the ped':'stop-the-ped','stp':'stop-the-ped','ultimate backup':'ultimate-backup','ub':'ultimate-backup',
 'policing redefined':'policing-redefined','rage plugin hook':'rage-plugin-hook','rph':'rage-plugin-hook','lspdfr':'lspdfr',
 'rage native ui':'ragenativeui','rage nativeui':'ragenativeui','ragenativeui':'ragenativeui','grammar police':'grammar-police',
 'eup':'eup-menu','eup menu':'eup-menu','emergency uniforms pack':'eup-menu','lennys mod loader':'lennys-mod-loader','lenny s mod loader':'lennys-mod-loader','lml':'lennys-mod-loader','compulite':'compulite','openiv':'openiv','script hook v':'scripthookv','lemonui':'lemonui'};
const conflicts=[
 {ids:['policing-redefined','stop-the-ped'],reason:'Policing Redefined is an alternative policing stack and should not be installed beside Stop The Ped.'},
 {ids:['policing-redefined','ultimate-backup'],reason:'Policing Redefined overlaps with Ultimate Backup and belongs in a separate build branch.'},
 {ids:['policing-redefined','compulite'],reason:'The registry documents CompuLite as incompatible with the Policing Redefined branch.'}
];
export const expertExamples=['Can I install Grammar Police, Stop The Ped, Ultimate Backup and CompuLite together?','Can I install Policing Redefined with Stop The Ped?','What version of RAGENativeUI should I use?','What does Ultimate Backup require?','Show me callout packs in testing.','Why is EUP Menu not working?'];
function combinedRegistry(discoveries=[]){const out=new Map(registry.map(p=>[p.id,p]));for(const item of discoveries||[]){if(!item?.id||out.has(item.id))continue;out.set(item.id,{...item,status:item.status||'research',compatibilityStatus:'research',profile:item.profile||'/plugins',watcherTracked:false,researchDiscovered:true});}return [...out.values()];}
function phraseMatch(text, phrase){
 const target=norm(phrase);
 if(!target)return false;
 const escaped=target.replace(/[-/\\^$*+?.()|[\]{}]/g,'\\$&').replace(/ /g,'\\s+');
 return new RegExp(`(^|\\b)${escaped}(?=\\b|$)`,'i').test(text);
}
function standaloneTokenMatch(text, token){
 const target=norm(token);
 if(!target||target.length<2)return false;
 return text.split(' ').includes(target);
}
export function findProjects(q,discoveries=[]){
 const t=norm(q),all=combinedRegistry(discoveries),out=new Map();
 Object.entries(alias).forEach(([a,id])=>{if(phraseMatch(t,a)){const p=all.find(x=>x.id===id);if(p)out.set(p.id,p);}});
 all.forEach(p=>{
  const names=[p.name,...(p.aliases||[]),String(p.id||'').replaceAll('-',' ')].filter(Boolean);
  if(names.some(n=>phraseMatch(t,n)))out.set(p.id,p);
  // Short names such as SUP, UB, or RPH are accepted only as complete tokens.
  if(p.shortName&&standaloneTokenMatch(t,p.shortName))out.set(p.id,p);
 });
 return [...out.values()];
}
function cleanCandidate(value){return String(value||'').replace(/^(can i|could i|should i|does|do|is|are|what is|tell me about|will)\s+/i,'').replace(/\b(work|working|compatible|together|install|use|mod|plugin|require|requires|need|version|latest|update)\b/gi,' ').replace(/[?.,!]/g,' ').replace(/\s+/g,' ').trim();}
function unknownCandidate(q,projects,discoveries=[]){const parts=String(q||'').split(/\s+(?:and|with|plus|alongside)\s+|,/i).map(cleanCandidate).filter(x=>x.length>=3);for(const part of parts){if(!findProjects(part,discoveries).length)return part;}if(projects.length)return null;const raw=cleanCandidate(q);return raw.length>=3&&raw.length<=120?raw:null;}
function intent(q,projects){const t=norm(q);if(/crash|freez|stutter|not load|not work|error|broken|issue/.test(t))return'doctor';if(/install order|order should|what first|before installing|how do i install/.test(t))return'install';if(/compatible|work with|together|conflict|install .* with|use .* with/.test(t)||projects.length>1)return'compatibility';if(/depend|require|need before|prerequisite/.test(t))return'dependencies';if(/version|update|latest|which release/.test(t))return'project';if(/show|list|find|what mods|which mods/.test(t))return'search';return projects.length?'project':'help';}
function search(q){const terms=norm(q).replace(/show|list|find|what|which|mods|plugins|project|projects/g,'').split(' ').filter(x=>x.length>2);return registry.filter(p=>terms.every(term=>norm([p.name,p.category,p.developer,p.description,p.status,...(p.tags||[]),...(p.dependencies||[])].join(' ')).includes(term))).slice(0,12);}
function liveMap(report){return new Map((report?.items||[]).map(item=>[item.id,item]));}
function attachLive(projects,report){const map=liveMap(report);return projects.map(p=>({...p,watcher:map.get(p.id)||null,watcherTracked:map.has(p.id)}));}
function sourceSummary(projects){const tracked=projects.filter(p=>p.watcherTracked);if(!tracked.length)return null;const degraded=tracked.filter(p=>p.watcher?.status!=='healthy');const updates=tracked.filter(p=>['possible-update','metadata-changed'].includes(p.watcher?.status));return {tracked:tracked.length,degraded,updates,checkedAt:tracked.map(p=>p.watcher?.checkedAt).filter(Boolean).sort().at(-1)||null};}
export function answerExpertQuestion(q,report=null,discoveries=[]){const baseProjects=findProjects(q,discoveries),type=intent(q,baseProjects);let projects=attachLive(baseProjects,report);let result={type,projects,mentions:projects,tone:'info',verdict:'Registry answer',summary:'This answer comes from the Sentinel Unified Registry.',watcher:sourceSummary(projects)};
 if(type==='compatibility'){const ids=projects.map(p=>p.id);const hits=conflicts.filter(r=>r.ids.every(id=>ids.includes(id)));const risky=projects.filter(p=>['conflict','legacy','testing','research'].includes(p.status));const reasoning=evaluateProjects(projects,hits);result={...result,tone:hits.length?'danger':risky.length?'warning':'success',verdict:hits.length?'Not recommended':projects.length<2?'Name two projects':reasoning.recommendation,summary:hits.length?'Sentinel found a documented conflict or mutually exclusive stack.':projects.length<2?'Add a second project name for a pairwise check.':risky.length?'No direct conflict was found, but one or more projects are not fully verified.':'No hard conflict rule currently matches this combination.',warnings:[...hits.map(x=>x.reason),...risky.map(p=>`${p.name} is classified as ${statusMeta[p.status]?.label||p.status}; test it outside the Golden Build.`)],reasoning};}
 if(type==='dependencies'){const reasoning=evaluateProjects(projects,[]);result={...result,reasoning,verdict:projects.length?'Dependency report':'Project needed',summary:projects.length?'Dependencies are pulled directly from the unified registry.':'Name a project to inspect its requirements.'};}
 if(type==='install'){const plan=createInstallPlan(projects);const reasoning=evaluateProjects(projects,[]);result={...result,installPlan:plan.steps,installWarnings:plan.unresolved,installCycles:plan.cycles,validationChecklist:buildValidationChecklist(projects),reasoning,tone:projects.length?'success':'neutral',verdict:projects.length?'Recommended install plan':'Project needed',summary:projects.length?'Dependencies are placed before each selected project, with the verified Sentinel foundation first. Install one optional layer at a time and validate after each stage.':'Name at least one project to generate an install plan.'};}
 if(type==='search'){const matches=attachLive(search(q),report);result={...result,projects:matches,mentions:[],watcher:sourceSummary(matches),tone:matches.length?'success':'neutral',verdict:`${matches.length} registry match${matches.length===1?'':'es'}`,summary:matches.length?'Filtered from the complete Sentinel registry.':'No project matched every search term.'};}
 if(type==='project'&&projects.length)result={...result,reasoning:evaluateProjects(projects,[])};
 if(type==='doctor')result={...result,tone:'warning',verdict:'Continue in Sentinel Doctor',summary:projects.length?`Recognized ${projects.map(p=>p.name).join(', ')}. Doctor can combine these projects with versions, symptoms, logs, and repair rules.`:'Troubleshooting needs environment details and preferably a log. Sentinel Doctor is built for that workflow.'};
 if(type==='help')result={...result,tone:'neutral',verdict:'Ask about a project or stack',summary:'Expert answers versions, dependencies, install order, compatibility, live Watcher status, registry searches, and troubleshooting handoffs.'};
 const unknown=unknownCandidate(q,projects,discoveries);if(unknown){result={...result,type:'unknown',tone:'warning',verdict:'Project not yet known',summary:`Sentinel could not match “${unknown}” to the unified registry or published research results. A Watcher research request can collect candidate official sources, dependencies, and compatibility clues for review.`,unknownProject:unknown};}
 result.dependencies=projects.map(plugin=>({plugin,items:(plugin.dependencies||[]).map(name=>({name,project:resolveDependency(name)}))}));return result;}
export {statusMeta};
