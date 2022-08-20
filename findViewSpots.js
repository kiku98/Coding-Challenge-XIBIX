function findViewSpots(file) {
  // read our data from our file
  const data = require(file);

  // sort all values descending regarding their height
  data.values.sort(function (x, y) {
    if (x.value < y.value) {
      return 1;
    }
    if (x.value > y.value) {
      return -1;
    }
    return 0;
  });

  // go through all sorted values
  data.values.forEach((face) => {
    // if the actual faces IsViewPort-Property is undefinied
    // --> set it to be a Viewpoint (as it is the "next" heighest face)
    if (face.isViewPoint === undefined) {
      face.isViewPoint = true;
      // get all 3 related nodes from elements
      const nodes = data.elements[face.element_id].nodes;

      // find all elements, that contain one of these nodes
      // and set them to in "values" to isViewPort == False
      data.elements.forEach((faceH, indexH) => {
        if (
          faceH.nodes.includes(nodes[0]) ||
          faceH.nodes.includes(nodes[1]) ||
          faceH.nodes.includes(nodes[2])
        ) {
          const found = data.values.find(
            (value) => value.element_id === indexH
          );
          if (found.isViewPoint === undefined) found.isViewPoint = false;
        }
      });
    }
  });
  const result = data.values.filter((value) => value.isViewPoint === true);
  result.forEach((element) => delete element.isViewPoint);
}

const start = Date.now();

findViewSpots("./data/mesh_x_sin_cos_10000.json");

const end = Date.now();
console.log(`Execution time: ${end - start} ms`);

const start2 = Date.now();

findViewSpots("./data/mesh_x_sin_cos_20000.json");

const end2 = Date.now();
console.log(`Execution time: ${end2 - start2} ms`);
