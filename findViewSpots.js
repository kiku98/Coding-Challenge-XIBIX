function findViewSpots(data, noOfViewpoints) {
  const faces = data.values;
  const elements = data.elements;

  let foundViewpoints = 0;

  function checkIfArraysHaveOneSameElement(x, y) {
    return x.includes(y[0]) || x.includes(y[1]) || x.includes(y[2]);
  }
  // sort all faces descending regarding their height and append its nodes
  // and the isViewPort property
  faces.sort(function (x, y) {
    if (x.nodes === undefined) x.nodes = elements[x.element_id].nodes;
    if (y.nodes === undefined) y.nodes = elements[y.element_id].nodes;
    if (x.value < y.value) {
      if (checkIfArraysHaveOneSameElement(x.nodes, y.nodes)) {
        x.isViewPoint = false;
        y.isViewPoint = null;
      }
      return 1;
    }
    if (x.value > y.value) {
      if (checkIfArraysHaveOneSameElement(x.nodes, y.nodes)) {
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
    index < faces.length && foundViewpoints !== noOfViewpoints;
    index++
  ) {
    const face = faces[index];

    if (face.isViewPoint == null) {
      // assume the next highest face is a ViewPoint. It will be changed to isViewPoint=false,
      // if we find in the inner loop a bigger, connecting face, that is already no Viewport
      face.isViewPoint = true;
      foundViewpoints++;

      // loop through all faces to compare them to the actual
      for (let indexCompare = 0; indexCompare < faces.length; indexCompare++) {
        if (indexCompare !== index) {
          const faceToCompare = faces[indexCompare];

          if (
            checkIfArraysHaveOneSameElement(faceToCompare.nodes, face.nodes)
          ) {
            // If the faceToCompare is bigger (:=index is smaller) than our actual face
            // and they have a node in common, the actual face is no ViewPoint
            if (face.isViewPoint && indexCompare < index) {
              face.isViewPoint = false;
              foundViewpoints--;
            }
            // If our faceToCompare is smaller (:=index is higher) than our actual face
            // and they have a node in common, the faceToCompare is no ViewPoint
            if (indexCompare > index) {
              faceToCompare.isViewPoint = false;
            }
          }
        }
      }
    }
  }

  // filter the results to only show faces, that are a ViewPoint and
  // remove the keys "isViewPoint" and "nodes" to match the requirements
  const result = faces.filter((value) => value.isViewPoint === true);
  result.forEach((element) => {
    delete element.isViewPoint;
    delete element.nodes;
  });

  return result;
}

try {
  // read the values from the calling command
  const fileName = process.argv[2];
  const noOfViewpoints = parseInt(process.argv[3]);

  // read our data from our file
  const data = require(fileName);
  // calculate first n ViewPoints
  const result = findViewSpots(data, noOfViewpoints);
  console.log(result);
} catch (error) {}
