# Table view

```js
// load the plastics data
const plastics_ratings_raw = FileAttachment("data/global_plastics_waste_data_ratings_current.csv").csv({typed: true});
// load the corresponding links data
const plastics_links_raw = FileAttachment("data/global_plastics_waste_data_links_current.csv").csv({typed: false}); // URLs are strings
```

```js
const valueColorMap = {
  0: "#D3D3D3", 1: "#FFDAB9", 2: "#FFD8B1",
  3: "#FFFFE0", 4: "#98FB98", 5: "#008000"
};

const scoreLegend = htl.html`<div class="color-legend-wrapper">
  <div class="color-legend">
    <strong class="legend-title">Data score colour coding:</strong>
    ${Object.entries(valueColorMap)
      .sort(([scoreA], [scoreB]) => parseInt(scoreA) - parseInt(scoreB)) // Sort scores numerically
      .map(([score, color]) => htl.html`
      <div class="legend-item">
        <span class="legend-swatch" style="background-color: ${color};"></span>
        <span class="legend-label">${score}</span>
      </div>
    `)}
  </div>
</div>`;
```

```js
// Column names that will be colored and should get links.
// These names must match the keys in plastics_ratings_all_rows objects
// AND the column headers in your links CSV.
// THIS DEFINITION MUST COME BEFORE plastics_ratings_all_rows if used inside its .map()
const numericColumnsToColorAndLink = [
  "Domestic primary material", "Domestic Products", "Virgin content consumption",
  "Recycled content consumption", "Primary material trade (imports)",
  "Primary material trade (exports)", "Products (imports)", "Products (exports)",
  "Total generated plastic waste", "Waste recovered for recycling", "Waste to Energy",
  "Waste Incinerated (without energy recovery)", "Waste landfilled",
  "Waste (import)", "Waste (Export)"
];

// Create a new dataset where linkable cells contain both their value and URL
const plastics_ratings_all_rows = plastics_ratings_raw.map((raw_rating_row, index) => {
  const processed_row = { __originalIndex: index }; // Keep original index for reference if needed elsewhere

  // First, copy and correctly type all data from the raw ratings row
  for (const key in raw_rating_row) {
    if (raw_rating_row.hasOwnProperty(key)) {
      if (key === "Country" || key === "Region" || key === "Type") {
        processed_row[key] = raw_rating_row[key]; // These are strings
      } else {
        // For other columns, attempt to convert to number.
        // FileAttachment csv({typed: true}) should handle this, but this ensures it.
        const numVal = Number(raw_rating_row[key]);
        // Check if it's a valid number and not from an empty string (which Number() converts to 0)
        if (!isNaN(numVal) && String(raw_rating_row[key]).trim() !== "") {
            processed_row[key] = numVal;
        } else {
            processed_row[key] = raw_rating_row[key]; // Keep as original if not a clear number
        }
      }
    }
  }

  // Now, for columns that need linking, transform their value into an object: {value, url}
  // This relies on plastics_links_raw having the same number of rows and corresponding columns.
  if (plastics_links_raw && index < plastics_links_raw.length) {
    const link_data_for_row = plastics_links_raw[index]; // Get the corresponding row from the links table
    for (const colName of numericColumnsToColorAndLink) {
      if (processed_row.hasOwnProperty(colName)) { // Check if the column exists in our processed_row
        const currentValue = processed_row[colName]; // This is the rating value
        let urlValue = null;
        if (link_data_for_row && link_data_for_row.hasOwnProperty(colName)) {
          urlValue = String(link_data_for_row[colName]).trim();
        }
        processed_row[colName] = { value: currentValue, url: urlValue };
      }
      // If processed_row doesn't have colName, it means numericColumnsToColorAndLink might list
      // a column not present in plastics_ratings_raw CSV.
    }
  } else {
    // This case handles if plastics_links_raw is missing or shorter than plastics_ratings_raw.
    // All linkable columns for this row will have their URL set to null.
    for (const colName of numericColumnsToColorAndLink) {
      if (processed_row.hasOwnProperty(colName)) {
        processed_row[colName] = { value: processed_row[colName], url: null };
      }
    }
  }
  return processed_row;
});

// DEBUG: Verify the new structure of plastics_ratings_all_rows
if (plastics_ratings_all_rows.length > 0) {
    console.log("DEBUG Block 3: First row of processed plastics_ratings_all_rows (check for {value, url} objects):", JSON.parse(JSON.stringify(plastics_ratings_all_rows[0])));
    // Check a specific linkable column in the first row
    if (numericColumnsToColorAndLink.length > 0 && plastics_ratings_all_rows[0].hasOwnProperty(numericColumnsToColorAndLink[0])) {
        console.log(`DEBUG Block 3: Content of first linkable column ('${numericColumnsToColorAndLink[0]}') in first row:`, JSON.parse(JSON.stringify(plastics_ratings_all_rows[0][numericColumnsToColorAndLink[0]])));
    }
}
if (!plastics_links_raw || plastics_links_raw.length === 0) {
    console.warn("WARNING Block 3: plastics_links_raw is empty or not loaded. URLs will be missing.");
}


// Create search input using the processed data.
// Inputs.search will try to stringify the {value, url} objects for searching.
// This might affect search quality for those columns.
// For robust search, you might need to provide a custom 'format' function to Inputs.search
// that extracts searchable text, e.g., only from the 'value' part or 'Country', 'Region'.
const tableSearch = Inputs.search(plastics_ratings_all_rows, {
    placeholder: "Search table...",
    // Example of a custom format function for search, if needed:
    // format: (d) => {
    //   let searchText = `${d.Country || ""} ${d.Region || ""} ${d.Type || ""}`;
    //   numericColumnsToColorAndLink.forEach(col => {
    //     if (d[col] && typeof d[col] === 'object' && d[col].hasOwnProperty('value')) {
    //       searchText += ` ${d[col].value}`;
    //     } else if (d[col]) {
    //       searchText += ` ${d[col]}`;
    //     }
    //   });
    //   return searchText;
    // }
});
const tableSearchValue = view(tableSearch);

// Your existing debug logs for plastics_links_raw and row counts can remain if you find them useful.
// Make sure they are placed after the relevant variables are defined.
if (plastics_links_raw && plastics_links_raw.length > 0 && plastics_ratings_all_rows.length > 0) {
    if (plastics_ratings_all_rows.length !== plastics_links_raw.length) {
        console.warn("WARNING Block 3: Row count mismatch between ratings data and links data!");
    }
}
```


```js
// create column toggle list
// Filter out the internal __originalIndex from the list of column names available for selection
const colNames = plastics_ratings_all_rows.length > 0
    ? Object.keys(plastics_ratings_all_rows[0]).filter(key => key !== "__originalIndex")
    : [];

const startList = ["Country", "Domestic primary material", "Domestic Products", "Primary material trade (imports)", "Primary material trade (exports)", "Total generated plastic waste"];
// Ensure startList doesn't contain __originalIndex (it shouldn't by default, but good for robustness)
const filteredStartList = startList.filter(key => key !== "__originalIndex");

const selectedColumns = view(Inputs.checkbox(colNames, {
  label: "Columns to display",
  value: filteredStartList, // Use the filtered list
  multiple: true
}));
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

// Helper function to create a styled span for cell content (this function remains the same)
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

// Ensure plastics_ratings_all_rows is populated before trying to get keys from it
if (plastics_ratings_all_rows && plastics_ratings_all_rows.length > 0) {
  // Get all column names from the data, excluding our internal __originalIndex if you kept it.
  // The column names themselves haven't changed.
  const allColumnNamesFromData = Object.keys(plastics_ratings_all_rows[0]).filter(key => key !== "__originalIndex");
  const firstProcessedRow = plastics_ratings_all_rows[0]; // Used to infer types for non-linkable numeric cols

  for (const colName of allColumnNamesFromData) {
    if (numericColumnsToColorAndLink.includes(colName)) {
      // This formatter is for columns that are now {value, url} objects
      tableCellFormats[colName] = (cellData_obj, i_filtered, rowData_filtered) => {
        // cellData_obj is expected to be { value: rating_value, url: "string_url_or_null" }

        let ratingValue_to_display;
        let url_for_link = null;

        if (typeof cellData_obj === 'object' && cellData_obj !== null && cellData_obj.hasOwnProperty('value')) {
          ratingValue_to_display = cellData_obj.value;
          url_for_link = cellData_obj.url;
        } else {
          // Fallback: If cellData_obj is not the expected object.
          // This might happen if there was an error in data processing,
          // or if a column was mistakenly added to numericColumnsToColorAndLink.
          ratingValue_to_display = cellData_obj; // Display whatever we got
          if (i_filtered < 1) { // Log once per column rendering to avoid spam
            console.warn(`Formatter for '${colName}': Expected cellData_obj to be {value, url}, but received:`, cellData_obj, "Row data:", rowData_filtered);
          }
        }

        // Create the styled span for the rating value
        let styledContentSpan;
        if (typeof ratingValue_to_display === 'number' && valueColorMap[ratingValue_to_display] !== undefined) {
          styledContentSpan = createStyledCell(ratingValue_to_display, {backgroundColor: valueColorMap[ratingValue_to_display], textAlign: 'center'});
        } else if (typeof ratingValue_to_display === 'number') {
          styledContentSpan = createStyledCell(ratingValue_to_display, {textAlign: 'center'});
        } else {
          // Handle cases like null, undefined, or non-numeric rating values gracefully
          styledContentSpan = createStyledCell(String(ratingValue_to_display !== undefined && ratingValue_to_display !== null ? ratingValue_to_display : "N/A"), {textAlign: 'left'});
        }

        // If a valid URL exists, create an anchor tag
        if (url_for_link && url_for_link !== "" && (url_for_link.startsWith('http://') || url_for_link.startsWith('https://'))) {
          const anchor = document.createElement('a');
          anchor.href = url_for_link;
          anchor.target = "_blank";
          anchor.rel = "noopener noreferrer";
          anchor.style.display = "block";
          anchor.style.textDecoration = "none";
          anchor.style.color = "inherit"; // Link color inherits from the span
          anchor.appendChild(styledContentSpan);
          return anchor;
        } else {
          // If URL is invalid, empty, or null, return just the styled rating value
          return styledContentSpan;
        }
      };
    } else if (firstProcessedRow && typeof firstProcessedRow[colName] === 'number') {
      // For other numeric columns (not in numericColumnsToColorAndLink) that are plain numbers
      tableCellFormats[colName] = (cellValue) => createStyledCell(cellValue, {textAlign: 'right'});
    } else {
      // For general text columns (e.g., "Country", "Region", "Type") or any other plain values
      tableCellFormats[colName] = (cellValue) => {
         // Guard against an unexpected object here, though ideally it shouldn't happen for these columns.
        if (typeof cellValue === 'object' && cellValue !== null && cellValue.hasOwnProperty('value')) {
           console.warn(`Formatter for non-linkable column '${colName}' received an unexpected object:`, cellValue);
           return createStyledCell(String(cellValue.value), {textAlign: 'left'});
        }
        return createStyledCell(String(cellValue !== undefined && cellValue !== null ? cellValue : ""), {textAlign: 'left'});
      };
    }
  }
} else {
  console.warn("Cell Formatting Block: plastics_ratings_all_rows is empty. Table cell formats cannot be created.");
}
```

${scoreLegend}
Refer to [the guide on using the tracker](./1_about#using-the-global-plastics-data-tracker) for information about the scores.

```js
const finalTable = view(Inputs.table(tableSearchValue, { // tableSearchValue is the filtered/sorted data
  rows: 15,
  columns: selectedColumns,
  format: tableCellFormats,
  width: "100%"
}));
```

You can click any table entry with a rating >0 in the table to visit the original data source.  
  
You can also download all of the data rating as a [.csv file](./data/global_plastics_waste_data_ratings_current.csv), or download your filtered selection below (_coming soon..._).  

<button id="downloadButton">Download File (coming soon...)</button>

<style>
  /* Add these styles to your existing <style> block or create a new one */

  .color-legend-wrapper {
    margin-bottom: 1.5rem; /* Space below the legend, before the table controls/table */
    /* max-width: 700px; /* Optional: constrain width of legend container */
  }

  .color-legend {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem 1rem; /* Vertical gap, Horizontal gap between items */
    font-family: var(--sans-serif, system-ui, sans-serif);
    font-size: 0.9em;
    padding: 0.75rem 1rem;
    background-color: var(--theme-background-alt);
    border: 1px solid var(--theme-background);
    border-radius: var(--theme-radius, 4px);
  }

  .legend-title {
    font-weight: 600;
    margin-right: 0.5rem;
    color: var(--theme-foreground);
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.4em; /* Space between swatch and label */
  }

  .legend-swatch {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 1px solid var(--theme-foreground-faint, #bbb); /* Border for light swatches */
    border-radius: 3px;
  }

  .legend-label {
    color: var(--theme-foreground-muted, #333);
  }
</style>

<div class="small note">
Our team welcomes feedback to improve this tool for policymakers, researchers, and stakeholders. For feedback, updates or help, please explore our website or email
<a href="mailto:helena.dickinson@unsw.edu.au">Helena Dickinson</a>
or
<a href="mailto:e.northrop@unsw.edu.au">Eliza Northrop</a>.