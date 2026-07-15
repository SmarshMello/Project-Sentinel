export const doctorSymptoms = [
  {id:'startup', label:'Game will not start', hint:'Launcher, BattlEye, ScriptHookV, RPH or ASI Loader'},
  {id:'loading', label:'Crashes while loading', hint:'Story Mode, plugins, archives or dependency startup'},
  {id:'duty', label:'Crashes going on duty', hint:'LSPDFR, police plugins, callouts or configuration'},
  {id:'plugin', label:'A plugin does not work', hint:'Missing menu, failed load, keybind or dependency'},
  {id:'eup', label:'EUP or uniforms are broken', hint:'EUP Menu, LML packages or RAGENativeUI'},
  {id:'performance', label:'Stutter, low FPS or instability', hint:'Resource pressure, traffic, graphics or plugin load'},
];

export const doctorEnvironmentFields = [
  {id:'gta', label:'GTA build', placeholder:'Example: Legacy 1.0.3788.0'},
  {id:'rph', label:'RAGE Plugin Hook', placeholder:'Example: 1.130.1406.17682'},
  {id:'lspdfr', label:'LSPDFR', placeholder:'Example: 0.4.9 / 0.4.9572'},
  {id:'lastChange', label:'Last change made', placeholder:'Example: Updated RAGENativeUI'},
];

export function buildDoctorContext(symptom, environment) {
  const selected = doctorSymptoms.find((item) => item.id === symptom);
  const lines = [selected ? `Reported symptom: ${selected.label}. ${selected.hint}.` : 'Reported symptom: not selected.'];
  for (const field of doctorEnvironmentFields) {
    const value = environment[field.id]?.trim();
    if (value) lines.push(`${field.label}: ${value}`);
  }
  return lines.join('\n');
}
