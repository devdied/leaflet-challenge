// Creating the map object
let myMap = L.map("map", {
  center: [36, -119],
  zoom: 5
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create a color scale for earthquake depth
let depthColorScale = d3.scaleSequential(d3.interpolateViridis).domain([0, 700]);

d3.json(url).then(function(response) {
  console.log(response);
  features = response.features;
  console.log(features);

  for (let i = 0; i < features.length; i++) {
    let location = features[i].geometry;
    if (location) {
      console.log(location);
      let lat = location.coordinates[1];
      let lon = location.coordinates[0];
      let magnitude = features[i].properties.mag;
      let depth = location.coordinates[2];

      // Create a color based on depth using the depthColorScale
      let color = "";
      if (depth > 90) {
        color = "red";
      }
      else if (depth > 70) {
        color = "rgba(220, 137, 33)";
      }
      else if (depth > 50) {
        color = "orange";
      }
      else if (depth > 30) {
        color = "rgba(255, 219, 88)";
      }
      else if (depth > 10) {
        color = "rgba(0, 255, 0)";
      }
      else {
        color = "rgba(173, 255, 47)";
      }

      let newMarker = L.circle([lat, lon], {
        fillOpacity: 0.75,
        color: "black",
        weight: 0.5,
        fillColor: color,
        radius: magnitude * 10000, // Adjust the scaling factor as needed
      }).addTo(myMap);
      
      newMarker.bindPopup("Place: "+ features[i].properties.place+"<br>Lat: "+ lat + "<br> Lon: " + lon + "<br> Magnitude: " + magnitude + "<br> Depth: " + depth);

    }
      
  }

  /*Legend specific*/
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "info legend-container");
    div.innerHTML += "<h4>Depth</h4>";
    div.innerHTML += '<div class="legend-entry"><i style="background: rgba(173, 255, 47); width: 10px; height: 10px; display: inline-block; margin-right: 5px;"></i><span>-10-10</span></div>';
    div.innerHTML += '<div class="legend-entry"><i style="background: rgba(0, 255, 0); width: 10px; height: 10px; display: inline-block; margin-right: 5px;"></i><span>10-30</span></div>';
    div.innerHTML += '<div class="legend-entry"><i style="background: rgba(255, 219, 88); width: 10px; height: 10px; display: inline-block; margin-right: 5px;"></i><span>30-50</span></div>';
    div.innerHTML += '<div class="legend-entry"><i style="background: orange; width: 10px; height: 10px; display: inline-block; margin-right: 5px;"></i><span>50-70</span></div>';
    div.innerHTML += '<div class="legend-entry"><i style="background: rgba(220, 137, 33); width: 10px; height: 10px; display: inline-block; margin-right: 5px;"></i><span>70-90</span></div>';
    div.innerHTML += '<div class="legend-entry"><i style="background: red; width: 10px; height: 10px; display: inline-block; margin-right: 5px;"></i><span>90+</span></div>';
  
    return div;
  };
  
  legend.addTo(myMap);  
  
});

