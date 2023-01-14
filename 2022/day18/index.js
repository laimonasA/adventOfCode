import * as fs from "fs";

const DIRECTIONS = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

const getNonAdjacentCubes = (cube, allCubes, outsideBoundary) => {
  const [c0, c1, c2] = cube;

  const nonAdjacentCubes = DIRECTIONS.reduce((acc, [d0, d1, d2]) => {
    if (allCubes.has([c0 + d0, c1 + d1, c2 + d2].join(","))) {
      return acc;
    }

    if (outsideBoundary) {
      const adj = [c0 + d0, c1 + d1, c2 + d2];
      const isOutside = outsideBoundary.has(adj.join(",")) || adj.includes(-1);

      return isOutside ? [...acc, { cube, direction: [d0, d1, d2] }] : acc;
    }

    return [...acc, { cube, direction: [d0, d1, d2] }];
  }, []);

  return nonAdjacentCubes;
};

const getBoundarySpace = (max, allCubes) => {
  // Create a blank map slightly larger than the cubes
  const map = new Array(max[0] + 1);
  for (let x = 0; x < map.length; x++) {
    map[x] = new Array(max[1] + 1);

    for (let y = 0; y < map[x].length; y++) {
      map[x][y] = new Array(max[2] + 1).fill(0);
    }
  }

  const cubesList = [...allCubes];

  // Fill map with the cubes
  for (let cubeIdx = 0; cubeIdx < cubesList.length; cubeIdx++) {
    const [c0, c1, c2] = cubesList[cubeIdx].split(",").map((c) => Number(c));

    map[c0][c1][c2] = 1;
  }

  const outsideCubes = new Set();

  // Assuming there is no cube here
  const outsideBoundary = new Set(["0,0,0"]);

  let toCheck = [[0, 0, 0]];

  while (toCheck.length !== 0) {
    const [[c0, c1, c2], ...restToCheck] = toCheck;
    toCheck = restToCheck;

    for (
      let directionIdx = 0;
      directionIdx < DIRECTIONS.length;
      directionIdx++
    ) {
      const [d0, d1, d2] = DIRECTIONS[directionIdx];
      const adjacentCube = [c0 + d0, c1 + d1, c2 + d2];

      const isXInsideMap = adjacentCube[0] >= 0 && adjacentCube[0] <= max[0];
      const isYInsideMap = adjacentCube[1] >= 0 && adjacentCube[1] <= max[1];
      const isZInsideMap = adjacentCube[2] >= 0 && adjacentCube[2] <= max[2];

      if (
        outsideCubes.has(adjacentCube.join(",")) ||
        outsideBoundary.has(adjacentCube.join(","))
      ) {
        continue;
      }

      if (allCubes.has(adjacentCube.join(","))) {
        outsideCubes.add(adjacentCube.join(","));
      } else if (isXInsideMap && isYInsideMap && isZInsideMap) {
        outsideBoundary.add(adjacentCube.join(","));

        toCheck[toCheck.length] = adjacentCube;
      }
    }
  }

  return outsideBoundary;
};

const run = () => {
  const dataArray = fs.readFileSync("./input.txt", "utf-8").split("\n");
  const data = dataArray.slice(0, dataArray.length - 1);

  const allCubes = new Set(data);

  let total1 = 0;

  // For Part 2
  const maxPoints = [-Infinity, -Infinity, -Infinity];

  for (let cubeIdx = 0; cubeIdx < data.length; cubeIdx++) {
    const [c0, c1, c2] = data[cubeIdx].split(",").map((c) => Number(c));

    const cubeNonAdjacentFaces = getNonAdjacentCubes([c0, c1, c2], allCubes);

    total1 += cubeNonAdjacentFaces.length;

    maxPoints[0] = Math.max(maxPoints[0], c0 + 1);
    maxPoints[1] = Math.max(maxPoints[1], c1 + 1);
    maxPoints[2] = Math.max(maxPoints[2], c2 + 1);
  }

  let total2 = 0;

  const outsideBoundary = getBoundarySpace(maxPoints, allCubes);

  for (let cubeIdx = 0; cubeIdx < data.length; cubeIdx++) {
    const [c0, c1, c2] = data[cubeIdx].split(",").map((c) => Number(c));

    const cubeNonAdjacentFaces = getNonAdjacentCubes(
      [c0, c1, c2],
      allCubes,
      outsideBoundary
    );

    total2 += cubeNonAdjacentFaces.length;
  }

  console.log("Part 1 total:", total1);
  console.log("Part 2 total:", total2);
};

run();
