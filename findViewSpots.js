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

  let foundViewPointCounter = 0;
  // iterate over all sorted faces
  values.every(function (face) {
    // if the actual faces IsViewPort-Property is null
    // --> set it to be a Viewpoint (as it is the "next" heighest face)
    // but only if it has no surrounding elements that are higher itself but are no
    // viewport
    if (face.isViewPoint === null) {
      face.isViewPoint = true;
      foundViewPointCounter++;
      // get all 3 related nodes from elements
      const nodesOfFace = face.nodes;
      // find all elements, that contain one of these nodes
      // and set them to in "values" to isViewPort == False
      values.forEach((faceH) => {
        if (
          face.isViewPoint === true &&
          (faceH.nodes.includes(nodesOfFace[0]) ||
            faceH.nodes.includes(nodesOfFace[1]) ||
            faceH.nodes.includes(nodesOfFace[2]))
        ) {
          if (faceH.isViewPoint === false && faceH.value > face.value) {
            face.isViewPoint = false;
            foundViewPointCounter--;
            return;
          }
          if (faceH.isViewPoint === null) faceH.isViewPoint = false;
        }
      });
    }
    if (foundViewPointCounter === number) return false;
    else return true;
  });
  const result = values.filter((value) => value.isViewPoint === true);
  result.forEach((element) => {
    delete element.isViewPoint;
    delete element.nodes;
  });
  console.log(result);
  console.log(result.length);
}

process.argv.forEach(function (val, index, array) {
  console.log(index + ": " + val);
});

const start = Date.now();

// findViewSpots("./data/mesh.json", 5);
findViewSpots("./data/mesh_x_sin_cos_20000.json");

const end = Date.now();
console.log(`Execution time: ${end - start} ms`);
