function recursiveF(
  nodeID,
  nodes,
  faces,
  values,
  facesFlagger,
  nodesFlagger,
  max
) {
  // get all surrounding faces, that include that nodeID
  const correspFaces = faces.filter((face) => face.nodes.includes(nodeID));
  let evergottenBigger = false;
  // get max value
  for (let index = 0; index < correspFaces.length; index++) {
    if (values[correspFaces[index].id].value >= max.value) {
      if (max.face_id !== null) facesFlagger[max.face_id] = false;
      max.face_id = correspFaces[index].id;
      max.value = values[correspFaces[index].id].value;
      evergottenBigger = true;
    } else {
      facesFlagger[correspFaces[index].id] = false;
    }
  }

  nodesFlagger[nodeID] = true;
  if (evergottenBigger === true) {
    const all = faces[max.face_id].nodes;
    const a = all.filter((ele) => ele !== nodeID && nodesFlagger[ele] === null);
    const oldMax = max;
    const oldMax2 = max;
    if (a[0] !== undefined)
      recursiveF(
        a[0],
        nodes,
        faces,
        values,
        facesFlagger,
        nodesFlagger,
        oldMax
      );
    if (a[1] !== undefined)
      recursiveF(
        a[1],
        nodes,
        faces,
        values,
        facesFlagger,
        nodesFlagger,
        oldMax2
      );
  } else {
    facesFlagger[max.face_id] = true;
  }
}

function findViewSpots2(file) {
  // read our data from our file
  const data = require(file);
  const nodes = data.nodes;
  const faces = data.elements;
  const values = data.values;
  // wird true, wenn element == ViewPoint
  const facesFlagger = new Array(faces.length).fill(null);
  // wird true, wenn node schon bearbeitet
  const nodesFlagger = new Array(nodes.length).fill(null);

  let max = {
    face_id: null,
    value: -1000000,
  };

  while (nodesFlagger.indexOf(null) !== -1) {
    recursiveF(
      nodesFlagger.indexOf(null),
      nodes,
      faces,
      values,
      facesFlagger,
      nodesFlagger,
      max
    );
    max = {
      face_id: null,
      value: -1000000,
    };
  }

  let zähler = 0;
  for (let index = 0; index < facesFlagger.length; index++) {
    if (facesFlagger[index] === true) {
      console.log(index);
      zähler++;
    }
  }
  console.log(zähler);
}

const start = Date.now();

findViewSpots2("./data/mesh.json");
// findViewSpots2("./data/mesh_x_sin_cos_20000.json");

const end = Date.now();
console.log(`Execution time: ${end - start} ms`);
// const start2 = Date.now();

// findViewSpots2("./data/mesh_x_sin_cos_20000.json");

// const end2 = Date.now();
// console.log(`Execution time: ${end2 - start2} ms`);
