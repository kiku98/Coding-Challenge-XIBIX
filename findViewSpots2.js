function findViewSpots2(file) {
  // read our data from our file
  const data = require(file);
  const values = data.values;
  const elements = data.elements;
}

const start = Date.now();

findViewSpots2("./data/mesh_x_sin_cos_10000.json");

const end = Date.now();
console.log(`Execution time: ${end - start} ms`);

const start2 = Date.now();

findViewSpots2("./data/mesh_x_sin_cos_20000.json");

const end2 = Date.now();
console.log(`Execution time: ${end2 - start2} ms`);
