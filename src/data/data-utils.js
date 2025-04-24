// data/utils.js
import Papa from 'papaparse';

// Load and process the ratings and links data
export async function loadData() {
  // Fetch the CSV files using Observable Framework's FileAttachment
  const ratingsResponse = await fetch('./data/global_plastics_waste_data_ratings_current.csv');
  const linksResponse = await fetch('./data/global_plastics_waste_data_links_current.csv');
  
  const ratingsCSV = await ratingsResponse.text();
  const linksCSV = await linksResponse.text();

  // Parse CSV data
  const ratingsParsed = Papa.parse(ratingsCSV, { header: true }).data;
  const linksParsed = Papa.parse(linksCSV, { header: true }).data;

  // Combine data for easier access
  const combinedData = ratingsParsed.map((ratingRow, index) => {
    const linkRow = linksParsed[index] || {};
    
    // Create a combined object with ratings and links
    const combined = { ...ratingRow };
    
    // Add links for each data category
    const categories = [
      "Domestic primary material",
      "Domestic Products",
      "Virgin content consumption",
      "Recycled content consumption",
      "Primary material trade (imports)",
      "Primary material trade (exports)",
      "Products (imports)",
      "Products (exports)",
      "Total generated plastic waste",
      "Waste recovered for recycling",
      "Waste to Energy",
      "Waste Incinerated (without energy recovery)",
      "Waste landfilled",
      "Waste (import)",
      "Waste (Export)"
    ];
    
    // Create link properties
    categories.forEach(category => {
      combined[`${category}_link`] = linkRow[category] || "";
    });
    
    return combined;
  });

  return {
    ratings: ratingsParsed,
    links: linksParsed,
    combined: combinedData
  };
}

// Get unique regions for filtering
export function getUniqueRegions(data) {
  return [...new Set(data.map(item => item.Region))].filter(Boolean).sort();
}

// Get unique organization types for filtering
export function getUniqueTypes(data) {
  return [...new Set(data.map(item => item.Type))].filter(Boolean).sort();
}

// Filter data based on selection criteria
export function filterData(data, filters = {}) {
  return data.filter(item => {
    // Apply region filter if specified
    if (filters.region && filters.region !== "All" && item.Region !== filters.region) {
      return false;
    }
    
    // Apply type filter if specified
    if (filters.type && filters.type !== "All" && item.Type !== filters.type) {
      return false;
    }
    
    // Apply country filter if specified
    if (filters.country && !item.Country.toLowerCase().includes(filters.country.toLowerCase())) {
      return false;
    }
    
    // Apply rating filter if specified
    if (filters.minRating) {
      // Check if any of the rating columns meet the minimum rating
      const ratingColumns = Object.keys(item).filter(key => 
        !key.includes("_link") && 
        !["Country", "Region", "Type"].includes(key)
      );
      
      const meetsRatingCriteria = ratingColumns.some(column => 
        parseInt(item[column]) >= parseInt(filters.minRating)
      );
      
      if (!meetsRatingCriteria) return false;
    }
    
    return true;
  });
}

// Get rating color based on the rating value
export function getRatingColor(rating) {
  const colorMapping = {
    0: "#BFBFBF",  // Grey color for rating 0
    1: "#ED7D31",  // Orange
    2: "#FFD87C",  // pale orange
    3: "#FFFF00",  // yellow
    4: "#D3FF5D",  // Light Green
    5: "#88D358"   // Dark Green
  };
  
  return colorMapping[rating] || "#ffffff";
}

// Convert rating to dots for visualization
export function ratingToDots(rating) {
  return "●".repeat(rating);
}