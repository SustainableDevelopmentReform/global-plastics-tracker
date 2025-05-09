# Table view

```js
// Balancing authority demand
const plastics_ratings = FileAttachment("data/global_plastics_waste_data_ratings_current.csv").csv({typed: true});
```

```js
const plastics_ratings_supply = plastics_ratings.map((d) => ({
  "Country": d["Country"],
  "Region": d["Region"],
  "Type": d["Type"],
  "Domestic primary material": +d["Domestic primary material"],
  "Domestic Products": +d["Domestic Products"],
  "Virgin content consumption": +d["Virgin content consumption"],
  "Recycled content consumption": +d["Recycled content consumption"]
}));

// Create search input (for searchable table)
const tableSearch_supply = Inputs.search(plastics_ratings_supply);
const tableSearchValue_supply = view(tableSearch_supply);
```

```js
// create column toggle list
const colNames_supply = Object.keys(plastics_ratings_supply[0])
const selectedColumnsInput_supply = Inputs.checkbox(colNames_supply, {
  label: "Columns to display",
  value: colNames_supply,
  multiple: true})
const selectedColumns_supply = Generators.input(selectedColumnsInput_supply);
```

<div>
${selectedColumnsInput_supply}
</div>

```js
const finalTable_supply = Inputs.table(tableSearchValue_supply, { 
  rows: 15,
  columns: selectedColumns_supply})
```

<div class="card">
    <h2>Plastics supply and consumption</h2>
    ${finalTable_supply}
</div>


```js
//trade data
const plastics_ratings_trade = plastics_ratings.map((d) => ({
  "Country": d["Country"],
  "Region": d["Region"],
  "Type": d["Type"],
  "Primary material trade (imports)": +d["Primary material trade (imports)"],
  "Primary material trade (exports)": +d["Primary material trade (exports)"],
  "Products (imports)": +d["Products (imports)"],
  "Products (exports)": +d["Products (exports)"]
}));
```
<div class="card">
    <h2>Plastics trade</h2>
    ${Inputs.table(tableSearchValue, {rows: 15})}
</div>



```js
const plastics_ratings_waste = plastics_ratings.map((d) => ({
  "Country": d["Country"],
  "Region": d["Region"],
  "Type": d["Type"],
  "Total generated plastic waste": +d["Total generated plastic waste"],
  "Waste recovered for recycling": +d["Waste recovered for recycling"],
  "Waste to Energy": +d["Waste to Energy"],
  "Waste Incinerated (without energy recovery)": +d["Waste Incinerated (without energy recovery)"],
  "Waste landfilled": +d["Waste landfilled"],
  "Waste (import)": +d["Waste (import)"],
  "Waste (Export)": +d["Waste (Export)"]
}));



<div class="card">
    <h2>Plastics waste and recycling</h2>
    ${Inputs.table(tableSearchValue, {rows: 15})}
</div>








<div class="small note">The Global Plastics Data tracker provides easy access to the sources of individual data points for each country, across the whole supply-chain.  The Tracker refers only to Government published data and statistics for all aspects of the supply-chain. Each data point has been assigned a “Data score” which indicates how suitable the data is for informing annual flows of plastic in the country. The highest data scores are assigned to the data points that report plastic-specific data and are reported annually. Lower data scores are given to data points that do not publish plastic-specific data, and/or have published data infrequently.<br>The tracker was developed via a rapid assessment in the run up to INC-5 - the analysts therefore welcome users to improve the sources and provide feedback. <br>Each rating has a link to the original source of information. For feedback, updates or help, please email <a href="mailto:helena.dickinson@unsw.edu.au">Helena Dickinson</a> or <a href="mailto:e.northrop@unsw.edu.au">Eliza Northrop</a>.