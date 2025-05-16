# Global plastics tracker

<div style="margin-top: 2rem; padding: 1rem; background-color: var(--theme-background-alt); border-radius: var(--theme-radius);">
  <h3>Explore the global plastics register and visualisation tools</h3>
  <p>Use the navigation pane to the left, or follow the links in the cards below for detailed data tables, interactive maps, and learn how you can contribute to this growing dataset.</p>
  <a href="/1_about" style="display: inline-block; margin-top: 0em; padding: 0.5em 1em; background-color: var(--theme-foreground-focus); color: var(--theme-background); text-decoration: none; border-radius: 4px;">Learn more about the register and tools &raquo;</a>
</div>

```js
// Load the ratings data
const ratingsDataRaw = await FileAttachment("data/global_plastics_waste_data_ratings_current.csv").csv({typed: true});

// Define the plastic category columns (based on our previous work)
// Ensure these names EXACTLY match the headers in your CSV.
const plasticCategories = [
  "Domestic primary material", "Domestic Products", "Virgin content consumption",
  "Recycled content consumption", "Primary material trade (imports)",
  "Primary material trade (exports)", "Products (imports)", "Products (exports)",
  "Total generated plastic waste", "Waste recovered for recycling", "Waste to Energy",
  "Waste Incinerated (without energy recovery)", "Waste landfilled",
  "Waste (import)", "Waste (Export)"
];

// Process data: convert category ratings to numbers and count relevant stats
// Assuming one row per unique country in your CSV.
const reportedCountriesData = ratingsDataRaw.map(d => {
    const countryData = { "Country": d.Country }; // Assuming CSV has a "Country" column
    plasticCategories.forEach(cat => {
        countryData[cat] = +d[cat]; // Convert to number
    });
    return countryData;
});

const numReportedCountries = reportedCountriesData.length;
const worldCountryTotal = 195; // Approximate number of countries in the world (e.g., UN recognized)

// Stat 1: Percentage of countries reported
const percReported = (numReportedCountries / worldCountryTotal) * 100;

// Stat 2: Percentage of reported countries with all ratings = 0
let countAllZeros = 0;
if (numReportedCountries > 0) {
    reportedCountriesData.forEach(countryData => {
        const allCategoriesAreZero = plasticCategories.every(cat => countryData[cat] === 0 || isNaN(countryData[cat]));
        if (allCategoriesAreZero) {
            countAllZeros++;
        }
    });
}
const percAllZeros = (numReportedCountries > 0) ? (countAllZeros / numReportedCountries) * 100 : 0;

// Stat 3: Percentage of reported countries with at least one rating >= 3
let countOneOrMoreHighRating = 0;
if (numReportedCountries > 0) {
    reportedCountriesData.forEach(countryData => {
        const hasHighRating = plasticCategories.some(cat => countryData[cat] >= 3);
        if (hasHighRating) {
            countOneOrMoreHighRating++;
        }
    });
}
const percOneOrMoreHighRating = (numReportedCountries > 0) ? (countOneOrMoreHighRating / numReportedCountries) * 100 : 0;

// Stat 4: Percentage of reported countries with an AVERAGE rating >= 3
let countAverageOrMoreHighRating = 0;
if (numReportedCountries > 0) {
    reportedCountriesData.forEach(countryData => {
        let sumOfRatings = 0;
        let countOfRatedCategories = 0; // In case some categories might be NaN or missing for a country
        
        plasticCategories.forEach(cat => {
            const rating = countryData[cat];
            if (typeof rating === 'number' && !isNaN(rating)) {
                sumOfRatings += rating;
                countOfRatedCategories++;
            }
        });
        
        if (countOfRatedCategories > 0) {
            const averageRating = sumOfRatings / countOfRatedCategories;
            if (averageRating >= 3) {
                countAverageOrMoreHighRating++;
            }
        }
    });
}
const percAverageOrMoreHighRating = (numReportedCountries > 0) ? (countAverageOrMoreHighRating / numReportedCountries) * 100 : 0;

// Helper function to format percentages
function formatPercentage(value, fractionDigits = 1) {
  if (value == null || isNaN(value)) return "N/A";
  return `${value.toFixed(fractionDigits)}%`;
}
```

```js
// Content for the Top-Left Stats Card
const statsCardContent = html`
  <div class="stat-item">
    <span class="stat-label">Countries covered globally</span>
    <span class="stat-value">${formatPercentage(percReported, 0)} <span class="stat-value-suffix">(${numReportedCountries} countries)</span></span>
  </div>
  
  <div class="stat-item">
    <span class="stat-label">Countries with all categories rated 0</span>
    <span class="stat-value">${formatPercentage(percAllZeros)}</span>
  </div>
  
  <div class="stat-item">
    <span class="stat-label">Countries with an average rating of 3+</span>
    <span class="stat-value">${formatPercentage(percAverageOrMoreHighRating)}</span>
  </div>
  
  <a href="/1_tables" style="display: inline-block; margin-top: 1.5em; padding: 0.5em 1em; background-color: var(--theme-foreground-focus); color: var(--theme-background); text-decoration: none; border-radius: 4px;">View Data Tables &raquo;</a>
`;

// Content for the Bottom-Left About Card
const aboutCardContent = html`
  <h2>About This Tool</h2>
  <p>This tool is a global register for plastic waste data and policies, currently in development.</p>
  <a href="/4_resources" style="display: inline-block; margin-top: 0em; padding: 0.5em 1em; background-color: var(--theme-foreground-focus); color: var(--theme-background); text-decoration: none; border-radius: 4px;">Discover more plastics resources &raquo;</a>
  <p>Your contributions can help improve its accuracy and comprehensiveness.</p>
  <a href="/5_contribute" style="display: inline-block; margin-top: 0em; padding: 0.5em 1em; background-color: var(--theme-foreground-focus); color: var(--theme-background); text-decoration: none; border-radius: 4px;">Learn how to contribute &raquo;</a>
`;

// Content for the Right-Side Map Card (Image as a link)
//const map_card_img = await FileAttachment("data/map_placeholder.png").image()
const mapImageLink = html`
  <h2 style="text-align: left; width: 100%;">Global Map of the Plastics Data Register</h2>
  <a href="/3_map" style="display: inline-block; margin-top: 0em; padding: 0.5em 1em; background-color: var(--theme-foreground-focus); color: var(--theme-background); text-decoration: none; border-radius: 4px;">Explore the interactive map &raquo;
    <img src="${await FileAttachment("data/map_placeholder.png").url()}" alt="Global Plastics Map" style="max-width:100%; height:auto; border:1px solid #ddd; margin-top: 1em; border-radius: 4px;" />
  </a>
`;
```

<style>
  .dashboard-grid {
    display: grid;
    gap: 1.5rem; /* Gap between cards */
    grid-template-columns: 1fr; /* Single column by default for small screens */
    margin-top: 2rem;
  }

  /* Responsive layout:
     Defines a 2-column layout. Left column takes roughly 1/3, right column 2/3.
     The map card on the right spans two conceptual rows.
  */
  @media (min-width: 768px) { /* Adjust breakpoint as needed */
    .dashboard-grid {
      /* Create 2 columns: first for stats/about, second for map */
      grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); 
      /* Define rows to allow map to span */
      grid-template-rows: auto auto; 
    }
  }

  .dashboard-grid .card {
    /* Basic card styling - Observable's default theme usually provides this.
       You can enhance it here if needed. */
    /* Example: border: 1px solid var(--theme-foreground-muted); */
    padding: 1.5rem; /* Standard card padding */
    background-color: var(--theme-card-background);
    border-radius: var(--theme-radius, 4px);
    box-shadow: var(--theme-shadow-2, 0 2px 4px rgba(0,0,0,0.1));
  }

  /* Specific grid item placements for larger screens */
  @media (min-width: 768px) {
    .stats-card-item { /* Class for the div containing statsCardContent */
      grid-column: 1 / 2;
      grid-row: 1 / 2;
    }
    .about-card-item { /* Class for the div containing aboutCardContent */
      grid-column: 1 / 2;
      grid-row: 2 / 3;
    }
    .map-card-item { /* Class for the div containing mapImageLink */
      grid-column: 2 / 3;
      grid-row: 1 / 3; /* Span both rows */
      display: flex;
      flex-direction: column;
      /* justify-content: center; */ /* Optional: if you want vertical centering of content */
      align-items: center;
    }
  }

  .dashboard-grid .card h2 {
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: 1.25rem; /* Adjust as needed */
  }
  .dashboard-grid .card p { /* General paragraph styling within cards */
    margin-bottom: 0.75em;
    line-height: 1.6;
  }

  /* Styles for the new statistic items format */
  .stat-item {
    margin-bottom: 1.25em; /* Space between each statistic item */
  }

  .stat-label {
    display: block; /* Makes it take its own line */
    font-size: 0.85em; /* Smaller text for the label */
    color: var(--theme-foreground-muted, #666); /* Muted color for the label */
    margin-bottom: 0.2em; /* Small space between label and value */
    line-height: 1.4;
  }

  .stat-value {
    display: block; /* Makes it take its own line */
    font-size: 1.75em; /* Significantly larger text for the statistic */
    font-weight: bold;
    color: var(--theme-foreground, #111); /* Regular text color for the value */
    line-height: 1.2;
  }

  .stat-value .stat-value-suffix {
    font-size: 0.5em; /* Makes the suffix part smaller relative to the main stat value */
    font-weight: normal; /* Normal weight for the suffix */
    color: var(--theme-foreground-muted, #666);
    margin-left: 0.25em;
  }

  /* Optional: Adjust spacing if a stat-item directly follows an h2 in any card */
  .dashboard-grid .card h2 + .stat-item {
    margin-top: 1rem; 
  }
</style>


<div class="dashboard-grid">
  <div class="card stats-card-item">
    ${statsCardContent}
  </div>
  <div class="card map-card-item">
    ${mapImageLink}
  </div>
  <div class="card about-card-item">
    ${aboutCardContent}
  </div>
</div>


<div class="small note">The Global Plastics Data tracker provides easy access to the sources of individual data points for each country, across the whole supply-chain.  The Tracker refers only to Government published data and statistics for all aspects of the supply-chain. Each data point has been assigned a “Data score” which indicates how suitable the data is for informing annual flows of plastic in the country. The highest data scores are assigned to the data points that report plastic-specific data and are reported annually. Lower data scores are given to data points that do not publish plastic-specific data, and/or have published data infrequently.<br>The tracker was developed via a rapid assessment in the run up to INC-5 - the analysts therefore welcome users to improve the sources and provide feedback. <br>Each rating has a link to the original source of information. For feedback, updates or help, please email <a href="mailto:helena.dickinson@unsw.edu.au">Helena Dickinson</a> or <a href="mailto:e.northrop@unsw.edu.au">Eliza Northrop</a>.