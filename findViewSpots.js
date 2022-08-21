function checkIfOneSameEdge(x, y) {
  return x.includes(y[0]) || x.includes(y[1]) || x.includes(y[2]);
}

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
    if (y.nodes === undefined) y.nodes = elements[y.element_id].nodes;
    if (x.value < y.value) {
      if (checkIfOneSameEdge(x.nodes, y.nodes)) {
        x.isViewPoint = false;
        y.isViewPoint = null;
      }
      return 1;
    }
    if (x.value > y.value) {
      if (checkIfOneSameEdge(x.nodes, y.nodes)) {
        x.isViewPoint = null;
        y.isViewPoint = false;
      }
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

      // loop through all faces to compare them to the actual
      for (let indexCompare = 0; indexCompare < values.length; indexCompare++) {
        if (indexCompare !== index) {
          const faceToCompare = values[indexCompare];

          if (checkIfOneSameEdge(faceToCompare.nodes, face.nodes)) {
            // If our compared face is bigger (:=index is smaller) than our actual face
            // and they have a node in common, the actual face is no VP
            if (face.isViewPoint && indexCompare < index) {
              face.isViewPoint = false;
              foundViewpoints--;
            }
            // If our compared face is smaller (:=index is higher) than our actual face
            // and they have a node in common, the compared face is no VP
            if (indexCompare > index) {
              faceToCompare.isViewPoint = false;
            }
          }
        }
      }
    }
  }

  // filter the results to only show faces, that are a ViewPoint and
  // remove the keys "isViewPoint" and "nodes"
  const result = values.filter((value) => value.isViewPoint === true);
  result.forEach((element) => {
    delete element.isViewPoint;
    delete element.nodes;
  });

  return result;
}

const file = process.argv[2];
const noOfViewpoints = process.argv[3];

const start = Date.now();

const result = findViewSpots(file, parseInt(noOfViewpoints));
console.log(result);
const end = Date.now();
console.log(`Execution time: ${end - start} ms`);
