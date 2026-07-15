import {registry, resolveDependency, statusMeta} from './registry';

const norm=(v='')=>String(v).toLowerCase().replace(/[’']/g,"'").replace(/[^a-z0-9.+#' -]/g,' ').replace(/\s+/g,' ').trim();
const alias={
 'stop the ped':'stop-the-ped','stp':'stop-the-ped','ultimate backup':'ultimate-backup','ub':'ultimate-backup',
 'policing redefined':'policing-redefined','rage plugin hook':'rage-plugin-hook','rph':'rage-plugin-hook','lspdfr':'lspdfr',
 'rage native ui':'ragenativeui','rage nativeui':'ragenativeui','ragenativeui':'ragenativeui','grammar police':'grammar-police',
 'eup menu':'eup-menu','compulite':'compulite','openiv':'openiv','script hook v':'scripthookv','lemonui':'lemonui'};
const conflicts=[
 {ids:['policing-redefined','stop-the-ped'],reason:'Policing Redefined is an alternative policing stack and should not be installed beside Stop The Ped.'},
 {ids:['policing-redefined','ultimate-backup'],reason:'Policing Redefined overlaps with Ultimate Backup and belongs in a separate build branch.'},
 {ids:['policing-redefined','compulite'],reason:'The registry documents CompuLite as incompatible with the Policing Redefined branch.'}
];
export const expertExamples=['Can I install Policing Redefined with Stop The Ped?','What version of RAGENativeUI should I use?','What does Ultimate Backup require?','Show me callout packs in testing.','Why is EUP Menu not working?'];
export function findProjects(q){const t=norm(q),out=new Map();Object.entries(alias).forEach(([a,id])=>{if(t.includes(a)){const p=registry.find(x=>x.id===id);if(p)out.set(p.id,p);}});registry.forEach(p=>{const names=[p.name,p.shortName,p.id].filter(Boolean).map(norm);if(names.some(n=>n.length>2&&t.includes(n)))out.set(p.id,p);});return [...out.values()];}
function intent(q,projects){const t=norm(q);if(/crash|freez|stutter|not load|not work|error|broken|issue/.test(t))return'doctor';if(/compatible|work with|together|conflict|install .* with|use .* with/.test(t)||projects.length>1)return'compatibility';if(/depend|require|need before|prerequisite/.test(t))return'dependencies';if(/version|update|latest|which release/.test(t))return'project';if(/show|list|find|what mods|which mods/.test(t))return'search';return projects.length?'project':'help';}
function search(q){const terms=norm(q).replace(/show|list|find|what|which|mods|plugins|project|projects/g,'').split(' ').filter(x=>x.length>2);return registry.filter(p=>terms.every(term=>norm([p.name,p.category,p.developer,p.description,p.status,...(p.tags||[]),...(p.dependencies||[])].join(' ')).includes(term))).slice(0,12);}
export function answerExpertQuestion(q){const projects=findProjects(q),type=intent(q,projects);let result={type,projects,mentions:projects,tone:'info',verdict:'Registry answer',summary:'This answer comes from the Sentinel Unified Registry.'};
 if(type==='compatibility'){const ids=projects.map(p=>p.id);const hits=conflicts.filter(r=>r.ids.every(id=>ids.includes(id)));result={...result,tone:hits.length?'danger':projects.some(p=>['conflict','legacy','testing','research'].includes(p.status))?'warning':'success',verdict:hits.length?'Not recommended':projects.length<2?'Name two projects':'No documented direct conflict',summary:hits.length?'Sentinel found a documented conflict or mutually exclusive stack.':projects.length<2?'Add a second project name for a pairwise check.':'No hard conflict rule currently matches this combination.',warnings:hits.map(x=>x.reason)};}
 if(type==='dependencies')result={...result,verdict:projects.length?'Dependency report':'Project needed',summary:projects.length?'Dependencies are pulled directly from the unified registry.':'Name a project to inspect its requirements.'};
 if(type==='search'){const matches=search(q);result={...result,projects:matches,mentions:[],tone:matches.length?'success':'neutral',verdict:`${matches.length} registry match${matches.length===1?'':'es'}`,summary:matches.length?'Filtered from the complete Sentinel registry.':'No project matched every search term.'};}
 if(type==='doctor')result={...result,tone:'warning',verdict:'Continue in Sentinel Doctor',summary:projects.length?`Recognized ${projects.map(p=>p.name).join(', ')}. Doctor can combine these projects with versions, symptoms, logs, and repair rules.`:'Troubleshooting needs environment details and preferably a log. Sentinel Doctor is built for that workflow.'};
 if(type==='help')result={...result,tone:'neutral',verdict:'Ask about a project or stack',summary:'Expert currently answers versions, dependencies, compatibility, registry searches, and troubleshooting handoffs.'};
 result.dependencies=projects.map(plugin=>({plugin,items:(plugin.dependencies||[]).map(name=>({name,project:resolveDependency(name)}))}));return result;}
export {statusMeta};
