
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
        {to: '/guide/intro', label: 'Guide', position: 'left'},
        {to: '/plugins', label: 'Plugin Database', position: 'left'},
        {to: '/builds', label: 'Golden Builds', position: 'left'},
        {to: '/compatibility', label: 'Compatibility', position: 'left'},
        {to: '/planner', label: 'Build Planner', position: 'left'},
        {label: 'Tools', position: 'left', items: [
          {to: '/dashboard', label: 'Operations Dashboard'},
          {to: '/troubleshooter', label: 'Troubleshooting Wizard'},
          {to: '/checklist', label: 'Installation Checklist'},
        ]},
        {to: '/donate', label: 'Donate', position: 'left'},
        {to: '/help', label: 'Help', position: 'left'},
        {href: 'https://github.com/SmarshMello/Project-Sentinel', label: 'GitHub', position: 'right'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {title: 'Guide', items: [{label:'Getting Started',to:'/guide/getting-started/clean-install'},{label:'Plugin Database',to:'/plugins'},{label:'Golden Builds',to:'/builds'},{label:'Compatibility',to:'/compatibility'},{label:'Build Planner',to:'/planner'},{label:'Dashboard',to:'/dashboard'},{label:'Troubleshooting Wizard',to:'/troubleshooter'},{label:'Installation Checklist',to:'/checklist'},{label:'Troubleshooting',to: '/guide/troubleshooting'}]},
        {title: 'Community', items:[{label:'Help Tickets',to:'/help'},{label:'Suggestions',href:'https://github.com/SmarshMello/Project-Sentinel/issues/new?template=suggestion.yml'}]},
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Project Sentinel. Third-party mods belong to their creators.`,
    },
    prism: {theme: prismThemes.github, darkTheme: prismThemes.dracula},
  },
};
export default config;
