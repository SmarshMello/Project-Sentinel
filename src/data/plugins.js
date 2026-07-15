export const pluginCategories = [
  'All',
  "Core & loaders",
  "Libraries & utilities",
  "Stability & performance",
  "Police systems",
  "Communications",
  "Callout packs",
  "Uniforms & EUP",
  "Graphics & lighting",
  "Vehicles & equipment",
  "Audio & immersion",
  "Experimental & AI",
];

export const plugins = [
  {
    "id": "lspdfr",
    "name": "LSPD First Response",
    "shortName": "LSPDFR",
    "category": "Core & loaders",
    "status": "verified",
    "version": "0.4.9 / 0.4.9572",
    "developer": "G17 Media",
    "impact": "Medium",
    "confidence": 100,
    "description": "The core police modification that transforms GTA V into a law-enforcement simulator.",
    "dependencies": [
      "RAGE Plugin Hook",
      "GTA V Legacy"
    ],
    "tags": [
      "Required",
      "Police framework",
      "Core"
    ],
    "guide": "/guide/core/lspdfr",
    "download": "https://www.lcpdfr.com/downloads/gta5mods/g17media/7792-lspd-first-response/",
    "note": "Verified on the current Sentinel Police Legacy 3788 build.",
    "sentinelPolice": true
  },
  {
    "id": "rage-plugin-hook",
    "name": "RAGE Plugin Hook",
    "shortName": "RPH",
    "category": "Core & loaders",
    "status": "verified",
    "version": "1.130.1406.17682",
    "developer": "RAGE Plugin Hook Team",
    "impact": "Low",
    "confidence": 100,
    "description": "Managed plugin runtime used by LSPDFR and most police plugins.",
    "dependencies": [
      "GTA V Legacy"
    ],
    "tags": [
      "Required",
      "Runtime",
      "Loader"
    ],
    "guide": "/guide/core/rage-plugin-hook",
    "download": null,
    "note": "Use the build distributed with the verified LSPDFR package.",
    "sentinelPolice": true
  },
  {
    "id": "openiv",
    "name": "OpenIV",
    "shortName": "OpenIV",
    "category": "Core & loaders",
    "status": "verified",
    "version": "Current official release",
    "developer": "OpenIV Team",
    "impact": "None",
    "confidence": 100,
    "description": "Archive editor and safe mods-folder foundation for GTA V file modifications.",
    "dependencies": [
      "ASI Loader",
      "OpenIV.asi"
    ],
    "tags": [
      "Required",
      "Archive editor",
      "Mods folder"
    ],
    "guide": "/guide/core/openiv",
    "download": "https://openiv.com/",
    "note": "All archive edits should target the mods folder.",
    "sentinelPolice": true
  },
  {
    "id": "scripthookv",
    "name": "Script Hook V",
    "shortName": "SHV",
    "category": "Core & loaders",
    "status": "verified",
    "version": "Legacy 3788 compatible",
    "developer": "Alexander Blade",
    "impact": "Low",
    "confidence": 100,
    "description": "ASI scripting runtime required by many GTA V modifications.",
    "dependencies": [
      "ASI Loader"
    ],
    "tags": [
      "Required",
      "ASI",
      "Runtime"
    ],
    "guide": "/guide/core/scripthookv",
    "download": "http://www.dev-c.com/gtav/scripthookv/",
    "note": "Installed and matched to the current Legacy game build.",
    "sentinelPolice": true
  },
  {
    "id": "lennys-mod-loader",
    "name": "Lenny’s Mod Loader",
    "shortName": "LML",
    "category": "Core & loaders",
    "status": "verified",
    "version": "0.4.13 beta",
    "developer": "LMS",
    "impact": "Low",
    "confidence": 96,
    "description": "Package loader used by EUP and other structured content modifications.",
    "dependencies": [
      "GTA V Legacy"
    ],
    "tags": [
      "Loader",
      "Packages",
      "EUP"
    ],
    "guide": "/guide/core/lml",
    "download": null,
    "note": "Installed and working in Sentinel Police.",
    "sentinelPolice": true
  },
  {
    "id": "ragenativeui",
    "name": "RAGENativeUI",
    "shortName": "RNU",
    "category": "Libraries & utilities",
    "status": "verified",
    "version": "Newest official release",
    "developer": "alexguirre",
    "impact": "Low",
    "confidence": 100,
    "description": "UI library required by many modern RAGE Plugin Hook plugins.",
    "dependencies": [
      "RAGE Plugin Hook"
    ],
    "tags": [
      "Dependency",
      "Menus",
      "UI"
    ],
    "guide": "/guide/uniforms/eup-menu-ragenativeui",
    "download": "https://github.com/alexguirre/RAGENativeUI/releases",
    "note": "Use the newest official GitHub release; older bundled copies can cause EUP crashes.",
    "sentinelPolice": true
  },
  {
    "id": "lemonui",
    "name": "LemonUI",
    "shortName": "LemonUI",
    "category": "Libraries & utilities",
    "status": "community",
    "version": "Current release",
    "developer": "LemonUI Team",
    "impact": "Low",
    "confidence": 78,
    "description": "Modern UI library used by a growing number of GTA V scripts.",
    "dependencies": [
      "ScriptHookV.NET or compatible runtime"
    ],
    "tags": [
      "Dependency",
      "Menus",
      "UI"
    ],
    "guide": null,
    "download": "https://www.gta5-mods.com/tools/lemonui",
    "note": "Community-proven dependency; install only when a selected mod requires it.",
    "sentinelPolice": false
  },
  {
    "id": "scripthookvdotnet",
    "name": "Community Script Hook V .NET",
    "shortName": "SHVDN",
    "category": "Libraries & utilities",
    "status": "community",
    "version": "Current release",
    "developer": "Community project",
    "impact": "Low",
    "confidence": 80,
    "description": "Runs GTA V scripts written for the .NET scripting ecosystem.",
    "dependencies": [
      "Script Hook V"
    ],
    "tags": [
      "Dependency",
      ".NET",
      "Scripts"
    ],
    "guide": null,
    "download": "https://www.gta5-mods.com/tools/scripthookv-net",
    "note": "Widely used outside LSPDFR; compatibility depends on the individual script.",
    "sentinelPolice": false
  },
  {
    "id": "heap-adjuster",
    "name": "HeapAdjuster Enhanced",
    "shortName": "Heap",
    "category": "Stability & performance",
    "status": "community",
    "version": "Legacy + Enhanced release",
    "developer": "Community project",
    "impact": "Low",
    "confidence": 82,
    "description": "Raises heap limits to reduce crashes in heavily modified installations.",
    "dependencies": [
      "ASI Loader"
    ],
    "tags": [
      "Stability",
      "Memory",
      "ASI"
    ],
    "guide": "/guide/core/limits-gameconfig",
    "download": "https://www.gta5-mods.com/tools/heapadjuster-enhanced",
    "note": "The enhanced fork supports Legacy and Enhanced; Sentinel Police currently uses a working heap adjuster configuration.",
    "sentinelPolice": true
  },
  {
    "id": "packfile-limit-adjuster",
    "name": "Packfile Limit Adjuster Enhanced",
    "shortName": "Packfile",
    "category": "Stability & performance",
    "status": "community",
    "version": "1.1",
    "developer": "Community project",
    "impact": "Low",
    "confidence": 82,
    "description": "Raises the number of RPF packfiles GTA V can load.",
    "dependencies": [
      "ASI Loader",
      "GameConfig"
    ],
    "tags": [
      "Stability",
      "RPF",
      "ASI"
    ],
    "guide": "/guide/core/limits-gameconfig",
    "download": "https://www.gta5-mods.com/scripts/packfile-limit-adjuster-enhanced",
    "note": "Only addresses packfile-limit failures; it does not replace a proper GameConfig.",
    "sentinelPolice": true
  },
  {
    "id": "gameconfig",
    "name": "GameConfig",
    "shortName": "GameConfig",
    "category": "Stability & performance",
    "status": "verified",
    "version": "PNWParksFan current Legacy config",
    "developer": "PNWParksFan",
    "impact": "None",
    "confidence": 96,
    "description": "Adjusted game limits for larger modded GTA V installations.",
    "dependencies": [
      "OpenIV",
      "Heap Adjuster",
      "Packfile Limit Adjuster"
    ],
    "tags": [
      "Stability",
      "Limits",
      "Required"
    ],
    "guide": "/guide/core/limits-gameconfig",
    "download": null,
    "note": "Installed in mods\\update\\update.rpf\\common\\data and verified.",
    "sentinelPolice": true
  },
  {
    "id": "resource-adjuster",
    "name": "Resource Adjuster",
    "shortName": "Resource",
    "category": "Stability & performance",
    "status": "documented",
    "version": "1.0",
    "developer": "Tanuki",
    "impact": "Low",
    "confidence": 70,
    "description": "Configurable patches designed to reduce texture loss and improve resource use on high-end systems.",
    "dependencies": [
      "ASI Loader"
    ],
    "tags": [
      "VRAM",
      "Textures",
      "Stability"
    ],
    "guide": null,
    "download": "https://www.gta5-mods.com/tools/resource-adjuster",
    "note": "Useful for large visual/vehicle builds, but should be tuned conservatively.",
    "sentinelPolice": false
  },
  {
    "id": "weapon-limits-adjuster",
    "name": "Weapon Limits Adjuster",
    "shortName": "WLA",
    "category": "Stability & performance",
    "status": "documented",
    "version": "2.2",
    "developer": "alexguirre",
    "impact": "Low",
    "confidence": 68,
    "description": "Raises weapon and component limits for installations with large weapon packs.",
    "dependencies": [
      "ASI Loader"
    ],
    "tags": [
      "Weapons",
      "Limits",
      "Stability"
    ],
    "guide": null,
    "download": "https://www.gta5-mods.com/tools/cweaponinfoblob-limit-adjuster",
    "note": "Only needed when adding extensive weapon content.",
    "sentinelPolice": false
  },
  {
    "id": "stop-the-ped",
    "name": "Stop The Ped",
    "shortName": "STP",
    "category": "Police systems",
    "status": "verified",
    "version": "4.9.5.4",
    "developer": "BejoIjo",
    "impact": "Low",
    "confidence": 100,
    "description": "Expands pedestrian stops, searches, sobriety testing, arrests and roadside interaction.",
    "dependencies": [
      "LSPDFR",
      "RAGENativeUI"
    ],
    "tags": [
      "Traffic stops",
      "DUI",
      "Arrests"
    ],
    "guide": "/guide/police/stop-the-ped",
    "download": null,
    "note": "Installed and working in the current Sentinel Police build.",
    "sentinelPolice": true
  },
  {
    "id": "ultimate-backup",
    "name": "Ultimate Backup",
    "shortName": "UB",
    "category": "Police systems",
    "status": "verified",
    "version": "Current compatible release",
    "developer": "BejoIjo",
    "impact": "Low",
    "confidence": 96,
    "description": "Configurable patrol, pursuit, tactical, EMS, fire and transport backup.",
    "dependencies": [
      "LSPDFR",
      "RAGENativeUI"
    ],
    "tags": [
      "Backup",
      "EMS",
      "Tactical"
    ],
    "guide": "/guide/police/ultimate-backup",
    "download": null,
    "note": "Installed and working; agency configuration is still being expanded.",
    "sentinelPolice": true
  },
  {
    "id": "compulite",
    "name": "CompuLite",
    "shortName": "CompuLite",
    "category": "Police systems",
    "status": "verified",
    "version": "Current compatible release",
    "developer": "BejoIjo",
    "impact": "Low",
    "confidence": 96,
    "description": "In-vehicle computer for records, citations, charges and reports.",
    "dependencies": [
      "LSPDFR",
      "RAGENativeUI"
    ],
    "tags": [
      "MDT",
      "Records",
      "Citations"
    ],
    "guide": "/guide/police/compulite",
    "download": null,
    "note": "Installed and working in Sentinel Police.",
    "sentinelPolice": true
  },
  {
    "id": "policing-redefined",
    "name": "Policing Redefined",
    "shortName": "PR",
    "category": "Police systems",
    "status": "conflict",
    "version": "1.0.0.5",
    "developer": "Opus49",
    "impact": "Medium",
    "confidence": 68,
    "description": "A newer all-in-one policing system positioned as an alternative to Stop The Ped and Ultimate Backup.",
    "dependencies": [
      "LSPDFR",
      "RAGE Plugin Hook"
    ],
    "tags": [
      "Alternative stack",
      "Interactions",
      "Backup"
    ],
    "guide": null,
    "download": "https://www.lcpdfr.com/downloads/gta5mods/scripts/52191-policing-redefined/",
    "note": "Do not install beside Stop The Ped or Ultimate Backup. CompuLite is also reported incompatible; this belongs to a separate build branch.",
    "sentinelPolice": false
  },
  {
    "id": "reports-plus",
    "name": "Reports+",
    "shortName": "Reports+",
    "category": "Police systems",
    "status": "community",
    "version": "Current release",
    "developer": "Community project",
    "impact": "Low",
    "confidence": 66,
    "description": "Report-writing and police-computer workflow often considered for newer alternative stacks.",
    "dependencies": [
      "LSPDFR"
    ],
    "tags": [
      "Reports",
      "MDT",
      "Records"
    ],
    "guide": null,
    "download": null,
    "note": "Cataloged as an alternative workflow; exact version and compatibility still need Sentinel testing.",
    "sentinelPolice": false
  },
  {
    "id": "external-police-computer",
    "name": "External Police Computer",
    "shortName": "EPC",
    "category": "Police systems",
    "status": "documented",
    "version": "Current release",
    "developer": "Community project",
    "impact": "Low",
    "confidence": 62,
    "description": "External-window police computer option for records and report workflows.",
    "dependencies": [
      "LSPDFR"
    ],
    "tags": [
      "MDT",
      "External app",
      "Records"
    ],
    "guide": null,
    "download": null,
    "note": "Potential CompuLite alternative for non-STP stacks; not yet tested by Sentinel.",
    "sentinelPolice": false
  },
  {
    "id": "police-smartradio",
    "name": "Police SmartRadio",
    "shortName": "SmartRadio",
    "category": "Police systems",
    "status": "legacy",
    "version": "Legacy release",
    "developer": "Albo1125",
    "impact": "Low",
    "confidence": 58,
    "description": "Classic radial/menu radio integration used by many older plugins.",
    "dependencies": [
      "LSPDFR",
      "RAGENativeUI"
    ],
    "tags": [
      "Radio",
      "Actions",
      "Legacy"
    ],
    "guide": null,
    "download": null,
    "note": "Historically popular but aging; verify dependencies and modern compatibility before use.",
    "sentinelPolice": false
  },
  {
    "id": "traffic-policer",
    "name": "Traffic Policer",
    "shortName": "Traffic",
    "category": "Police systems",
    "status": "legacy",
    "version": "Legacy release",
    "developer": "Albo1125",
    "impact": "Medium",
    "confidence": 55,
    "description": "Classic traffic enforcement expansion with radar, breath testing and roadside tools.",
    "dependencies": [
      "LSPDFR"
    ],
    "tags": [
      "Traffic",
      "Radar",
      "DUI"
    ],
    "guide": null,
    "download": null,
    "note": "Many functions are now covered by newer plugins. Treat as legacy and test carefully.",
    "sentinelPolice": false
  },
  {
    "id": "alpr-lite",
    "name": "ALPR Lite",
    "shortName": "ALPR",
    "category": "Police systems",
    "status": "documented",
    "version": "Version to be locked",
    "developer": "Community plugin",
    "impact": "Low",
    "confidence": 70,
    "description": "Automated plate-reader workflow for patrol vehicle scanning and alerts.",
    "dependencies": [
      "LSPDFR"
    ],
    "tags": [
      "ALPR",
      "Traffic",
      "Plates"
    ],
    "guide": "/guide/police/alpr-lite",
    "download": null,
    "note": "Guide exists; final version validation is pending.",
    "sentinelPolice": false
  },
  {
    "id": "speed-radar-lite",
    "name": "Speed Radar Lite",
    "shortName": "Radar",
    "category": "Police systems",
    "status": "documented",
    "version": "Version to be locked",
    "developer": "Community plugin",
    "impact": "Low",
    "confidence": 68,
    "description": "Patrol radar workflow for speed enforcement.",
    "dependencies": [
      "LSPDFR"
    ],
    "tags": [
      "Radar",
      "Speed",
      "Traffic"
    ],
    "guide": "/guide/police/speed-radar-lite",
    "download": null,
    "note": "Awaiting final compatibility and keybind validation.",
    "sentinelPolice": false
  },
  {
    "id": "lspdfr-enhanced-remastered",
    "name": "LSPDFR Enhanced: Remastered",
    "shortName": "Enhanced",
    "category": "Police systems",
    "status": "conflict",
    "version": "Current release",
    "developer": "Community project",
    "impact": "Medium",
    "confidence": 54,
    "description": "Large feature expansion that changes several core LSPDFR systems.",
    "dependencies": [
      "LSPDFR"
    ],
    "tags": [
      "Overhaul",
      "Features",
      "High interaction"
    ],
    "guide": null,
    "download": "https://www.lcpdfr.com/downloads/gta5mods/scripts/47267-lspdfr-enhanced-remastered-massive-update/",
    "note": "Community reports identify conflicts with some plugins and callouts. Add only to an isolated test build.",
    "sentinelPolice": false
  },
  {
    "id": "police-tape",
    "name": "Police Tape",
    "shortName": "Tape",
    "category": "Police systems",
    "status": "community",
    "version": "Current release",
    "developer": "Community project",
    "impact": "Low",
    "confidence": 64,
    "description": "Deployable scene tape and perimeter-control utility for investigations.",
    "dependencies": [
      "LSPDFR or ScriptHook runtime"
    ],
    "tags": [
      "Scenes",
      "Perimeter",
      "Roleplay"
    ],
    "guide": null,
    "download": null,
    "note": "Popular immersion category; exact recommended project still requires curation.",
    "sentinelPolice": false
  },
  {
    "id": "evidence-system",
    "name": "Evidence Collection Systems",
    "shortName": "Evidence",
    "category": "Police systems",
    "status": "documented",
    "version": "Multiple projects",
    "developer": "Community ecosystem",
    "impact": "Low",
    "confidence": 52,
    "description": "Evidence pickup, logging and scene-investigation systems.",
    "dependencies": [
      "Varies by project"
    ],
    "tags": [
      "Evidence",
      "Investigation",
      "Scenes"
    ],
    "guide": null,
    "download": null,
    "note": "Category record: individual evidence plugins will be split into separate entries after hands-on testing.",
    "sentinelPolice": false
  },
  {
    "id": "k9-systems",
    "name": "K9 Systems",
    "shortName": "K9",
    "category": "Police systems",
    "status": "documented",
    "version": "Multiple projects",
    "developer": "Community ecosystem",
    "impact": "Medium",
    "confidence": 55,
    "description": "Standalone canine search, tracking and apprehension systems.",
    "dependencies": [
      "LSPDFR"
    ],
    "tags": [
      "K9",
      "Search",
      "Backup"
    ],
    "guide": null,
    "download": null,
    "note": "Ultimate Backup already provides K9 support; standalone options should be checked for overlap.",
    "sentinelPolice": false
  },
  {
    "id": "bodycam-systems",
    "name": "Bodycam Systems",
    "shortName": "Bodycam",
    "category": "Police systems",
    "status": "documented",
    "version": "Multiple projects",
    "developer": "Community ecosystem",
    "impact": "Low",
    "confidence": 50,
    "description": "Bodycam overlays, recording presentation and roleplay interfaces.",
    "dependencies": [
      "Varies"
    ],
    "tags": [
      "Bodycam",
      "Overlay",
      "Immersion"
    ],
    "guide": null,
    "download": null,
    "note": "Mostly visual/presentation mods; choose one to avoid redundant overlays.",
    "sentinelPolice": false
  },
  {
    "id": "grammar-police",
    "name": "Grammar Police",
    "shortName": "Grammar",
    "category": "Communications",
    "status": "testing",
    "version": "Under evaluation",
    "developer": "Community plugin",
    "impact": "Medium",
    "confidence": 48,
    "description": "Voice-driven dispatch interaction and radio workflow.",
    "dependencies": [
      "LSPDFR",
      "Speech recognition setup"
    ],
    "tags": [
      "Voice",
      "Dispatch",
      "Radio"
    ],
    "guide": "/guide/communications/grammar-police",
    "download": null,
    "note": "Not in the Golden Build; recent user reports mention specific command crashes after title updates.",
    "sentinelPolice": false
  },
  {
    "id": "immersive-dispatch",
    "name": "Immersive Dispatch",
    "shortName": "Dispatch",
    "category": "Communications",
    "status": "documented",
    "version": "Current release",
    "developer": "Community project",
    "impact": "Low",
    "confidence": 60,
    "description": "Dispatch presentation and radio-workflow enhancement.",
    "dependencies": [
      "LSPDFR"
    ],
    "tags": [
      "Dispatch",
      "Radio",
      "Immersion"
    ],
    "guide": null,
    "download": null,
    "note": "Candidate for the dedicated dispatch phase; exact project/version requires testing.",
    "sentinelPolice": false
  },
  {
    "id": "realistic-dispatch-audio",
    "name": "Realistic Dispatch Audio",
    "shortName": "Audio",
    "category": "Communications",
    "status": "community",
    "version": "Multiple packs",
    "developer": "Community creators",
    "impact": "Low",
    "confidence": 67,
    "description": "Replacement dispatch voice and scanner audio packs.",
    "dependencies": [
      "OpenIV or plugin-specific install"
    ],
    "tags": [
      "Dispatch",
      "Audio",
      "Radio"
    ],
    "guide": null,
    "download": null,
    "note": "Broad ecosystem category; users should verify language, agency style and replacement scope.",
    "sentinelPolice": false
  },
  {
    "id": "callout-interface",
    "name": "Callout Interface",
    "shortName": "Callouts",
    "category": "Communications",
    "status": "testing",
    "version": "Under evaluation",
    "developer": "Community plugin",
    "impact": "Low",
    "confidence": 45,
    "description": "Interface for viewing, selecting and managing callout activity.",
    "dependencies": [
      "LSPDFR"
    ],
    "tags": [
      "Callouts",
      "Interface",
      "Dispatch"
    ],
    "guide": "/guide/callouts/callout-interface",
    "download": null,
    "note": "Candidate for the curated callout phase.",
    "sentinelPolice": false
  },
  {
    "id": "super-callouts",
    "name": "SuperCallouts",
    "shortName": "Super",
    "category": "Callout packs",
    "status": "community",
    "version": "4.0.1.0",
    "developer": "SuperPyroManiac",
    "impact": "Medium",
    "confidence": 82,
    "description": "Large, long-running callout pack with a wide range of police scenarios.",
    "dependencies": [
      "LSPDFR 0.4.9+",
      "RAGE Plugin Hook"
    ],
    "tags": [
      "Callouts",
      "Popular",
      "Large pack"
    ],
    "guide": null,
    "download": "https://www.lcpdfr.com/downloads/gta5mods/scripts/23995-supercallouts/",
    "note": "Current listing recommends Policing Redefined for full functionality; check stack compatibility before installing.",
    "sentinelPolice": false
  },
  {
    "id": "regular-callouts",
    "name": "Regular Callouts",
    "shortName": "Regular",
    "category": "Callout packs",
    "status": "community",
    "version": "1.1.8",
    "developer": "Community developer",
    "impact": "Low",
    "confidence": 78,
    "description": "Pack of 23 varied calls including everyday patrol and special scenarios.",
    "dependencies": [
      "LSPDFR"
    ],
    "tags": [
      "Callouts",
      "Patrol",
      "23 calls"
    ],
    "guide": null,
    "download": "https://www.lcpdfr.com/downloads/gta5mods/scripts/43654-regular-callouts/",
    "note": "Strong candidate for realistic everyday patrol testing.",
    "sentinelPolice": false
  },
  {
    "id": "basic-callouts",
    "name": "Basic Callouts",
    "shortName": "Basic",
    "category": "Callout packs",
    "status": "community",
    "version": "1.2.0.0",
    "developer": "Community developer",
    "impact": "Low",
    "confidence": 74,
    "description": "Fifteen straightforward callouts for expanding normal patrol variety.",
    "dependencies": [
      "LSPDFR 0.4.9+",
      "RAGE Plugin Hook 1.91+"
    ],
    "tags": [
      "Callouts",
      "Patrol",
      "15 calls"
    ],
    "guide": null,
    "download": "https://www.lcpdfr.com/downloads/gta5mods/scripts/36148-basic-callouts/",
    "note": "Community-proven starter pack; not yet Sentinel-verified.",
    "sentinelPolice": false
  },
  {
    "id": "typical-callouts",
    "name": "Typical Callouts",
    "shortName": "Typical",
    "category": "Callout packs",
    "status": "community",
    "version": "Current release",
    "developer": "Community developer",
    "impact": "Low",
    "confidence": 70,
    "description": "Location-aware patrol scenarios with configurable callout ranges.",
    "dependencies": [
      "LSPDFR"
    ],
    "tags": [
      "Callouts",
      "Patrol",
      "Location aware"
    ],
    "guide": null,
    "download": "https://www.lcpdfr.com/downloads/gta5mods/scripts/29152-typical-callouts/",
    "note": "Historically popular; test modern title compatibility before long sessions.",
    "sentinelPolice": false
  },
  {
    "id": "west-coast-callouts",
    "name": "West Coast Callouts",
    "shortName": "West Coast",
    "category": "Callout packs",
    "status": "testing",
    "version": "Active development",
    "developer": "Community developer",
    "impact": "Medium",
    "confidence": 72,
    "description": "Modern pack advertising more than 40 realism-focused calls across Los Santos.",
    "dependencies": [
      "LSPDFR"
    ],
    "tags": [
      "Callouts",
      "40+ calls",
      "Realism"
    ],
    "guide": null,
    "download": "https://www.lcpdfr.com/downloads/gta5mods/scripts/54203-west-coast-callouts/",
    "note": "Promising 2026 project still in active development; use a test profile.",
    "sentinelPolice": false
  },
  {
    "id": "real-duty-callouts",
    "name": "Real Duty Callouts",
    "shortName": "Real Duty",
    "category": "Callout packs",
    "status": "testing",
    "version": "1.0",
    "developer": "Community developer",
    "impact": "Low",
    "confidence": 72,
    "description": "Procedural, slow-paced callouts emphasizing investigation and manual interaction.",
    "dependencies": [
      "LSPDFR"
    ],
    "tags": [
      "Callouts",
      "Investigation",
      "Realism"
    ],
    "guide": null,
    "download": "https://www.lcpdfr.com/downloads/gta5mods/scripts/53541-real-duty-callouts/",
    "note": "A strong fit for Sentinel Police philosophy; queued for hands-on testing.",
    "sentinelPolice": false
  },
  {
    "id": "interior-callouts",
    "name": "Interior Callouts",
    "shortName": "Interior",
    "category": "Callout packs",
    "status": "community",
    "version": "Current release",
    "developer": "Community developer",
    "impact": "Medium",
    "confidence": 68,
    "description": "Callouts built around interior locations and indoor police scenarios.",
    "dependencies": [
      "LSPDFR"
    ],
    "tags": [
      "Callouts",
      "Interiors",
      "Scenes"
    ],
    "guide": null,
    "download": "https://www.lcpdfr.com/downloads/gta5mods/scripts/51829-interior-callouts/",
    "note": "Interior dependencies and map conflicts should be checked before inclusion.",
    "sentinelPolice": false
  },
  {
    "id": "jb-callout",
    "name": "JBCallout",
    "shortName": "JB",
    "category": "Callout packs",
    "status": "testing",
    "version": "Active development",
    "developer": "Community developer",
    "impact": "Low",
    "confidence": 64,
    "description": "Dynamic pack with scenarios such as robbery, road rage and street fights.",
    "dependencies": [
      "LSPDFR"
    ],
    "tags": [
      "Callouts",
      "Dynamic",
      "Active development"
    ],
    "guide": null,
    "download": "https://www.lcpdfr.com/downloads/gta5mods/scripts/53353-%F0%9F%9A%93-jbcallout-dynamic-callout-pack-for-lspdfr/",
    "note": "Early but actively expanded; suitable for a separate test branch.",
    "sentinelPolice": false
  },
  {
    "id": "yobbin-callouts",
    "name": "Yobbin Callouts",
    "shortName": "Yobbin",
    "category": "Callout packs",
    "status": "legacy",
    "version": "Legacy/current unknown",
    "developer": "Yobbin",
    "impact": "Medium",
    "confidence": 55,
    "description": "Well-known callout collection frequently seen in older LSPDFR builds.",
    "dependencies": [
      "LSPDFR"
    ],
    "tags": [
      "Callouts",
      "Popular",
      "Legacy"
    ],
    "guide": null,
    "download": null,
    "note": "Popular historically, but modern compatibility and overlap need reassessment.",
    "sentinelPolice": false
  },
  {
    "id": "mcc-callouts",
    "name": "MCC Callouts",
    "shortName": "MCC",
    "category": "Callout packs",
    "status": "legacy",
    "version": "Legacy/current unknown",
    "developer": "Community developer",
    "impact": "Medium",
    "confidence": 48,
    "description": "Older callout pack still encountered in many mod lists.",
    "dependencies": [
      "LSPDFR"
    ],
    "tags": [
      "Callouts",
      "Legacy",
      "Conflict watch"
    ],
    "guide": null,
    "download": null,
    "note": "Community reports have associated it with conflicts in larger overhaul stacks.",
    "sentinelPolice": false
  },
  {
    "id": "eup-menu",
    "name": "EUP Menu",
    "shortName": "EUP",
    "category": "Uniforms & EUP",
    "status": "verified",
    "version": "2.3.0",
    "developer": "EUP Team",
    "impact": "Low",
    "confidence": 100,
    "description": "Uniform menu and character creator for Emergency Uniforms Pack clothing.",
    "dependencies": [
      "LSPDFR",
      "Latest official RAGENativeUI"
    ],
    "tags": [
      "Uniforms",
      "Menu",
      "EUP"
    ],
    "guide": "/guide/uniforms/eup-menu-ragenativeui",
    "download": "https://www.lcpdfr.com/downloads/gta5mods/scripts/13245-eup-menu/",
    "note": "Verified with the newest official RAGENativeUI release.",
    "sentinelPolice": true
  },
  {
    "id": "eup-law-order",
    "name": "EUP Law & Order",
    "shortName": "L&O",
    "category": "Uniforms & EUP",
    "status": "verified",
    "version": "8.3 in Sentinel Police",
    "developer": "EUP Team",
    "impact": "Medium",
    "confidence": 100,
    "description": "Primary law-enforcement clothing package for patrol and specialist units.",
    "dependencies": [
      "EUP Menu",
      "Lenny’s Mod Loader"
    ],
    "tags": [
      "Uniforms",
      "Agencies",
      "LML"
    ],
    "guide": "/guide/uniforms/eup-law-order",
    "download": "https://www.lcpdfr.com/downloads/gta5mods/character/8151-emergency-uniforms-pack-law-order/",
    "note": "Sentinel Police currently uses 8.3; newer public releases must be separately compatibility-tested.",
    "sentinelPolice": true
  },
  {
    "id": "eup-serve-rescue",
    "name": "EUP Serve & Rescue",
    "shortName": "S&R",
    "category": "Uniforms & EUP",
    "status": "verified",
    "version": "1.5 in Sentinel Police",
    "developer": "EUP Team",
    "impact": "Medium",
    "confidence": 100,
    "description": "Fire, EMS and rescue clothing package complementing EUP Law & Order.",
    "dependencies": [
      "EUP Menu",
      "Lenny’s Mod Loader"
    ],
    "tags": [
      "EMS",
      "Fire",
      "Uniforms"
    ],
    "guide": "/guide/uniforms/eup-serve-rescue",
    "download": "https://www.lcpdfr.com/downloads/gta5mods/character/16256-emergency-uniforms-pack-serve-rescue/",
    "note": "Installed and verified in Sentinel Police.",
    "sentinelPolice": true
  },
  {
    "id": "eup-backup-configs",
    "name": "EUP Backup Configurations",
    "shortName": "EUP Config",
    "category": "Uniforms & EUP",
    "status": "community",
    "version": "9.3 ecosystem release",
    "developer": "Community project",
    "impact": "Low",
    "confidence": 75,
    "description": "Backup XML configurations that make spawned units use matching EUP uniforms.",
    "dependencies": [
      "EUP Law & Order",
      "Ultimate Backup or supported backup system"
    ],
    "tags": [
      "EUP",
      "Backup",
      "Configurations"
    ],
    "guide": null,
    "download": "https://www.lcpdfr.com/downloads/gta5mods/misc/28735-eup-backup-configurations-93/",
    "note": "Popular companion configuration; match it to your exact EUP and agency setup.",
    "sentinelPolice": false
  },
  {
    "id": "better-radiance",
    "name": "Better Radiance",
    "shortName": "Radiance",
    "category": "Graphics & lighting",
    "status": "verified",
    "version": "Current compatible release",
    "developer": "Community visual mod",
    "impact": "Low",
    "confidence": 92,
    "description": "Improves brightness and visibility of emergency lighting without a full graphics overhaul.",
    "dependencies": [
      "OpenIV"
    ],
    "tags": [
      "Lighting",
      "Emergency lights",
      "Visuals"
    ],
    "guide": "/guide/uniforms/better-radiance",
    "download": null,
    "note": "Installed in the mods folder and verified.",
    "sentinelPolice": true
  },
  {
    "id": "visualv",
    "name": "VisualV",
    "shortName": "VisualV",
    "category": "Graphics & lighting",
    "status": "community",
    "version": "Current Legacy release",
    "developer": "_CP_ & contributors",
    "impact": "Medium",
    "confidence": 80,
    "description": "Popular visual overhaul focused on weather, lighting and improved vanilla presentation.",
    "dependencies": [
      "OpenIV"
    ],
    "tags": [
      "Graphics",
      "Weather",
      "Lighting"
    ],
    "guide": null,
    "download": "https://www.gta5-mods.com/misc/visualv",
    "note": "Widely used and generally lighter than the largest paid overhauls; test with emergency-light mods.",
    "sentinelPolice": false
  },
  {
    "id": "naturalvision",
    "name": "NaturalVision",
    "shortName": "NVE",
    "category": "Graphics & lighting",
    "status": "community",
    "version": "Current supported release",
    "developer": "Razed",
    "impact": "High",
    "confidence": 75,
    "description": "High-end visual overhaul with extensive lighting, weather and environment changes.",
    "dependencies": [
      "OpenIV and release-specific requirements"
    ],
    "tags": [
      "Graphics",
      "High end",
      "Weather"
    ],
    "guide": null,
    "download": null,
    "note": "Large performance and compatibility footprint. Install late and preserve a clean visual backup.",
    "sentinelPolice": false
  },
  {
    "id": "quantv",
    "name": "QuantV",
    "shortName": "QuantV",
    "category": "Graphics & lighting",
    "status": "community",
    "version": "Current supported release",
    "developer": "QuantV team",
    "impact": "High",
    "confidence": 68,
    "description": "Cinematic graphics overhaul with weather, lighting and post-processing changes.",
    "dependencies": [
      "Release-specific requirements"
    ],
    "tags": [
      "Graphics",
      "High end",
      "Post FX"
    ],
    "guide": null,
    "download": null,
    "note": "Use only from the official source and test separately from other major visual overhauls.",
    "sentinelPolice": false
  },
  {
    "id": "radiance-v",
    "name": "Radiance V",
    "shortName": "Radiance V",
    "category": "Graphics & lighting",
    "status": "community",
    "version": "Current release",
    "developer": "Community project",
    "impact": "Low",
    "confidence": 72,
    "description": "Emergency-light brightness enhancement commonly paired with police vehicle packs.",
    "dependencies": [
      "OpenIV"
    ],
    "tags": [
      "Emergency lights",
      "Vehicles",
      "Visuals"
    ],
    "guide": null,
    "download": null,
    "note": "Do not stack multiple radiance mods without understanding which visualsettings files they replace.",
    "sentinelPolice": false
  },
  {
    "id": "la-roads",
    "name": "LA Roads / Road Texture Packs",
    "shortName": "Roads",
    "category": "Graphics & lighting",
    "status": "documented",
    "version": "Multiple projects",
    "developer": "Community creators",
    "impact": "Medium",
    "confidence": 60,
    "description": "Road, lane-marking and pavement texture replacements.",
    "dependencies": [
      "OpenIV"
    ],
    "tags": [
      "Roads",
      "Textures",
      "Environment"
    ],
    "guide": null,
    "download": null,
    "note": "Broad category record; exact pack should be chosen after graphics overhaul selection.",
    "sentinelPolice": false
  },
  {
    "id": "els",
    "name": "Emergency Lighting System",
    "shortName": "ELS",
    "category": "Vehicles & equipment",
    "status": "community",
    "version": "1.05",
    "developer": "Lt.Caine",
    "impact": "Low",
    "confidence": 78,
    "description": "Classic vehicle-lighting system used by thousands of ELS police vehicles.",
    "dependencies": [
      "Script Hook V",
      "ASI Loader"
    ],
    "tags": [
      "Vehicles",
      "Lighting",
      "ELS"
    ],
    "guide": null,
    "download": "https://www.lcpdfr.com/downloads/gta5mods/scripts/13865-emergency-lighting-system/",
    "note": "Extremely popular but vehicle packs must specifically support ELS.",
    "sentinelPolice": false
  },
  {
    "id": "dls",
    "name": "Dynamic Lighting System",
    "shortName": "DLS",
    "category": "Vehicles & equipment",
    "status": "documented",
    "version": "Current release",
    "developer": "Community project",
    "impact": "Low",
    "confidence": 64,
    "description": "Alternative vehicle-lighting and control framework used by supported packs.",
    "dependencies": [
      "Script Hook V or stated runtime"
    ],
    "tags": [
      "Vehicles",
      "Lighting",
      "Controls"
    ],
    "guide": null,
    "download": null,
    "note": "Choose lighting frameworks based on the vehicle pack; avoid redundant systems.",
    "sentinelPolice": false
  },
  {
    "id": "vehicle-packs",
    "name": "Police Vehicle Packs",
    "shortName": "Fleet",
    "category": "Vehicles & equipment",
    "status": "documented",
    "version": "Thousands of packs",
    "developer": "Community ecosystem",
    "impact": "Medium",
    "confidence": 50,
    "description": "ELS, non-ELS, lore-friendly and real-world agency vehicle packs.",
    "dependencies": [
      "OpenIV",
      "Pack-specific lighting framework"
    ],
    "tags": [
      "Vehicles",
      "Fleet",
      "Agencies"
    ],
    "guide": null,
    "download": null,
    "note": "Category record. Sentinel Police will document its exact fleet separately under Agencies & Fleet.",
    "sentinelPolice": false
  },
  {
    "id": "realistic-weapons",
    "name": "Realistic Weapon / Gun Sound Packs",
    "shortName": "Gun Audio",
    "category": "Audio & immersion",
    "status": "community",
    "version": "Multiple packs",
    "developer": "Community creators",
    "impact": "Low",
    "confidence": 65,
    "description": "Replacement firearm audio and handling presentation for more convincing incidents.",
    "dependencies": [
      "OpenIV"
    ],
    "tags": [
      "Weapons",
      "Audio",
      "Immersion"
    ],
    "guide": null,
    "download": null,
    "note": "Sound-only packs are usually low impact but can overwrite the same archives.",
    "sentinelPolice": false
  },
  {
    "id": "sirens",
    "name": "Siren Sound Packs",
    "shortName": "Sirens",
    "category": "Audio & immersion",
    "status": "community",
    "version": "Multiple packs",
    "developer": "Community creators",
    "impact": "Low",
    "confidence": 70,
    "description": "Replacement sirens ranging from lore-friendly to real agency tones.",
    "dependencies": [
      "OpenIV"
    ],
    "tags": [
      "Sirens",
      "Audio",
      "Vehicles"
    ],
    "guide": null,
    "download": null,
    "note": "Install one primary siren package and keep an original audio backup.",
    "sentinelPolice": false
  },
  {
    "id": "ambient-audio",
    "name": "Ambient & Radio Chatter Packs",
    "shortName": "Ambient",
    "category": "Audio & immersion",
    "status": "documented",
    "version": "Multiple packs",
    "developer": "Community creators",
    "impact": "Low",
    "confidence": 58,
    "description": "Scanner, ambient police and radio chatter audio enhancements.",
    "dependencies": [
      "Varies"
    ],
    "tags": [
      "Ambient",
      "Radio",
      "Immersion"
    ],
    "guide": null,
    "download": null,
    "note": "Check whether the pack replaces dispatch audio or runs as a plugin.",
    "sentinelPolice": false
  },
  {
    "id": "ai-conversation",
    "name": "Conversational AI Lab",
    "shortName": "AI Lab",
    "category": "Experimental & AI",
    "status": "research",
    "version": "Research only",
    "developer": "Project Sentinel Lab",
    "impact": "Unknown",
    "confidence": 15,
    "description": "Future natural-language civilian, witness, suspect and dispatch conversation systems.",
    "dependencies": [
      "Architecture not finalized"
    ],
    "tags": [
      "AI",
      "Voice",
      "Experimental"
    ],
    "guide": "/guide/ai/overview",
    "download": null,
    "note": "Concept and architecture research only. Not recommended for production patrols.",
    "sentinelPolice": false
  },
];

export const statusMeta = {
  verified: {label: 'Sentinel Verified', description: 'Installed and confirmed working in the current Sentinel Police environment.'},
  community: {label: 'Community Proven', description: 'Popular or widely successful in the community, but not yet personally verified by Sentinel.'},
  documented: {label: 'Documented', description: 'Cataloged with reliable information, but the final recommended version is not locked.'},
  testing: {label: 'Testing', description: 'Actively being evaluated and not yet approved for Sentinel Police.'},
  conflict: {label: 'Conflict Risk', description: 'Known stack conflicts or mutually exclusive alternatives require special care.'},
  legacy: {label: 'Legacy', description: 'Historically popular, but aging or not confirmed for the current title.'},
  research: {label: 'Research', description: 'Early-stage concept or experimental system.'},
  deprecated: {label: 'Deprecated', description: 'No longer recommended for the current build.'},
};
