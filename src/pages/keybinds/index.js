import React, {useMemo, useState} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const bindings = [
  {key:'F4', action:'RPH console', mod:'RAGE Plugin Hook', short:'Open the runtime console.', details:'Use the console to view plugin status, reload supported plugins, and inspect errors while testing.', file:'RagePluginHook.ini', path:'GTA V Legacy\\RagePluginHook.ini', search:'console rph runtime logs'},
  {key:'F11', action:'EUP Menu', mod:'EUP Menu', short:'Open uniforms and loadouts.', details:'Opens the EUP wardrobe interface after you are in-game. Keep this separate from every radio and tablet control.', file:'settings.ini', path:'GTA V Legacy\\Plugins\\EUP\\settings.ini', search:'uniform wardrobe outfit eup'},
  {key:'Q', action:'Open Nexus MDT', mod:'NexusMDT FULL', short:'Toggle the patrol computer.', details:'Opens or closes the Nexus MDT interface. This is the single computer/tablet toggle in Sentinel Build v1.0.', file:'NexusMDT.ini', path:'GTA V Legacy\\Plugins\\LSPDFR\\NexusMDT\\NexusMDT.ini', search:'computer tablet mdt records citations reports'},
  {key:'F24', action:'Nexus Dispatch PTT', mod:'Nexus Dispatch', short:'Hold to speak to dispatch.', details:'The recommended Sentinel setup maps a mouse side button to F24 in Logitech G Hub, then assigns F24 as the DispatchKey.', file:'custom.ini', path:'GTA V Legacy\\Plugins\\LSPDFR\\NexusDispatch\\config\\custom.ini', search:'radio dispatch push to talk ptt backup status 10-8'},
  {key:'F23', action:'NPCAI PTT', mod:'NPCAI', short:'Hold to speak with an NPC.', details:'Use a different mouse button or keyboard key from dispatch. Map the physical control to F23 when direct XButton detection is unreliable.', file:'GeminiAI.ini', path:'GTA V Legacy\\Plugins\\LSPDFR\\NPCAI\\GeminiAI.ini', search:'npc voice talk conversation pedestrian ptt'},
  {key:'Right Shift + L', action:'Visual context', mod:'NPCAI', short:'Toggle scene awareness.', details:'Enable only when NPCAI needs visual scene context. Keeping it off during ordinary patrol reduces unnecessary API usage.', file:'GeminiAI.ini', path:'GTA V Legacy\\Plugins\\LSPDFR\\NPCAI\\GeminiAI.ini', search:'visual context camera scene awareness tokens'},
  {key:'F8', action:'Toggle ALPR', mod:'ALPR Lite', short:'Turn plate scanning on or off.', details:'Activates all enabled ALPR cameras. The Sentinel configuration uses realistic hit rates and no automatic suspect blip.', file:'ALPRLite.ini', path:'GTA V Legacy\\Plugins\\LSPDFR\\ALPRLite.ini', search:'plate reader scanner alpr registration insurance stolen'},
  {key:'E', action:'Context interaction', mod:'LSPDFR / Policing Redefined', short:'Use the prompted police action.', details:'Used contextually for traffic stops and interactions when the on-screen prompt asks for it. Do not add an old Stop The Ped E-menu beside Policing Redefined.', file:'keys.ini / PR config', path:'GTA V Legacy\\lspdfr\\keys.ini and GTA V Legacy\\Plugins\\LSPDFR\\PolicingRedefined\\', search:'interact traffic stop suspect pedestrian policing redefined'},
  {key:'B', action:'Backup menu', mod:'Policing Redefined', short:'Open the PR backup workflow.', details:'Reserved for Policing Redefined backup actions in this setup. Ultimate Backup must not be installed because it would compete for the same role.', file:'Policing Redefined config', path:'GTA V Legacy\\Plugins\\LSPDFR\\PolicingRedefined\\', search:'backup units ems fire tow menu'},
  {key:'J', action:'Siren control', mod:'ELS', short:'Cycle the ELS siren stage.', details:'Common ELS control for siren-stage operation. Vehicle-specific ELS packs can change behavior, so check the in-game ELS panel if a car responds differently.', file:'ELS.ini', path:'GTA V Legacy\\ELS.ini', search:'els siren lights emergency stage'},
  {key:'G', action:'Horn / secondary siren', mod:'GTA V / ELS', short:'Use horn or secondary tone.', details:'Context-sensitive vehicle horn and ELS secondary-tone control. This does not conflict with the Sentinel voice keys.', file:'GTA controls / ELS.ini', path:'GTA V Settings → Key Bindings and GTA V Legacy\\ELS.ini', search:'horn secondary siren tone'},
];

export default function Keybinds(){
  const [query,setQuery]=useState('');
  const results=useMemo(()=>{
    const q=query.trim().toLowerCase();
    if(!q) return bindings;
    return bindings.filter(item=>[item.key,item.action,item.mod,item.short,item.details,item.file,item.path,item.search].join(' ').toLowerCase().includes(q));
  },[query]);

  return <Layout title="Keybinds" description="Searchable, conflict-free controls for Sentinel Build v1.0.">
    <main className={styles.page}>
      <header className={styles.hero}>
        <div className="container">
          <div className={styles.kicker}>SENTINEL BUILD v1.0</div>
          <Heading as="h1">Keybinds</Heading>
          <p>A compact, conflict-free control map for the finished Policing Redefined, Nexus, NPCAI, ALPR, EUP, and ELS setup.</p>
          <label className={styles.searchLabel} htmlFor="keybind-search">Search by key, mod, or action</label>
          <input id="keybind-search" className={styles.search} value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try: dispatch, F24, MDT, ALPR, backup…" />
          <div className={styles.resultCount} aria-live="polite">{results.length} matching keybind{results.length===1?'':'s'}</div>
        </div>
      </header>

      <section className={styles.quick}>
        <div className="container">
          <div className={styles.quickGrid}>
            {results.map(item=><a className={styles.keyCard} href={`#${item.action.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`} key={`${item.key}-${item.action}`}>
              <kbd>{item.key}</kbd><span><strong>{item.action}</strong><small>{item.short}</small></span>
            </a>)}
          </div>
          {!results.length && <div className={styles.empty}>No keybind matched that search.</div>}
        </div>
      </section>

      <section className={styles.details}>
        <div className="container">
          <Heading as="h2">What each control does</Heading>
          <div className={styles.detailList}>
            {results.map(item=><article id={item.action.toLowerCase().replace(/[^a-z0-9]+/g,'-')} key={`detail-${item.key}-${item.action}`}>
              <div className={styles.detailHead}><kbd>{item.key}</kbd><div><Heading as="h3">{item.action}</Heading><span>{item.mod}</span></div></div>
              <p>{item.details}</p>
              <dl><div><dt>Edit file</dt><dd><code>{item.file}</code></dd></div><div><dt>Location</dt><dd><code>{item.path}</code></dd></div></dl>
            </article>)}
          </div>
        </div>
      </section>

      <section className={styles.rules}>
        <div className="container">
          <Heading as="h2">No-overlap rules</Heading>
          <p><strong>F24 belongs only to Nexus Dispatch.</strong> <strong>F23 belongs only to NPCAI.</strong> Q is the only MDT toggle, F8 is the only ALPR toggle, and B is reserved for Policing Redefined backup. Do not reinstall Stop The Ped, Ultimate Backup, CompuLite, GrammarPolice, or Callout Interface into this build.</p>
          <p>For a complete installation and testing order, use the <Link to="/guide/builds/paid-sentinel-build">Sentinel Build v1.0 guide</Link>.</p>
        </div>
      </section>
    </main>
  </Layout>;
}
