# About
Some placeholder text on the tracker/register and its intended funciton, development history etc.

## About the data ratings and methods
The Global Plastics Data tracker indicates where there are gaps in government published plastics data across the supply-chain. The tracker also provides access to the sources of individual data points for each country, across the whole supply-chain.

Each data point has been assigned a "Data score" which indicates how suitable the data is for informing annual flows of plastic in the country.

```js
const valueColorMap = {
  0: "#D3D3D3", // light grey
  1: "#FFDAB9", // pastel orange
  2: "#FFD8B1", // peach
  3: "#FFFFE0", // pale yellow
  4: "#98FB98", // pale green
  5: "#008000"  // green
};
```

<div class="data-score-legend-table">

| Description | Data score |
|-------------|------------|
| *All categories:* Data published annually (split by plastics) | 5 |
| *All categories:* Irregular publication of data (split by plastics)<br>*Consumption only:* Plastics production data not split by virgin/recycled content | 4 |
| *All categories:* Data published annually (not split by plastics)<br>*All categories:* Data not published since the end of 2018, but was previously published annually (split by plastics) | 3 |
| *All categories:* Irregular publication of data (not split by plastics)<br>*All categories:* One off publication (split by plastics)<br>*All categories:* Plastics data published annually, but not provided in tonnage format | 2 |
| *All categories:* One off publication (composition only)<br>*All categories:* One off publication (not split by plastics)<br>*All categories:* One off regional publication | 1 |
| Not found | (_no score_) |

</div>

```js
// This code block should run after the Markdown table is rendered.
{ // Using a block to keep variables local
  const tableWrapper = document.querySelector(".data-score-legend-table");

  if (tableWrapper) {
    const table = tableWrapper.querySelector("table");
    if (table) {
      const dataRows = table.querySelectorAll("tbody tr"); // Assumes Markdown generates <thead> and <tbody>

      dataRows.forEach(row => {
        // "Data score" is the second column, so its index is 1.
        const scoreCell = row.cells[1]; 
        
        if (scoreCell) {
          const scoreText = scoreCell.textContent.trim();
          
          // Handle the "(_no score_)" case explicitly
          if (scoreText.toLowerCase() === "(_no score_)" || scoreText === "") {
            // For rows with no score, you can apply a default style or do nothing.
            // Example: row.style.backgroundColor = "var(--theme-background-alt)";
            // To explicitly ensure no background from previous runs (if any):
            // row.style.backgroundColor = ""; 
            // Array.from(row.cells).forEach(cell => { cell.style.color = ""; });
            return; // Skip coloring for this row
          }

          const score = parseInt(scoreText, 10);

          if (!isNaN(score) && valueColorMap[score] !== undefined) {
            const backgroundColor = valueColorMap[score];
            row.style.backgroundColor = backgroundColor;

            // Adjust text color for better contrast on dark backgrounds
            let textColor = "black"; // Default text color
            if (score === 5) { // Dark green background
              textColor = "white";
            }
            // Apply text color to all cells in the row for consistency
            Array.from(row.cells).forEach(cell => {
              cell.style.color = textColor;
            });

          } else {
            // Fallback for scores not in map or unparseable, ensure default text color
            Array.from(row.cells).forEach(cell => {
              cell.style.color = "black";
            });
            // console.warn(`Could not parse score or no color defined for score: '${scoreText}' in row:`, row);
          }
        }
      });
    } else {
      console.warn("No <table> element found within the '.data-score-legend-table' div.");
    }
  } else {
    console.warn("The wrapper div with class '.data-score-legend-table' was not found. Make sure it exists and the class name is correct.");
  }

  // This script runs once when the cell executes. If the table content changes
  // dynamically by other means, this script would need to be re-run or adapted.
  // For a static Markdown table, this is sufficient.
}
```

### Links to further resources
- Resources page
- Methods
- Handbook
- Etc.

## About the team
- Person 1
- Person 2
- Institution 1
- etc.
