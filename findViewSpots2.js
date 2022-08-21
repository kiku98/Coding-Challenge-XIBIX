function findViewSpots(file, noOfViewpoints) {
  // read our data from our file
  const data = require(file);
  const elements = data.elements;
  let values = data.values;

  let foundViewpoints = 0;

  // sort all values descending regarding their height and append its node
  // and the isViewPort property
  values.sort(function (x, y) {
    x.nodes = elements[x.element_id].nodes;
    x.isViewPoint = null;
    y.nodes = elements[y.element_id].nodes;
    y.isViewPoint = null;
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

    if (face.isViewPoint === null) {
      // The next highetst nulled face is a ViewPoint.
      face.isViewPoint = true;
      foundViewpoints++;
      values = removeFromIndex(index, values);
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

function removeFromIndex(index, values) {
  const faceToDeleteFrom = values[index];
  const nodesToDeleteFrom = faceToDeleteFrom.nodes;

  // delete yourself, if you are not a ViewPoint
  if (faceToDeleteFrom.isViewPoint === null) {
    faceToDeleteFrom.isViewPoint = false;
  }

  for (let i = index + 1; i <= values.length; i++) {
    if (i === values.length) {
      break;
    }
    if (values[i].isViewPoint === null) {
      if (
        values[i].nodes.includes(nodesToDeleteFrom[0]) ||
        values[i].nodes.includes(nodesToDeleteFrom[1]) ||
        values[i].nodes.includes(nodesToDeleteFrom[2])
      ) {
        values = removeFromIndex(i, values);
      }
    }
  }
  return values;
}

// process.argv.forEach(function (val, index, array) {
//   console.log(index + ": " + val);
// });

const start = Date.now();

// const result = findViewSpots("./data/mesh.json", 400);
const result = findViewSpots("./data/mesh_x_sin_cos_20000.json", 10);
console.log(result);

const end = Date.now();
console.log(`Execution time: ${end - start} ms`);
