const sidebars = {
  guideSidebar: [
    'intro',
    {
      type:'category',
      label:'Start Here',
      collapsed:false,
      items:['builds/choose-your-build','getting-started/clean-install','getting-started/backups','getting-started/folder-structure','getting-started/version-matching'],
    },
    {
      type:'category',
      label:'Free Build Path',
      collapsed:true,
      items:['builds/free-sentinel-build','police/damage-tracker-framework','police/policing-redefined','police/nexus-mdt-dispatch','communications/free-voice-options'],
    },
    {
      type:'category',
      label:'Paid Realism Path',
      collapsed:true,
      items:['builds/paid-sentinel-build','communications/npcai-paid','police/axon-signal'],
    },
    {
      type:'category',
      label:'Core Installation',
      collapsed:true,
      items:['core/openiv','core/scripthookv','core/limits-gameconfig','core/rage-plugin-hook','core/lspdfr','core/lml'],
    },
    {
      type:'category',
      label:'Presentation and Expansion',
      collapsed:true,
      items:['uniforms/better-radiance','uniforms/eup-law-order','uniforms/eup-serve-rescue','uniforms/eup-menu-ragenativeui','police/alpr-lite','police/speed-radar-lite','callouts/callout-interface','callouts/curation','fleet/department-plan','presentation/graphics-audio'],
    },
    {
      type:'category',
      label:'Stability and Recovery',
      collapsed:true,
      items:['optimization/golden-build','optimization/keybinds','troubleshooting/index','troubleshooting/modern-sentinel-stack','troubleshooting/eup-crash','troubleshooting/plugin-attribute','troubleshooting/title-updates'],
    },
    {
      type:'category',
      label:'Legacy Alternative',
      collapsed:true,
      items:['builds/migrate-legacy-to-modern','police/stop-the-ped','police/ultimate-backup','police/compulite','communications/grammar-police'],
    },
    {
      type:'category',
      label:'Sentinel Intelligence',
      collapsed:true,
      items:['ai/overview','ai/architecture'],
    },
  ],
};
export default sidebars;
