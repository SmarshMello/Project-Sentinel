import {themes as prismThemes} from 'prism-react-renderer';

const config = {
  title: 'Project Sentinel',
  tagline: 'Build, verify, and maintain a stable GTA V Legacy LSPDFR installation',
  favicon: 'img/favicon.ico',
  url: 'https://smarshmello.github.io',
  baseUrl: '/Project-Sentinel/',
  organizationName: 'SmarshMello',
  projectName: 'Project-Sentinel',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  markdown: {hooks: {onBrokenMarkdownLinks: 'warn'}},
  i18n: {defaultLocale: 'en', locales: ['en']},
  customFields: {
    kofiUrl: 'https://ko-fi.com/smarshmello',
    watcherControlEndpoint: 'https://project-sentinel-watcher-control.sentinelwatcher.workers.dev',
  },
  presets: [[
    'classic',
    {
      docs: {sidebarPath: './sidebars.js', routeBasePath: 'guide'},
      blog: false,
      theme: {customCss: './src/css/custom.css'},
    },
  ]],
  themes: [[require.resolve('@easyops-cn/docusaurus-search-local'), {
    hashed: true,
    language: ['en'],
    indexDocs: true,
    indexPages: true,
    docsRouteBasePath: '/guide',
    highlightSearchTermsOnTargetPage: true,
  }]],
  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {defaultMode: 'dark', disableSwitch: false, respectPrefersColorScheme: true},
    navbar: {
      title: 'Project Sentinel',
      logo: {alt: 'Project Sentinel', src: 'img/logo.svg'},
      hideOnScroll: false,
      items: [
        {to: '/', label: 'Home', position: 'left', exact: true},
        {to: '/sentinel-police', label: 'Build Guide', position: 'left'},
        {to: '/keybinds', label: 'Keybinds', position: 'left'},
        {label: 'Research', position: 'left', items: [
          {to: '/watcher', label: 'Sentinel Watcher', description: 'Monitor releases and ecosystem changes'},
          {to: '/dashboard', label: 'Operations Dashboard', description: 'Review current platform and project status'},
          {to: '/compatibility', label: 'Compatibility Center', description: 'Check frameworks, dependencies, and conflicts'},
          {to: '/plugins', label: 'Mod Database', description: 'Browse tracked mods and plugins'},
          {to: '/intelligence', label: 'Sentinel Intelligence', description: 'Research and planning workspace'},
        ]},
        {label: 'Tools', position: 'left', items: [
          {to: '/doctor', label: 'Sentinel Doctor', description: 'Analyze logs and identify likely root causes'},
          {to: '/troubleshooter', label: 'Troubleshooting Wizard', description: 'Follow guided repair workflows'},
          {to: '/planner', label: 'Build Planner', description: 'Choose a compatible installation profile'},
          {to: '/checklist', label: 'Installation Checklist', description: 'Track every installation and test gate'},
          {to: '/sentinel-ai', label: 'Expert System', description: 'Use advanced build reasoning tools'},
        ]},
        {to: '/help', label: 'Help', position: 'left'},
        {to: '/donate', label: 'Donate', position: 'left'},
        {type: 'search', position: 'right'},
        {href: 'https://github.com/SmarshMello/Project-Sentinel', label: 'GitHub', position: 'right'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {title: 'Start here', items: [
          {label:'Choose a build',to:'/guide/builds/choose-your-build'},
          {label:'Free build',to:'/guide/builds/free-sentinel-build'},
          {label:'Paid realism build',to:'/guide/builds/paid-sentinel-build'},
          {label:'Clean installation',to:'/guide/getting-started/clean-install'},
          {label:'Keybinds',to:'/keybinds'},
        ]},
        {title: 'Verify and repair', items: [
          {label:'Compatibility Center',to:'/compatibility'},
          {label:'Installation Checklist',to:'/checklist'},
          {label:'Sentinel Doctor',to:'/doctor'},
          {label:'Troubleshooting',to:'/guide/troubleshooting'},
        ]},
        {title: 'Research', items: [
          {label:'Sentinel Watcher',to:'/watcher'},
          {label:'Operations Dashboard',to:'/dashboard'},
          {label:'Mod Database',to:'/plugins'},
          {label:'GitHub',href:'https://github.com/SmarshMello/Project-Sentinel'},
        ]},
        {title: 'Project', items:[
          {label:'Help',to:'/help'},
          {label:'Suggestions',href:'https://github.com/SmarshMello/Project-Sentinel/issues/new?template=suggestion.yml'},
          {label:'Donate',to:'/donate'},
        ]},
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Project Sentinel. Third-party mods belong to their creators.`,
    },
    prism: {theme: prismThemes.github, darkTheme: prismThemes.dracula},
  },
};
export default config;
