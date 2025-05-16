# Table view


```js
// load the plastics data
const plastics_ratings_raw = FileAttachment("data/global_plastics_waste_data_ratings_current.csv").csv({typed: true});
// load the corresponding links data
const plastics_links_raw = FileAttachment("data/global_plastics_waste_data_links_current.csv").csv({typed: false}); // URLs are strings
```

```js
// This is the full, mapped array of all rating objects from your CSV.
// It will be used to find the original index of rows shown in the filtered table.
const plastics_ratings_all_rows = plastics_ratings_raw.map((d) => ({
  "Country": d["Country"], // Crucial: Ensure this key matches your CSV header for country
  "Region": d["Region"],
  "Type": d["Type"],
  "Domestic primary material": +d["Domestic primary material"],
  "Domestic Products": +d["Domestic Products"],
  "Virgin content consumption": +d["Virgin content consumption"],
  "Recycled content consumption": +d["Recycled content consumption"],
  "Primary material trade (imports)": +d["Primary material trade (imports)"],
  "Primary material trade (exports)": +d["Primary material trade (exports)"],
  "Products (imports)": +d["Products (imports)"],
  "Products (exports)": +d["Products (exports)"],
  "Total generated plastic waste": +d["Total generated plastic waste"],
  "Waste recovered for recycling": +d["Waste recovered for recycling"],
  "Waste to Energy": +d["Waste to Energy"],
  "Waste Incinerated (without energy recovery)": +d["Waste Incinerated (without energy recovery)"],
  "Waste landfilled": +d["Waste landfilled"],
  "Waste (import)": +d["Waste (import)"],
  "Waste (Export)": +d["Waste (Export)"]
}));

// Create search input using the full ratings data
const tableSearch = Inputs.search(plastics_ratings_all_rows, {placeholder: "Search table..."});
const tableSearchValue = view(tableSearch); // This filtered/sorted array is passed to Inputs.table

// Configurations for Cell Styling and Linking
const valueColorMap = {
  0: "#D3D3D3", 1: "#FFDAB9", 2: "#FFD8B1",
  3: "#FFFFE0", 4: "#98FB98", 5: "#008000"
};

// Column names that will be colored and should get links.
// These names must match the keys in plastics_ratings_all_rows objects
// AND the column headers in your links CSV.
const numericColumnsToColorAndLink = [
  "Domestic primary material", "Domestic Products", "Virgin content consumption",
  "Recycled content consumption", "Primary material trade (imports)",
  "Primary material trade (exports)", "Products (imports)", "Products (exports)",
  "Total generated plastic waste", "Waste recovered for recycling", "Waste to Energy",
  "Waste Incinerated (without energy recovery)", "Waste landfilled",
  "Waste (import)", "Waste (Export)"
];

// DEBUG: Verify plastics_links_raw structure (optional, but good for a first run)
if (plastics_links_raw && plastics_links_raw.length > 0) {
    console.log("BLOCK 2 DEBUG: First row of plastics_links_raw:", JSON.parse(JSON.stringify(plastics_links_raw[0])));
    console.log(`BLOCK 2 DEBUG: plastics_links_raw has ${plastics_links_raw.length} rows. plastics_ratings_all_rows has ${plastics_ratings_all_rows.length} rows.`);
    if (plastics_ratings_all_rows.length !== plastics_links_raw.length) {
        console.warn("WARNING: Row count mismatch between ratings data and links data!");
    }
} else {
    console.warn("BLOCK 2 DEBUG: plastics_links_raw is empty or undefined.");
}
```


```js
// create column toggle list
const colNames = Object.keys(plastics_ratings_all_rows[0])
const startList = ["Country", "Domestic primary material", "Domestic Products", "Primary material trade (imports)", "Primary material trade (exports)", "Total generated plastic waste"]
const selectedColumns = view(Inputs.checkbox(colNames, {
  label: "Columns to display",
  value: startList,
  multiple: true}))
```
```js
// if not using the view wrapper above, then you need the generator
//const selectedColumns = Generators.input(selectedColumns);
//Then use this html in the appropriate section
//<div> 
//${selectedColumnsInput}
//</div>
```

```js
// --- Table Cell Formatting Logic ---

function createStyledCell(value, {backgroundColor = 'transparent', textAlign = 'left', padding = '5px 8px'} = {}) {
  const span = document.createElement("span");
  span.style.backgroundColor = backgroundColor;
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    span.style.color = '#f0f0f0';
  } else {
    span.style.color = 'black';
  }
  span.style.padding = padding;
  span.style.display = "block";
  span.style.borderRadius = "4px";
  span.style.textAlign = textAlign;
  span.textContent = String(value);
  return span;
}

const tableCellFormats = {};
// Ensure plastics_ratings_all_rows is used for checks if plastics_links_raw is also checked against its length
if (plastics_ratings_all_rows.length > 0 && plastics_links_raw && plastics_links_raw.length > 0) {
  const allColumnNamesFromData = Object.keys(plastics_ratings_all_rows[0]);
  const firstRatingRow = plastics_ratings_all_rows[0]; // To check data types for non-linkable numeric cols

  // Optional: You can re-add the column name matching diagnostics here if still needed

  for (const colName of allColumnNamesFromData) {
    if (numericColumnsToColorAndLink.includes(colName)) {
      tableCellFormats[colName] = (cellValue, i_filtered, rowData_filtered) => {
        // Step 1: Create the styled span (rating number with background)
        let styledContentSpan;
        if (typeof cellValue === 'number' && valueColorMap[cellValue] !== undefined) {
          styledContentSpan = createStyledCell(cellValue, {backgroundColor: valueColorMap[cellValue], textAlign: 'center'});
        } else if (typeof cellValue === 'number') {
          styledContentSpan = createStyledCell(cellValue, {textAlign: 'center'});
        } else {
          styledContentSpan = createStyledCell(String(cellValue), {textAlign: 'left'});
        }

        // Step 2: Find the original index of this rowData_filtered in plastics_ratings_all_rows
        const originalRowIndex = plastics_ratings_all_rows.findIndex(originalRow => originalRow === rowData_filtered);

        let url = null;
        if (originalRowIndex !== -1) {
          // Check if the corresponding row and column exist in plastics_links_raw
          const linkRow = plastics_links_raw[originalRowIndex];
          if (linkRow && linkRow.hasOwnProperty(colName)) {
            url = String(linkRow[colName]).trim();
          } else if (i_filtered < 2 && colName === numericColumnsToColorAndLink[0]) { // Log for first few cells of first linkable column
            console.warn(`Link lookup: For original index ${originalRowIndex}, column '${colName}' not found or linkRow missing in plastics_links_raw. LinkRow:`, linkRow);
          }
        } else if (i_filtered < 2 && colName === numericColumnsToColorAndLink[0]) {
            console.warn(`Link lookup: Could not find original index for rowData:`, rowData_filtered);
        }

        // Step 3: If URL is valid, create anchor tag
        if (url && url !== "" && (url.startsWith('http://') || url.startsWith('https://'))) {
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.target = "_blank";
          anchor.rel = "noopener noreferrer";
          anchor.style.display = "block"; 
          anchor.style.textDecoration = "none";
          anchor.style.color = "inherit"; 
          anchor.appendChild(styledContentSpan);
          return anchor;
        } else {
          // If URL is invalid or not found, log it for first few relevant cells.
          if (url && url !== "" && i_filtered < 2 && colName === numericColumnsToColorAndLink[0]) {
              console.warn(`Invalid URL format for original index ${originalRowIndex}, col '${colName}': '${url}'`);
          }
          return styledContentSpan; // Return just the styled number
        }
      };
    } else if (typeof firstRatingRow[colName] === 'number') {
      // For other numeric columns not in numericColumnsToColorAndLink
      tableCellFormats[colName] = (cellValue) => createStyledCell(cellValue, {textAlign: 'right'});
    } else {
      // For text columns like "Country", "Region", "Type"
      tableCellFormats[colName] = (cellValue) => createStyledCell(cellValue, {textAlign: 'left'});
    }
  }
} else {
  console.warn("Block 4: plastics_ratings_all_rows or plastics_links_raw is empty. No table cell formats created or links will be missing.");
}

const finalTable = Inputs.table(tableSearchValue, { // tableSearchValue is the filtered/sorted data
  rows: 15,
  columns: selectedColumns,
  format: tableCellFormats,
  width: "100%"
});
```

<div class="card">
    <h2>Plastics register</h2>
    ${finalTable}
</div>




<div class="small note">The Global Plastics Data tracker provides easy access to the sources of individual data points for each country, across the whole supply-chain.  The Tracker refers only to Government published data and statistics for all aspects of the supply-chain. Each data point has been assigned a “Data score” which indicates how suitable the data is for informing annual flows of plastic in the country. The highest data scores are assigned to the data points that report plastic-specific data and are reported annually. Lower data scores are given to data points that do not publish plastic-specific data, and/or have published data infrequently.<br>The tracker was developed via a rapid assessment in the run up to INC-5 - the analysts therefore welcome users to improve the sources and provide feedback. <br>Each rating has a link to the original source of information. For feedback, updates or help, please email <a href="mailto:helena.dickinson@unsw.edu.au">Helena Dickinson</a> or <a href="mailto:e.northrop@unsw.edu.au">Eliza Northrop</a>.