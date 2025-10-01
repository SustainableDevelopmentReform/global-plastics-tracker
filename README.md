# Global Plastics Tracker

An interactive, Observable Framework–powered explorer for the global plastics landscape. The tracker curates open datasets and visual assets to help researchers, policy makers, and the public understand how plastic is produced, consumed, and disposed of across the world. Narrative pages walk through the problem space, while data tables, maps, and resource guides surface the underlying evidence.

## Observable Framework quick start

Install dependencies (first run or after updates) and launch the local preview server:

```bash
npm install
npm run dev
```

The site will be served at <http://localhost:3000>. Framework docs and recipes live at <https://observablehq.com/framework/getting-started> if you need extra guidance.

## Project structure

The repository keeps Observable content under `src` and data assets in a dedicated `data` directory:

```ini
.
├─ src
│  ├─ index.md                  # landing page for the tracker
│  ├─ 1_about.md                # project context and partners
│  ├─ 2_tables.md               # interactive dataset explorer
│  ├─ 3_map.md                  # geospatial view of plastics indicators
│  ├─ 4_methods.md              # methodology and documentation
│  ├─ 5_contribute.md           # how to get involved or share data
│  ├─ 6_resources.md            # curated resources and references
│  └─ data
│     ├─ data-utils.js          # helper functions for loading/transforming data
│     ├─ plastics_countries.geojson
│     ├─ global_plastics_waste_data_links_current.csv
│     ├─ global_plastics_waste_data_ratings_current.csv
│     ├─ map_placeholder.png
│     ├─ ocean_plastic.png
│     └─ photos/                # partner and contextual imagery
├─ observablehq.config.js       # framework configuration and navigation
├─ package.json
├─ package-lock.json
├─ dist/                        # production build output
└─ README.md
```

Key pages map directly to the navigation in `observablehq.config.js`, so renaming a Markdown file will change its route. Static assets and loaders live under `src/data`; use `data-utils.js` for any shared transform logic.

## Plastics tracker content

- **Scope:** tracks global plastic production, waste generation, recycling, and leakage indicators sourced from the Circularity in Sustainable Development Research Hub (CSDR) and partner datasets.
- **Visuals:** map, timeline, and narrative pages blend Markdown, Observable cells, and imagery in `src/data/photos`.
- **Updates:** replace CSV or GeoJSON files in `src/data` and refresh the site; the Observable build pipeline will pick up changes automatically.
- **Contributing:** guidelines and contact details live in `src/5_contribute.md`; use issues or pull requests to suggest datasets or corrections.

## Command reference

| Command | Description |
| ------- | ----------- |
| `npm install` | Install or refresh dependencies |
| `npm run dev` | Start the local preview server |
| `npm run build` | Generate the static site in `dist/` |
| `npm run deploy` | Publish to Observable (requires auth) |
| `npm run clean` | Clear the Framework data loader cache |
| `npm run observable` | Access the Observable CLI (e.g., `observable help`) |
