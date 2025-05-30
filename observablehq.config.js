// See https://observablehq.com/framework/config for documentation.
export default {
  // The project’s title; used in the sidebar and webpage titles.
  title: "Global plastics tracker",

  // The pages and sections in the sidebar. If you don’t specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.
  // pages: [
  //   {
  //     name: "Examples",
  //     pages: [
  //       {name: "Dashboard", path: "/example-dashboard"},
  //       {name: "Report", path: "/example-report"}
  //     ]
  //   }
  // ],

  // Content to add to the head of the page, e.g. for a favicon:
  head: '<link rel="icon" href="data/csdr.png" type="image/png" sizes="32x32">',

  // The path to the source root.
  root: "src",

  // Some additional configuration options and their defaults:
  // theme: "default", // try "light", "dark", "slate", etc.
  // header: "", // what to show in the header (HTML)
  // footer: "Built with Observable.", // what to show in the footer (HTML)
  // sidebar: true, // whether to show the sidebar
  // toc: true, // whether to show the table of contents
  // pager: true, // whether to show previous & next links in the footer
  // output: "dist", // path to the output root for build
  // search: true, // activate search
  // linkify: true, // convert URLs in Markdown to links
  // typographer: false, // smart quotes and other typographic improvements
  // cleanUrls: true, // drop .html from URLs

  footer: `
  <div style="border-top: 1px solid var(--theme-divider); padding: 1.5rem 1rem; margin-top: 3rem; text-align: left; font-family: var(--sans-serif);">
    <div style="display: flex; justify-content: left; align-items: left; flex-wrap: wrap; gap: 20px; margin-bottom: 1rem;">
      <a href="https://www.unsw.edu.au/research/centre-for-sustainable-development-reform" target="_blank" rel="noopener noreferrer" title="UNSW Centre for Sustainable Development Reform">
        <img src="./data/unsw_csdr.png" alt="UNSW CSDR Logo" style="height: 80px; max-width: 400px; object-fit: contain; vertical-align: middle;">
      </a>
      <a href="https://www.oceanaccounts.org/" target="_blank" rel="noopener noreferrer" title="Global Ocean Accounts Partnership">
        <img src="./data/goap.png" alt="GOAP Logo" style="height: 60px; max-width: 400px; object-fit: contain; vertical-align: middle;">
      </a>
      <a href="https://www.gov.uk/government/organisations/foreign-commonwealth-development-office" target="_blank" rel="noopener noreferrer" title="UK Blue Planet Fund (Foreign, Commonwealth & Development Office)">
        <img src="./data/uk.jpeg" alt="UK Blue Planet Fund Logo" style="height: 80px; max-width: 400px; object-fit: contain; vertical-align: middle;">
      </a>
    </div>
    <p style="font-size: 0.85em; color: var(--theme-foreground-muted); line-height: 1.5;">
      Copyright: This work is led by the UNSW Centre for Sustainable Development Reform and Global Ocean Accounts Partnership with funding from the UK Blue Planet Fund.
    </p>
  </div>
  `
};
