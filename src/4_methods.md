# Methods

Each data point has been assigned a “Data score” which indicates how suitable the data point is for informing annual flows of plastic in the country. The highest data score is assigned to the data points that report plastic-specific data and are reported annually. Lower data scores are given to data points that do not refer to plastic-specific data, and/or data that is published infrequently, and/or only for certain regions/provinces/states in the country.  

A full breakdown of the data score descriptions is listed below.  

```js
const valueColorMap = {
  0: "#D3D3D3", // light grey
  1: "#E67E22 ", // pastel orange
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
| Not found (_no score_) | 0 |

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
          
          // Handle the "top row" case explicitly
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

## Limitations  

Whilst using search strings, only the first two pages of the search engine (Google) were reviewed. If a data source was not found on the first two pages, the data point was assigned “not found”. This does not mean the data is not available, only that it was not found during our search.  

A reason for this may be due to language differences – all of our searches used English phrases, but where countries do not translate their websites to English, the sources may not have been picked up. In addition, some countries may collect data, but not report it.  

For primary plastics production specifically, some countries may not report this data because they do not produce primary plastics in their country.  

## Scope  

Only government published data has been captured in the tracker. There are therefore a number of plastic-related publications that might be helpful for countries to develop plastic accounts (plastics data that follows a standardised collection methodology and is reproducible periodically), that have not been included in this iteration of the tracker. These included publications by IUCN, the UN, the European union, SPREP, SEEA, academic organisations and other consultancy organisations.  

In order for data to be captured in the tracker, it needs to have met at least one of the following criteria:  

1) Be published on the government website or;  

2) Have been part-funded and publicly endorsed by the relevant government or;  

3) Be published on a global platform that publishes data submitted by Government (e.g., Eurostat or COMTRADE).  

 

 

## Domestic Plastics Production 

### Domestic Primary Plastics Production 

#### Approach 

##### European data 

Eurostat was used in the first instance to identify European Countries that reported Primary Plastic Production data. 

Eurostat allows users to filter total production of “Plasticised polyvinyl chloride mixed with any other substance, in primary forms”. Where countries reported this data, it was assumed that they collected and reported data on “Domestic Primary Plastic Production”. 

##### Search strings 

The below search string was used for all countries.  

`“Country” “Statistical Department” and/or “Country” “Statistics” “Gov” `

Once a countries statistical department was located, the term “Plastics” was searched in the search bar (if available). Any plastic production data displayed here was reviewed. 

If no results were available further searches were carried out: 

`“Country” “Plastics Production” “Data” `
`“Country” “Production” “Data” `

From here any data found was reviewed to determine if it fell under “Domestic Primary Plastics Production” or “Domestic Plastics Products” 

For European countries, where better data was found using these search strings, this new data superseded the Eurostat data. 

#### Sources 

Eurostat 
Government websites 

#### Caveats 

Some countries may not produce “primary plastics” and therefore may not publish this data. The score for these countries data are data “not found” until we have confirmation that the country does not produce primary plastics. 

Domestic Plastics Products 

#### Approach 

##### Individual country data 

The following search string was used to identify data sources. 

`“Country” “Statistical Department” and/or “Country” “Statistics” “Gov” `

Once a countries statistical department is located, the term “Plastics” was searched in the search bar (if available). Any plastic production data displayed here was reviewed. 

If no results were available further searches were carried out: 

`“Country” “Plastics Production” “Data” `
`“Country” “Plastics” “Account” `

From here any data found was reviewed to determine if it fell under “Domestic Primary Plastics Production” or “Domestic Plastics Products” 

#### Sources 
Government websites 

#### Caveats 

Products containing plastics may be captured in other categories – and similarly, some of the products reported may contain other materials. However, for the purposes of understanding whether countries report plastic product production data this has limited impact. 

### Plastics Consumption 

Very few sources distinguish between the consumption of virgin plastics and consumption of recycled plastics. This limitation is reflected in the lower scores given to countries for this data type. 

#### Approach 

##### European data 

Eurostat was used in the first instance to identify European Countries that reported Plastic Consumption data. 

Eurostat allows users to filter “Domestic Material Consumption” of “Fossil energy materials/carriers”. Where countries reported this data, it was assumed that they collected and reported data on “Plastics Consumption” plus other uses of fossil energy materials/carriers such as electricity, fuel and manufacturing. 

Because this consumption data was reported annually, but not split by plastics specifically, it was give a data score of:  *** (see table at the top of the page for description or rating). 

##### Individual country data 

For all countries, the following search string was used to identify data sources. 

`“Country” “Statistical Department” and/or “Country” “Statistics” “Gov” `

Once a countries statistical department is located, the term “Plastics” was searched in the search bar (if available). Any plastic consumption data displayed here was reviewed. 

If no results were available further searches were carried out: 

`“Country” “Plastics consumption” “Data” `
`“Country” “Plastics” “Account” `

From here any data found was reviewed to determine if it described “Plastics Consumption” 

For European countries, where better data was found using these search strings, this superseded the Eurostat data. 

#### Sources 

Eurostat 
Government websites 

#### Caveats 

N/A 

## Trade data 

### Primary Material 

#### Approach 

For imports and exports of primary plastic material, the Standard international trade classification (SITC) code “575: Other Plastics, Primary form” was applied and an assessment was made as to whether each country annually reported this data to all “world” partners. 

Where countries did not report data on COMTRADE, the following search string was used to identify data sources. 

`“Country” “Statistical Department” and/or “Country” “Statistics” “Gov” `

Once a countries statistical department is located, the term “Trade” was searched in the search bar (if available). Any trade data displayed here was reviewed for plastics-related trade data. 

If no plastics results were available, further searches were carried out in the search engine: 

`“Country” “Trade” “Data” `
`“Country” “Trade” “Data” “Gov” `

From here any data found was reviewed to determine if it described “Plastics Primary Material Trade data” 

#### Sources 

COMTRADE 

Government websites 

#### Caveats 

Some countries may have published relevant trade data within their own statistical websites. However, these sources were not reviewed if the data was found on COMTRADE during the initial search.  

### Plastic Products 

#### Approach 

For imports and exports of plastic products, the SITC code “893: Articles of artificial plastic materials nes” was applied and an assessment was made as to whether each country annually reported this data to all “world” partners. 

Where countries did not report data on COMTRADE, the following search string was used to identify data sources. 

`“Country” “Statistical Department” and/or “Country” “Statistics” “Gov” `

Once a countries statistical department is located, the term “Trade” was searched in the search bar (if available). Any trade data displayed here was reviewed. 

If no plastics results were available further searches were carried out in the search engine: 

`“Country” “Trade” “Data” `
`“Country” “Trade” “Data” “Gov” `

From here any data found was reviewed to determine if it described “Plastic Products Trade data” 

#### Sources 

COMTRADE 

Government websites 

#### Caveats 

Whilst the SITC code 893 is expected to cover most plastic products, plastic products are also captured in other SITC codes: 

`58: Plastic Materials `
`71994: Metal plastic joints `

`85101: Footwear soles & uppers of rubber or plast.mat `

`85102: Footwear with soles of leather/rubber/plastic `

 

Some countries may have published relevant trade data within their own statistical websites. However, these sources were not reviewed if the data was found on COMTRADE during the initial search.  

### Total Plastics Waste 

#### Approach 

In the first instance, for each country the following search strings were used: 

`“Country” “Statistical Department” and/or “Country” “Statistics” “Gov” `

Once a countries statistical department is located, the term “Waste” was searched in the search bar (if available). Any waste data displayed here was reviewed and assessed to see if the country reported annual plastic waste data. 

If no results were available further searches were carried out in the search engine: 
 
`“Country” “Plastics Waste” “Data” “Gov” `

`“Country” “Plastics Waste” “Data”  `

`“Country” “Waste” “Data” `

`“Country” “Waste” “Account” `

From here any data found was reviewed to determine if it described “Waste data” and if this data was split by plastic waste. 

Finally, Eurostat data was reviewed for the countries that were still marked as “Plastic Waste” data “not found”. Eurostat does not split by material, but collates total waste generation data each year for most European countries. 

#### Sources 

Government websites 

Eurostat 

Caveats 

Some countries may have published plastic waste generation data within their own statistical websites. However, these sources were not reviewed if the data was found on Eurostat during the initial search.  

### Waste Treatment 

#### Approach  

##### European data 

Eurostat was used in the first instance to identify European Countries that reported plastics waste treatment data. 

Eurostat enables users to filter by `“Plastic Wastes”` and then by: 

- `“Recycling” `
- `“Energy Recovery” `
- `“Incineration” `
- `“Landfill” `
- `“Landfill and other” `
- `“Backfilling” `
- `“Other” `

- Where countries reported this data, it was assumed that they collected and reported data on the following treatment types (as listed in the plastics data checklist): 
- Recovered for recycling 
- Waste to Energy 
- Incinerated (without energy recovery) 
- Landfilled 

##### Individual country data 

For non-European countries, and countries that did not report data to Eurostat, the following search string was used to identify data sources. 

`“Country” “Statistical Department” and/or “Country” “Statistics” “Gov” `

Once a countries statistical department is located, the term “Waste” was searched in the search bar (if available). Any plastic production data displayed here was reviewed. 

If no results were available further searches were carried out: 

`“Country” “Recycling” “Data” “Gov” `

`“Country” “Waste to Energy” “Data” “Gov” `

`“Country” “Incineration” “Data” “Gov” `

`“Country” “Landfill” “Data” “Gov” `
 

From here any data found was reviewed to determine if it was published by the government and if it split waste treatment to material-specific data i.e., plastics. 

#### Sources 

Eurostat 

Government websites 

#### Caveats  

Some countries may have published plastic waste treatment data within their own statistical websites. However, these sources were not reviewed if the data was found on Eurostat during the initial search.  

### Waste Trade 

#### Approach  

For imports and exports of primary plastic material, the SITC code “579: Plastic waste, scrap etc” was applied and an assessment was made as to whether each country annually reported this data to all “world” partners. 

Where countries did not report data on COMTRADE, the following search string was used to identify data sources. 

`“Country” “Statistical Department” and/or “Country” “Statistics” “Gov” `

Once a countries statistical department is located, the term “Trade” was searched in the search bar (if available). Any waste trade data displayed here was reviewed. 

If no results were available further searches were carried out: 

`“Country” “Trade” “Data” `
`“Country” “Trade” “Data” “Gov” `

From here any data found was reviewed to determine if it described “Plastics Waste Trade data” 

#### Sources 

COMTRADE 

Government Websites 

#### Caveats 
Some countries may have published relevant trade data within their own statistical websites. However, these sources were not reviewed if the data was found on COMTRADE during the initial search.  

#### Quality Assurance 

Carried out internally and reviewed externally by officials from the UK Government and Stats Canada. 


<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');
  :root {
    --sans-serif: "Roboto", sans-serif;
  }
  body, h1, h2, h3, h4, h5, h6 {
    font-family: var(--sans-serif);
  }
</style>