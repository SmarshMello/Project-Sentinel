
import {themes as prismThemes} from 'prism-react-renderer';

const config = {
  title: 'Project Sentinel',
  tagline: 'The complete GTA V Legacy LSPDFR master guide',
  favicon: 'img/favicon.ico',
  url: 'https://smarshmello.github.io',
  baseUrl: '/Project-Sentinel/',
  organizationName: 'SmarshMello',
  projectName: 'Project-Sentinel',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {defaultLocale: 'en', locales: ['en']},
  customFields: {
    paypalUrl: '',
    kofiUrl: '',
  },
  presets: [[
    'classic',
    {
      docs: {sidebarPath: './sidebars.js', routeBasePath: 'guide', editUrl: 'https://github.com/SmarshMello/Project-Sentinel/edit/main/'},
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
    image: 'img/hero.jpg',
    colorMode: {defaultMode: 'dark', disableSwitch: false, respectPrefersColorScheme: true},
    navbar: {
      title: 'Project Sentinel',
      logo: {alt: 'Project Sentinel', src: 'img/logo.svg'},
      items: [
        {to: '/', label: 'Home', position: 'left'},
        {label: 'Sentinel Police', position: 'left', items: [
          {to: '/sentinel-police', label: 'Overview'},
          {to: '/guide/intro', label: 'Build Guide'},
          {to: '/builds', label: 'Current Working Build'},
          {to: '/checklist', label: 'Installation Checklist'},
          {to: '/planner', label: 'Build Planner'},
          {to: '/guide/fleet/department-plan', label: 'Agencies & Fleet'},
          {to: '/guide/uniforms/eup-menu-ragenativeui', label: 'Uniforms'},
          {to: '/guide/presentation/graphics-audio', label: 'Graphics & Audio'},
          {to: '/sentinel-ai', label: 'Sentinel Expert System'},
          {to: '/troubleshooter', label: 'Build Troubleshooting'},
        ]},
        {label: 'Database', position: 'left', items: [
          {to: '/plugins', label: 'All Mods & Plugins'},
          {to: '/plugins?category=Police%20systems', label: 'Police Systems'},
          {to: '/plugins?category=Callout%20packs', label: 'Callout Packs'},
          {to: '/plugins?category=Uniforms%20%26%20EUP', label: 'Uniforms & EUP'},
          {to: '/plugins?category=Graphics%20%26%20lighting', label: 'Graphics & Lighting'},
          {to: '/plugins?category=Vehicles%20%26%20equipment', label: 'Vehicles & Equipment'},
          {to: '/compatibility', label: 'Compatibility Center'},
        ]},
        {label: 'Tools', position: 'left', items: [
          {to: '/sentinel-ai', label: 'Sentinel Expert System'},
          {to: '/dashboard', label: 'Operations Dashboard'},
          {to: '/watcher', label: 'Sentinel Watcher'},
          {to: '/planner', label: 'Build Planner'},
          {to: '/troubleshooter', label: 'Troubleshooting Wizard'},
          {to: '/checklist', label: 'Installation Checklist'},
        ]},
        {to: '/help', label: 'Help', position: 'left'},
        {href: 'https://github.com/SmarshMello/Project-Sentinel', label: 'GitHub', position: 'right'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {title: 'Sentinel Police', items: [{label:'Overview',to:'/sentinel-police'},{label:'Build Guide',to:'/guide/intro'},{label:'Working Build',to:'/builds'},{label:'Checklist',to:'/checklist'}]},
        {title: 'Database & Tools', items: [{label:'Getting Started',to:'/guide/getting-started/clean-install'},{label:'Plugin Database',to:'/plugins'},{label:'Golden Builds',to:'/builds'},{label:'Compatibility',to:'/compatibility'},{label:'Build Planner',to:'/planner'},{label:'Dashboard',to:'/dashboard'},{label:'Sentinel Watcher',to:'/watcher'},{label:'Sentinel Expert System',to:'/sentinel-ai'},{label:'Troubleshooting Wizard',to:'/troubleshooter'},{label:'Installation Checklist',to:'/checklist'},{label:'Troubleshooting',to: '/guide/troubleshooting'}]},
        {title: 'Community', items:[{label:'Help Tickets',to:'/help'},{label:'Suggestions',href:'https://github.com/SmarshMello/Project-Sentinel/issues/new?template=suggestion.yml'}]},
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Project Sentinel. Third-party mods belong to their creators.`,
    },
    prism: {theme: prismThemes.github, darkTheme: prismThemes.dracula},
  },
};
export default config;
