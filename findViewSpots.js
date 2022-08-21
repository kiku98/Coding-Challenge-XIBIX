function findViewSpots(file, noOfViewpoints) {
  // read our data from our file
  const data = require(file);
  const values = data.values;
  const elements = data.elements;

  let foundViewpoints = 0;

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
  for (
    let index = 0;
    index < values.length && foundViewpoints !== noOfViewpoints;
    index++
  ) {
    const face = values[index];

    if (face.isViewPoint == null) {
      // assume the next highets face is a ViewPoint. It will be changed to no Viewport,
      // if we find in the inner loop a bigger, connecting face, that is already no Viewport
      face.isViewPoint = true;
      foundViewpoints++;
      const nodesOfFace = face.nodes;

      // loop through all faces to compare them to the actual
      for (let indexCompare = 0; indexCompare < values.length; indexCompare++) {
        if (indexCompare !== index) {
          const faceCompare = values[indexCompare];
          const compareNodes = faceCompare.nodes;

          if (
            compareNodes.includes(nodesOfFace[0]) ||
            compareNodes.includes(nodesOfFace[1]) ||
            compareNodes.includes(nodesOfFace[2])
          ) {
            // If our compared face is bigger (:=index is smaller) than our actual face
            // and they have a node in common, the actual face is no VP
            if (face.isViewPoint && indexCompare < index) {
              face.isViewPoint = false;
              foundViewpoints--;
            }
            // If our compared face is smaller (:=index is higher) than our actual face
            // and they have a node in common, the compared face is no VP
            if (indexCompare > index) {
              faceCompare.isViewPoint = false;
            }
          }
        }
      }
    }
  }

  // filter the results to only show faces, that are a ViewPoint and remove the keys "isViewPoint"
  // and "nodes"
  const result = values.filter((value) => value.isViewPoint === true);
  result.forEach((element) => {
    delete element.isViewPoint;
    delete element.nodes;
  });

  return result;
}

// process.argv.forEach(function (val, index, array) {
//   console.log(index + ": " + val);
// });

const start = Date.now();

// const result = findViewSpots("./data/mesh.json", 10);
const result = findViewSpots("./data/mesh_x_sin_cos_20000.json", 15);
console.log(result);

const end = Date.now();
console.log(`Execution time: ${end - start} ms`);
