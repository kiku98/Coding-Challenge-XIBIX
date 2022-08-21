function findViewSpots(file, number) {
  // read our data from our file
  const data = require(file);
  const values = data.values;
  const elements = data.elements;

  // sort all values descending regarding their height and append its node
  // and the isViewPort property
  values.sort(function (x, y) {
    if (x.nodes === undefined) x.nodes = elements[x.element_id].nodes;
    if (x.isViewPoint === undefined) x.isViewPoint = null;
    if (y.nodes === undefined) y.nodes = elements[y.element_id].nodes;
    if (y.isViewPoint === undefined) y.isViewPoint = null;
    if (x.value < y.value) {
      return 1;
    }
    if (x.value > y.value) {
      return -1;
    }
    return 0;
  });

  // iterate over all sorted faces
  for (let index = 0; index < values.length; index++) {
    const face = values[index];
    if (face.isViewPoint == null) {
      face.isViewPoint = true;
      // get all 3 related nodes from elements
      const nodesOfFace = face.nodes;
      // find all elements, that contain one of these nodes
      // and set them to in "values" to isViewPort == False
      // console.log(nodesOfFace);
      if (face.element_id === 0) {
        console.log(nodesOfFace);
        console.log("k");
      }
      for (let indexCompare = 0; indexCompare < values.length; indexCompare++) {
        if (indexCompare !== index) {
          const faceCompare = values[indexCompare];
          const compareNodes = faceCompare.nodes;

          if (
            compareNodes.includes(nodesOfFace[0]) ||
            compareNodes.includes(nodesOfFace[1]) ||
            compareNodes.includes(nodesOfFace[2])
          ) {
            if (indexCompare > index) faceCompare.isViewPoint = false;
            // der vergleich ist grösser und kein VP, dann ist der auch keins
            if (indexCompare < index) {
              console.log(faceCompare.isViewPoint);
              face.isViewPoint = false;
            }
          }
        }
      }
    }
  }

  const result = values.filter((value) => value.isViewPoint === true);
  console.log(result);
  console.log(result.length);
}

// process.argv.forEach(function (val, index, array) {
//   console.log(index + ": " + val);
// });

const start = Date.now();

findViewSpots("./data/mesh.json", 5);
// findViewSpots("./data/mesh_x_sin_cos_20000.json");

const end = Date.now();
console.log(`Execution time: ${end - start} ms`);
