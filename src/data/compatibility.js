export const compatibilityStatuses = {
  verified: {label: 'Verified', tone: 'green', rank: 1},
  compatible: {label: 'Compatible', tone: 'blue', rank: 2},
  testing: {label: 'Testing', tone: 'yellow', rank: 3},
  research: {label: 'Research', tone: 'purple', rank: 4},
  deprecated: {label: 'Deprecated', tone: 'red', rank: 5},
};

export const compatibilityRows = [
  {id:'lspdfr', component:'LSPD First Response', version:'0.4.9 · 0.4.9572', category:'Foundation', status:'verified', legacy3788:'Yes', goldenBuild:true, impact:'Medium', confidence:100, note:'Core police framework for the current Sentinel baseline.', guide:'/guide/core/lspdfr'},
  {id:'rage-plugin-hook', component:'RAGE Plugin Hook', version:'1.130.1406.17682', category:'Foundation', status:'verified', legacy3788:'Yes', goldenBuild:true, impact:'Low', confidence:100, note:'Use the build bundled with the verified LSPDFR package.', guide:'/guide/core/rage-plugin-hook'},
  {id:'openiv', component:'OpenIV', version:'Current official release', category:'Foundation', status:'verified', legacy3788:'Yes', goldenBuild:true, impact:'None', confidence:100, note:'Archive edits must target the mods folder.', guide:'/guide/core/openiv'},
  {id:'stop-the-ped', component:'Stop The Ped', version:'4.9.5.4', category:'Police systems', status:'verified', legacy3788:'Yes', goldenBuild:true, impact:'Low', confidence:100, note:'Installed and working in the current verified build.', guide:'/guide/police/stop-the-ped'},
  {id:'ultimate-backup', component:'Ultimate Backup', version:'Current compatible release', category:'Police systems', status:'verified', legacy3788:'Yes', goldenBuild:true, impact:'Low', confidence:96, note:'Installed and working; agency configuration is still being expanded.', guide:'/guide/police/ultimate-backup'},
  {id:'compulite', component:'CompuLite', version:'Current compatible release', category:'Police systems', status:'verified', legacy3788:'Yes', goldenBuild:true, impact:'Low', confidence:96, note:'Installed and working in the current verified build.', guide:'/guide/police/compulite'},
  {id:'eup-menu', component:'EUP Menu', version:'2.3.0', category:'Uniforms & visuals', status:'verified', legacy3788:'Yes', goldenBuild:true, impact:'Low', confidence:100, note:'Requires the newest official RAGENativeUI release.', guide:'/guide/uniforms/eup-menu-ragenativeui'},
  {id:'eup-law-order', component:'EUP Law & Order', version:'8.3', category:'Uniforms & visuals', status:'verified', legacy3788:'Yes', goldenBuild:true, impact:'Medium', confidence:100, note:'Installed through LML and verified in game.', guide:'/guide/uniforms/eup-law-order'},
  {id:'eup-serve-rescue', component:'EUP Serve & Rescue', version:'1.5', category:'Uniforms & visuals', status:'verified', legacy3788:'Yes', goldenBuild:true, impact:'Medium', confidence:100, note:'Installed through LML and verified in game.', guide:'/guide/uniforms/eup-serve-rescue'},
  {id:'better-radiance', component:'Better Radiance', version:'Current compatible release', category:'Uniforms & visuals', status:'verified', legacy3788:'Yes', goldenBuild:true, impact:'Low', confidence:92, note:'Installed in the mods folder and verified.', guide:'/guide/uniforms/better-radiance'},
  {id:'alpr-lite', component:'ALPR Lite', version:'To be locked', category:'Police systems', status:'testing', legacy3788:'Pending', goldenBuild:false, impact:'Low', confidence:70, note:'Final version and keybind validation are still pending.', guide:'/guide/police/alpr-lite'},
  {id:'speed-radar-lite', component:'Speed Radar Lite', version:'To be locked', category:'Police systems', status:'testing', legacy3788:'Pending', goldenBuild:false, impact:'Low', confidence:68, note:'Awaiting final compatibility and keybind validation.', guide:'/guide/police/speed-radar-lite'},
  {id:'grammar-police', component:'Grammar Police', version:'Under evaluation', category:'Communications', status:'testing', legacy3788:'Testing', goldenBuild:false, impact:'Medium', confidence:48, note:'Not approved for the Golden Build while voice workflow testing continues.', guide:'/guide/communications/grammar-police'},
  {id:'callout-interface', component:'Callout Interface', version:'Under evaluation', category:'Callouts', status:'testing', legacy3788:'Testing', goldenBuild:false, impact:'Low', confidence:45, note:'Candidate for the curated callout phase.', guide:'/guide/callouts/callout-interface'},
  {id:'ai-conversation', component:'Conversational AI Lab', version:'Research only', category:'Experimental', status:'research', legacy3788:'Unknown', goldenBuild:false, impact:'Unknown', confidence:15, note:'Architecture research only; not recommended for production patrols.', guide:'/guide/ai/overview'},
];

export const compatibilityCategories = ['All', ...Array.from(new Set(compatibilityRows.map((row) => row.category)))];
