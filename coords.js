const coordinates = [];

// Generate 5000 random coordinates
for (let i = 0; i < 500; i++) {
  const longitude = Math.random() * 360 - 180;
  const latitude = Math.random() * 180 - 90;
  coordinates.push([longitude, latitude]);
}

// Output the coordinates in the desired format
console.log(JSON.stringify({ coordinates }));