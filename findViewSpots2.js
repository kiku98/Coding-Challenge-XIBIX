function recursiveF(
  nodeID,
  nodes,
  elements,
  values,
  elementsFlagger,
  nodesFlagger,
  max
) {
  // get all surrounding elements, that include that vertexID
  const correspElements = elements.filter((element) =>
    element.nodes.includes(nodeID)
  );
  console.log(max);
  let evergottenBigger = false;
  // get max value
  for (let index = 0; index < correspElements.length; index++) {
    if (values[correspElements[index].id].value >= max.value) {
      elementsFlagger[max.face_id] = false;
      max.face_id = correspElements[index].id;
      max.value = values[correspElements[index].id].value;
      evergottenBigger = true;
    } else {
      elementsFlagger[correspElements[index].id] = false;
    }
  }
  nodesFlagger[nodeID] = true;
  if (evergottenBigger === true) {
    const all = elements[max.face_id].nodes;
    const a = all.filter((ele) => ele !== nodeID && !nodesFlagger[ele]);
    recursiveF(
      a[0],
      nodes,
      elements,
      values,
      elementsFlagger,
      nodesFlagger,
      max
    );
    recursiveF(
      a[1],
      nodes,
      elements,
      values,
      elementsFlagger,
      nodesFlagger,
      max
    );
  } else {
    elementsFlagger[max.face_id] = true;
    max = {
      face_id: null,
      value: -1000000,
    };
  }
}

function findViewSpots2(file) {
  // read our data from our file
  const data = require(file);
  const nodes = data.nodes;
  const elements = data.elements;
  const values = data.values;
  // wird true, wenn element == ViewPoint
  const elementsFlagger = new Array(elements.length).fill(null);
  // wird true, wenn node schon bearbeitet
  const nodesFlagger = new Array(nodes.length).fill(null);
  const startNodeID = 120;

  let max = {
    face_id: null,
    value: -1000000,
  };

  recursiveF(
    startNodeID,
    nodes,
    elements,
    values,
    elementsFlagger,
    nodesFlagger,
    max
  );

  console.log(elementsFlagger);
  console.log("nodes");
  console.log(nodesFlagger);
  console.log(max.face_id);
}

const start = Date.now();

findViewSpots2("./data/mesh.json");
// findViewSpots2("./data/mesh_x_sin_cos_10000.json");

const end = Date.now();
console.log(`Execution time: ${end - start} ms`);

// const start2 = Date.now();

// findViewSpots2("./data/mesh_x_sin_cos_20000.json");

// const end2 = Date.now();
// console.log(`Execution time: ${end2 - start2} ms`);
