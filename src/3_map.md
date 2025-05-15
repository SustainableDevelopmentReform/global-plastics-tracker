# Map view

<link rel="stylesheet" href="npm:maplibre-gl/dist/maplibre-gl.css">

```js
import maplibregl from "npm:maplibre-gl";
//import {view} from "@neocartocnrs/geoverview"
//const view = require("geoverview@1.2.1").then((f) => f.view)
```

```js
// load the geojson
const plasticgeo = FileAttachment("data/plastics_countries.geojson").json()
```

<div id="map" style="width: 100%; height: 800px;"></div>

```js
const map = new maplibregl.Map({
  container: "map",
  zoom: 1,
  center: [11.39, 47.29],
  hash: true,
  style: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
  scrollZoom: true
});

// Define the fields that can be selected (with "Rating" removed)
const fieldCodes = ["DPM", "DPR", "VCC", "RCC", "PMI", "PME", "PRI", "PRE", "TPW", 
                  "WRR", "WTE", "WIW", "WLF", "WIM", "WEX"];
                  
// More informative display names for each field
const fieldNames = ["Domestic primary material", "Domestic Products", "Virgin content consumption", 
                  "Recycled content consumption", "Primary material trade (imports)", 
                  "Primary material trade (exports)", "Products (imports)", "Products (exports)", 
                  "Total generated plastic waste", "Waste recovered for recycling", 
                  "Waste to Energy", "Waste Incinerated (without energy recovery)", 
                  "Waste landfilled", "Waste (import)", "Waste (Export)"];

// Create mapping between codes and display names              
const codeToNameMapping = {};
const nameToCodeMapping = {};
fieldCodes.forEach((code, index) => {
  codeToNameMapping[code] = fieldNames[index];
  nameToCodeMapping[fieldNames[index]] = code;
});
                  
// Set default selected field (first one in the list)
let selectedFieldName = fieldNames[0];
let selectedFieldCode = fieldCodes[0];

// Define color stops for the legend
const colorStops = [
  { value: 0, color: '#D3D3D3' }, // grey
  { value: 1, color: '#FFDAB9' }, // pastle orange
  { value: 2, color: '#FFD8B1' }, // peach
  { value: 3, color: '#FFFFE0' }, // pale yellow
  { value: 4, color: '#98FB98' }, // pale green
  { value: 5, color: '#008000' }  // green
];

// Create a field selector dropdown and add it to the map
function addFieldSelector() {
  // Create a container for the dropdown
  const selectorContainer = document.createElement('div');
  selectorContainer.className = 'field-selector-container';
  selectorContainer.style.position = 'absolute';
  selectorContainer.style.top = '10px';
  selectorContainer.style.left = '10px'; // Moved to top left
  selectorContainer.style.zIndex = '1';
  selectorContainer.style.backgroundColor = 'white';
  selectorContainer.style.padding = '10px';
  selectorContainer.style.borderRadius = '4px';
  selectorContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
  
  // Create a label
  const label = document.createElement('label');
  label.htmlFor = 'field-selector';
  label.textContent = 'Color by: ';
  label.style.marginRight = '5px';
  label.style.display = 'block';
  label.style.marginBottom = '5px';
  
  // Create the dropdown
  const selector = document.createElement('select');
  selector.id = 'field-selector';
  selector.style.padding = '5px';
  selector.style.borderRadius = '3px';
  selector.style.border = '1px solid #ccc';
  selector.style.width = '270px'; // Make dropdown wider to fit longer names
  
  // Add options to the dropdown using the display names
  fieldNames.forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    if (name === selectedFieldName) {
      option.selected = true;
    }
    selector.appendChild(option);
  });
  
  // Add event listener to update the map when selection changes
  selector.addEventListener('change', function(e) {
    selectedFieldName = e.target.value;
    selectedFieldCode = nameToCodeMapping[selectedFieldName]; // Get the corresponding field code
    updateMapColors();
    updateLegendTitle(); // Update the legend title when field changes
  });
  
  // Assemble and add to the DOM
  selectorContainer.appendChild(label);
  selectorContainer.appendChild(selector);
  document.getElementById('map').appendChild(selectorContainer);
}

// Create legend and add it to the map
function addLegend() {
  // Create a container for the legend
  const legendContainer = document.createElement('div');
  legendContainer.className = 'legend-container';
  legendContainer.style.position = 'absolute';
  legendContainer.style.bottom = '25px';
  legendContainer.style.right = '10px';
  legendContainer.style.zIndex = '1';
  legendContainer.style.backgroundColor = 'white';
  legendContainer.style.padding = '10px';
  legendContainer.style.borderRadius = '4px';
  legendContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
  legendContainer.style.maxWidth = '200px';
  
  // Create static legend title
  const legendStaticTitle = document.createElement('div');
  legendStaticTitle.textContent = "Data rating";
  legendStaticTitle.style.fontWeight = 'bold';
  legendStaticTitle.style.marginBottom = '5px';
  legendStaticTitle.style.fontSize = '14px';
  
  // Create dynamic legend title (for the selected field)
  const legendDynamicTitle = document.createElement('div');
  legendDynamicTitle.id = 'legend-title';
  legendDynamicTitle.style.fontWeight = 'bold';
  legendDynamicTitle.style.marginBottom = '10px';
  legendDynamicTitle.style.fontSize = '12px';
  legendDynamicTitle.style.color = '#555';
  legendDynamicTitle.textContent = selectedFieldName;
  
  // Add the titles to the container
  legendContainer.appendChild(legendStaticTitle);
  legendContainer.appendChild(legendDynamicTitle);
  
  // Add color ramp to legend
  const colorRamp = document.createElement('div');
  colorRamp.style.display = 'flex';
  colorRamp.style.flexDirection = 'row';
  colorRamp.style.height = '20px';
  colorRamp.style.width = '100%';
  colorRamp.style.marginBottom = '5px';
  
  // Create color blocks for the ramp
  colorStops.forEach(stop => {
    const colorBlock = document.createElement('div');
    colorBlock.style.flex = '1';
    colorBlock.style.backgroundColor = stop.color;
    colorRamp.appendChild(colorBlock);
  });
  
  legendContainer.appendChild(colorRamp);
  
  // Add value labels
  const labelContainer = document.createElement('div');
  labelContainer.style.display = 'flex';
  labelContainer.style.justifyContent = 'space-between';
  labelContainer.style.fontSize = '10px';
  
  // Add min and max labels
  const minLabel = document.createElement('div');
  minLabel.textContent = '0';
  
  const maxLabel = document.createElement('div');
  maxLabel.textContent = '5';
  
  labelContainer.appendChild(minLabel);
  labelContainer.appendChild(maxLabel);
  
  legendContainer.appendChild(labelContainer);
  
  // Add NA label with light grey color
  const naContainer = document.createElement('div');
  naContainer.style.marginTop = '10px';
  naContainer.style.display = 'flex';
  naContainer.style.alignItems = 'center';
  
  const naColorBox = document.createElement('div');
  naColorBox.style.width = '15px';
  naColorBox.style.height = '15px';
  naColorBox.style.backgroundColor = '#ffffff';
  naColorBox.style.marginRight = '5px';
  naColorBox.style.border = '1px solid #ccc';
  
  const naLabel = document.createElement('div');
  naLabel.textContent = 'No data';
  naLabel.style.fontSize = '10px';
  
  naContainer.appendChild(naColorBox);
  naContainer.appendChild(naLabel);
  
  legendContainer.appendChild(naContainer);
  
  // Add legend to map
  document.getElementById('map').appendChild(legendContainer);
}

// Update the legend title when the selected field changes
function updateLegendTitle() {
  const legendTitle = document.getElementById('legend-title');
  if (legendTitle) {
    legendTitle.textContent = selectedFieldName;
  }
}

// Function to update map colors based on selected field
function updateMapColors() {
  if (!map.getLayer('countries')) return;
  
  map.setPaintProperty('countries', 'fill-color', [
    'case',
    ['==', ['get', selectedFieldCode], null], '#f0f0f0', // Light grey for null values
    ['==', ['typeof', ['get', selectedFieldCode]], 'string'], '#f0f0f0', // Light grey for string/NA values
    // Color interpolation for numeric values - adjusted for 0-5 range
    [
      'interpolate',
      ['linear'],
      ['get', selectedFieldCode],
      0, '#D3D3D3', // light grey
      1, '#FFDAB9', // pastel orange
      2, '#FFD8B1', // peach
      3, '#FFFFE0', // pale yellow
      4, '#98FB98', // pale green
      5, '#008000'  // green
    ]
  ]);
}

map.on("load", function () {
  map.addControl(
    new maplibregl.NavigationControl({
      visualizePitch: true,
      showZoom: true,
      showCompass: true
    })
  );
  
  // Add source as before
  map.addSource("countries", {
    type: "geojson",
    data: plasticgeo
  });
  
  // Add layer with opacity 0.6
  map.addLayer({
    id: "countries",
    type: "fill",
    source: "countries",
    layout: {},
    paint: {
      'fill-opacity': 0.6,
      'fill-color': '#000000' // Placeholder, will be immediately updated
    }
  });
  
  // Add the field selector dropdown and legend
  addFieldSelector();
  addLegend();
  
  // Set initial colors
  updateMapColors();
  
  // Add popup functionality
  const popup = new maplibregl.Popup({
    closeButton: true,
    closeOnClick: true
  });
  
  // When a click event occurs on a feature in the countries layer
  map.on('click', 'countries', function(e) {
    if (e.features.length > 0) {
      const feature = e.features[0];
      const properties = feature.properties;
      
      // Create HTML content for the popup displaying all properties
      let popupContent = '<div style="max-height: 300px; overflow-y: auto;">';
      popupContent += '<h3>Properties</h3>';
      popupContent += '<table style="border-collapse: collapse; width: 100%;">';
      
      // Loop through all properties and add them to the table
      for (const key in properties) {
        if (properties.hasOwnProperty(key)) {
          // Check if this key is one of our field codes, and if so use the full name
          const displayKey = codeToNameMapping[key] || key;
          
          popupContent += `
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 8px; font-weight: bold;">${displayKey}</td>
              <td style="padding: 8px;">${properties[key]}</td>
            </tr>
          `;
        }
      }
      
      popupContent += '</table></div>';
      
      // Set the popup's coordinates to the clicked location
      popup
        .setLngLat(e.lngLat)
        .setHTML(popupContent)
        .addTo(map);
    }
  });
  
  // Change the cursor to a pointer when hovering over the countries layer
  map.on('mouseenter', 'countries', function() {
    map.getCanvas().style.cursor = 'pointer';
  });
  
  // Change it back when it leaves
  map.on('mouseleave', 'countries', function() {
    map.getCanvas().style.cursor = '';
  });
});
```

<div class="small note">The Global Plastics Data tracker provides easy access to the sources of individual data points for each country, across the whole supply-chain.  The Tracker refers only to Government published data and statistics for all aspects of the supply-chain. Each data point has been assigned a “Data score” which indicates how suitable the data is for informing annual flows of plastic in the country. The highest data scores are assigned to the data points that report plastic-specific data and are reported annually. Lower data scores are given to data points that do not publish plastic-specific data, and/or have published data infrequently.<br>The tracker was developed via a rapid assessment in the run up to INC-5 - the analysts therefore welcome users to improve the sources and provide feedback. <br>Each rating has a link to the original source of information. For feedback, updates or help, please email <a href="mailto:helena.dickinson@unsw.edu.au">Helena Dickinson</a> or <a href="mailto:e.northrop@unsw.edu.au">Eliza Northrop</a>.