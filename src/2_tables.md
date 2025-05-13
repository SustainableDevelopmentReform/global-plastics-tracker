# Table view


```js
// load the plastics data
const plastics_ratings_raw = FileAttachment("data/global_plastics_waste_data_ratings_current.csv").csv({typed: true});
// load the corresponding links data
const plastics_links_raw = FileAttachment("data/global_plastics_waste_data_links_current.csv").csv({typed: false}); // URLs are strings
```

```js
// --- Table Cell Formatting Logic ---

// Define the color mapping based on cell values
const plastics_ratings = plastics_ratings_raw.map((d) => ({
  "Country": d["Country"],
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

// Create search input (for searchable table)
const tableSearch = Inputs.search(plastics_ratings, {placeholder: "Search table..."});
const tableSearchValue = view(tableSearch);
```

```js
// --- Configurations for Cell Styling and Linking ---
// Define the color mapping based on cell values
const valueColorMap = {
  0: "#D3D3D3", // light grey
  1: "#FFDAB9", // pastel orange
  2: "#FFD8B1", // peach
  3: "#FFFFE0", // pale yellow
  4: "#98FB98", // pale green
  5: "#008000"  // green
};

// List of column names that will have colored ratings and may have links
const numericColumnsToColorAndLink = [ // Renamed for clarity
  "Domestic primary material", "Domestic Products", "Virgin content consumption",
  "Recycled content consumption", "Primary material trade (imports)",
  "Primary material trade (exports)", "Products (imports)", "Products (exports)",
  "Total generated plastic waste", "Waste recovered for recycling", "Waste to Energy",
  "Waste Incinerated (without energy recovery)", "Waste landfilled",
  "Waste (import)", "Waste (Export)"
];

// Process links data into a lookup structure: linksLookup[Country][ColumnName] = URL
// Process links data into a lookup structure: linksLookup[Country][ColumnName] = URL
const linksLookup = {};
if (plastics_links_raw) {
  plastics_links_raw.forEach((link_row, index) => {
    const country = link_row["Country"];
    if (country && String(country).trim() !== "") {
      if (!linksLookup[country]) {
        linksLookup[country] = {};
      }
      for (const colName of numericColumnsToColorAndLink) {
        if (link_row[colName] && String(link_row[colName]).trim() !== "") {
          const url_val = String(link_row[colName]).trim();
          linksLookup[country][colName] = url_val;
        }
      }
    } else {
      console.warn(`Link data row (index ${index}) found with no valid Country:`, link_row);
    }
  });
  // Log the first few entries of linksLookup to verify structure
  console.log("linksLookup populated. Sample (first 5 countries):", Object.fromEntries(Object.entries(linksLookup).slice(0,5)));
  if (Object.keys(linksLookup).length === 0) {
      console.warn("linksLookup is empty after processing. Check CSV content and country names.");
  }
} else {
  console.warn("plastics_links_raw is undefined or null after loading. linksLookup will be empty.");
}
```


```js
// create column toggle list
const colNames = Object.keys(plastics_ratings[0])
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
  span.style.color = 'black';
  span.style.padding = padding;
  span.style.display = "block";
  span.style.borderRadius = "4px";
  span.style.textAlign = textAlign;
  span.textContent = String(value);
  return span;
}

const tableCellFormats = {};
if (plastics_ratings.length > 0) {
  const allColumnNames = Object.keys(plastics_ratings[0]);
  const firstRow = plastics_ratings[0];

  for (const colName of allColumnNames) {
    if (numericColumnsToColorAndLink.includes(colName)) {
      tableCellFormats[colName] = (cellValue, i, rowData) => { // i is rowIndex, rowData is the data for the current row
        let styledContentSpan;
        if (typeof cellValue === 'number' && valueColorMap[cellValue] !== undefined) {
          const backgroundColor = valueColorMap[cellValue];
          styledContentSpan = createStyledCell(cellValue, {backgroundColor, textAlign: 'center'});
        } else if (typeof cellValue === 'number') {
          styledContentSpan = createStyledCell(cellValue, {textAlign: 'center'});
        } else {
          styledContentSpan = createStyledCell(String(cellValue), {textAlign: 'left'});
        }

        const countryName = rowData["Country"];
        let url = null;

        if (!linksLookup) {
          if (i === 0) console.warn("linksLookup object is not available in cell formatter."); // Log once
        } else if (!linksLookup[countryName]) {
          // Optional: Log if a country in ratings table is not found in linksLookup (can be verbose)
          // if (i < 10) console.log(`Formatter: Country '${countryName}' not found in linksLookup.`);
        } else if (!linksLookup[countryName][colName]) {
          // Optional: Log if a specific column for a country is not found (can be verbose)
          // if (i < 10) console.log(`Formatter: No link for ${countryName} - ${colName}`);
        } else {
          url = linksLookup[countryName][colName];
        }
        
        // Log found URL for a few rows to help debug
        if (i < 5 && numericColumnsToColorAndLink.includes(colName)) { // Log only for relevant columns and a few rows
            if(url) console.log(`Row ${i}, Country: ${countryName}, Col: ${colName} - Found URL: ${url}`);
            // else console.log(`Row ${i}, Country: ${countryName}, Col: ${colName} - No URL found.`);
        }

        if (url && typeof url === 'string' && url.trim() !== "" && (url.startsWith('http://') || url.startsWith('https://'))) {
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.target = "_blank";
          anchor.rel = "noopener noreferrer";
          anchor.style.display = "block"; // Anchor behaves as a block, making the styledContentSpan area clickable
          anchor.style.textDecoration = "none";
          anchor.style.color = "inherit"; // Inherits text color from span
          
          anchor.appendChild(styledContentSpan);
          return anchor;
        } else {
          if (url && i < 5) { // If a URL was retrieved but failed validation
            console.warn(`Invalid or malformed URL for Row ${i}, ${countryName}, ${colName}: '${url}'`);
          }
          return styledContentSpan;
        }
      };
    } else if (typeof firstRow[colName] === 'number') {
      tableCellFormats[colName] = (cellValue) => createStyledCell(cellValue, {textAlign: 'right'});
    } else {
      tableCellFormats[colName] = (cellValue) => createStyledCell(cellValue, {textAlign: 'left'});
    }
  }
}

const finalTable = Inputs.table(tableSearchValue, {
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