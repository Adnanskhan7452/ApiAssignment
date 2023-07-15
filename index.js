const express = require('express');
const turf = require('@turf/turf');
const bodyParser = require('body-parser');

const app = express();
const port = 8000;

// Enable JSON parsing middleware
app.use(bodyParser.json());

// Define the set of 50 lines (start and end points)
const lines = [];

for (let i = 1; i <= 50; i++) {
  const line = {
    type: 'Feature',
    properties: { id: `L${i.toString().padStart(2, '0')}` },
    geometry: {
      type: 'LineString',
      coordinates: [[Math.random(), Math.random()], [Math.random(), Math.random()]]
    }
  };
  lines.push(line);
}

// API endpoint for finding intersections
app.post('/api/intersections', (req, res) => {
  console.log('Incoming request:', req.method, req.url);

  // Check if the request has a valid GeoJSON linestring in the body
  if (!req.body || !req.body.coordinates || !Array.isArray(req.body.coordinates)) {
    return res.status(400).json({ error: 'Invalid linestring in the request body' });
  }

  // Generate the linestring from the coordinates
  const coords = req.body.coordinates.map(point => turf.point([point[1], point[0]]));

  // Convert lines to a valid GeoJSON FeatureCollection
  const featureCollection = turf.featureCollection(lines);

  // Find the intersecting lines
  const intersections = turf.lineIntersect(featureCollection, turf.lineString(coords));

  // Create the response
  const response = intersections.features.map(intersection => ({
    lineId: intersection.properties.id,
    point: intersection.geometry.coordinates,
  }));

  res.status(200).json({ intersections: response });
});

// Middleware for logging incoming requests
app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.url);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
