# About

## Quick links:
- [About the team](#about-the-team)
- [Motivation for the tracker](#motivation-for-developing-the-global-plastics-data-tracker)
- [Using the tracker](#using-the-global-plastics-data-tracker)
- [Key takeaways](#key-takeaways)

Historically national-level plastics data has not been easily accessible via a single data platform – making it hard for organisations to identify where there are gaps in global reporting of plastics data. The Global Plastics Data tracker addresses this by providing easy access to the sources of individual data points for each country, across the whole supply-chain.  

GOAP has developed the Global Plastics Data Tracker to identify the gaps in plastics data reporting, and to identify areas where data reporting is being advanced. This information will help countries understand where progress can be made within jurisdiction, and help countries more easily learn from other jurisdictions, by observing what others are doing to collect and present plastics data. This information will also help non-governmental organisations better target support for countries, help international groups monitor progress and facilitate more detailed analysis on flows of plastic.  

The Tracker identifies data relevant to the full lifecycle of plastics in line with the Plastics Data Checklist:  
- Data on the **production and consumption** of plastics are essential to quantify plastic flows, understand the scale of plastic use and identify areas for reduction.  
- **Trade** data helps track the transboundary movement of plastics, which is crucial for understanding global distribution patterns.  
- **Waste generation, treatment, and trade** data are critical for evaluating current management practices and identifying areas for improvement.  

The Global Plastics Data Tracker monitors plastics data reporting across more than 180 countries for the plastics supply-chain. This interactive registry offers streamlined access to government-published data sources and also "data scores" for each source based on reporting frequency and granularity. 

The Tracker aims to visually present each nation's current position on reporting plastics data – whilst also showcasing countries with more developed plastics data to highlight potential data collection and reporting methodologies. 

Developed via a rapid assessment prior to the Intergovernmental Negotiating Committee's fifth session (INC-5), the Tracker establishes a crucial evidence base that illustrates the current global landscape of plastics data availability. This resource was specifically designed to inform treaty negotiators about critical gaps and opportunities for improvement in international plastics monitoring frameworks. 

Due to the rapid nature of this research our analyst team actively welcome user feedback, additional data points and suggestions for enhancement.  This collaborative approach ensures the Tracker remains a dynamic and increasingly valuable resource for policymakers, researchers, and stakeholders worldwide. 

## About the team
The Plastics team seat within the Centre for Sustainable Development Reform (CSDR) within the University of New South Wales and deliver work as part of the Global Ocean Accounts Partnership GOAP. 

### Centre for Sustainable Development Reform 
Established in 2022, CSDR strives to fulfil the public responsibilities and mission of UNSW; to provide education, conduct research and contribute to society. 

Centre activities currently span more than 20 countries and are characterised by working in partnership with decision-makers across government, international institutions, local communities, and the private and non-profit sectors. We build and scale enduring multi-disciplinary partnerships and creating safe spaces for decisionmakers to plan pragmatic actions informed by rigorous science, knowledge and expert insights. 
 
### Global Ocean Accounts Partnership 
The secretariat for the Global Ocean Accounts Partnership sits within CSDR at UNSW. It is a UK Government funded initiative that aims to: 
- Build a global community of practice for ocean accounting 
- Develop standardised guidance for ocean accounting 
- Support at least 30 countries by 2030 to build national ocean accounts 
- Facilitate the global uptake of ocean accounts in decision-making and policy 

The secretariat is supported by fellows positioned globally to develop accounts and contribute towards the community as part of this programme of work plastics  
 
### The Plastics team 
The plastics team have a specific focus on improving national systems to collect more (and better quality) plastics data. To do this the team focuses on developing new digital tools and guidance as well as supporting governments by carrying out direct work in-country.
- Eliza Northrup
- Dr Ben Milligan
- Helena Dickinson
- Bella Charlesworth
- Dr Randika Jayasinghe
- Emily Belonje
- Dr Mitchell Lyons

## Motivation for developing the Global Plastics Data Tracker
The United Nations Environment Assembly Resolution 14 (*UNEA-5.2/Res 14*), adopted in March 2022, calls for a "comprehensive approach that addresses the full life cycle of plastic." However, a persistent lack of data to inform indicators of progress has hindered the global and national decision-making needed to mitigate plastic pollution, encourage sustainable practices, and support circular economy initiatives.  

Significant knowledge gaps exist in understanding how plastic moves through global economies and environments – specifically, countries are not publishing data related to plastics production, consumption, trade and waste generation. These data gaps hinder the ability to establish meaningful national action plans, track progress, identify effective interventions, and allocate resources efficiently.  

As negotiators gather at INC-5 in Busan, South Korea, ensuring strong data provisions becomes crucial. Without fundamental data elements, the treaty risks becoming well- intentioned but ineffective. Only through comprehensive data collection and monitoring can we effectively manage plastic pollution and create a more sustainable future.  

Further explanation on the importance of plastics data can be found in our blog on *The Blind Spot for the Global Plastics Treaty: Why Data Matters*.

## Using the Global Plastics Data Tracker
The Tracker refers only to Government published data and statistics for all aspects of the supply-chain. Each data point has been assigned a “Data score” which indicates how suitable the data is for informing annual flows of plastic in the country. The highest data scores are assigned to the data points that report plastic-specific data and are reported annually. Lower data scores are given to data points that do not publish plastic-specific data, and/or have published data infrequently. The scores are used to communicate where progress can be made in plastics data reporting. A full breakdown of the data score descriptions is listed below.

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

## Key takeaways
Whilst the Global Plastics Data Tracker evidences that significant progress is required to fill data gaps, the tracker also shows that governments with varied infrastructure and resources do actively report plastics data – for example, India and Vietnam report against approx. 65% of the data categories and Samoa and Mauritius report against 60% of the data categories. This indicates that through using data collection strategies, methodologies (proxies and samples) and digital systems, it is possible for countries to report data, providing they receive the appropriate support to do so (e.g., capacity building and knowledge sharing).  

OECD countries (of which there are 38 members) at a minimum annually report the amount of plastics that they produce and the amount that is incinerated, landfilled or sent for recycling. Out of the OECD countries, 22 are EU member states and therefore must report comprehensive data including packaging waste, single-use plastics, recycling rates, and waste treatment methods through standardised EU frameworks. The other 16 OECD countries have no uniform requirements but typically track basic metrics like waste generation and recycling rates through national systems.  

Most non-OECD countries do not seem to have structured plastics data that is routinely reported. The exception is those who are EU member states – of the non-OECD countries analysed, only EU member states have reported data in some form for every category. Analysis of all other non-OECD countries (non-EU member states) shows that many countries have no plastics-related data published on their websites at all, and other countries have irregular data published, or have aggregated data at a material-level e.g., “total waste”, as opposed to “total plastics waste”. This is likely to be because other countries are not bound by commitments or legislation to report on data relevant to the plastics life cycle – and countries are unlikely to do this voluntarily given the infrastructure and human resource required.  

The Tracker shows that OECD countries typically report more plastics data than non-OECD countries - on average OECD countries reported against 80% of the 15 categories, whilst non-OECD countries on average reported against 37% of the categories (with the majority of data reported by non-OECD countries being trade data).  

Confidential Draft (not for circulation) v0.9 25 August 2021  

Data on ‘Plastics Waste Trade’ is the most comprehensively reported (with approx. 80% of countries assessed reporting at least partial data for plastics waste imports/exports. The categories with the least published data were plastics production and consumption, with less than 20% of countries publishing data for these categories.  

No country currently annually publishes plastics data across all metrics in the supply chain, and many do not report against any of the metrics.  

Many countries are in the process of developing their plastics data. These efforts are often driven by the need to better understand plastic flows, comply with international standards, and meet environmental goals. For example, Indonesia is developing a National Plastic Action Partnership and is exploring the development of a digital tracking system for waste data. In Ghana, the Government have also acknowledged the need for more/improved data in their National Solid Waste Management Strategy, which includes plans for baseline data collection, waste characterization studies in major cities, and implementing waste tracking software in municipalities.  

### Divergences in data collection and reporting approaches  
Current data practices showcase regional diversity in terms of data collection methods, definitions, and reporting systems. Countries and individual regions brings unique strengths to plastics data management, demonstrating various innovative approaches to capturing and measuring plastics flows. However, these divergences also make comparisons challenging.  

For example, across South East Asia, different measurement approaches highlight how regions adapt to local contexts. Vietnam for example, demonstrates leadership in inclusive measurement by incorporating informal sector collection in recycling rates, while Thailand has developed robust systems focused on formal recycling facilities only.  

The Philippines exemplifies how regions adapt measurement approaches to local systems, with Metro Manila implementing volume-based measurements while other regions use weight-based systems. Similarly, in Brazil there are examples of divergences at a regional level - São Paulo has developed a detailed EPR reporting system that provides comprehensive data, while other states have implemented approaches adapted to their local contexts and capabilities.  

These diverse approaches create opportunities for developing more harmonised systems. By learning from different measurement methodologies and building on existing data collection strengths, future frameworks can maintain local flexibility while establishing more standardised reporting. The focus should be on creating inclusive systems that capture both formal and informal sectors and working towards more standardised definitions, while establishing complementary central and local reporting mechanisms.  

It is therefore critical that the Global Plastics Pollution Treaty creates pathways to improve data collection over time, recognising countries have different starting points and capacities, and supported by new and additional and accessible support will be critical to the long-term success of the regime.  

 
