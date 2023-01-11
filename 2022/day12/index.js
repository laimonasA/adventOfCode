import * as fs from "fs";

const STARTING_CHAR = "S";
const DESTINATION_CHAR = "E";

const DIRECTIONS = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

const canMoveToPos = (start, dest, map, distanceData) => {
  // Destination is out of bounds
  if (
    start.includes(-1) ||
    start[0] === map.length ||
    start[1] === map[0].length
  ) {
    return false;
  }

  // If that field already has a value then skip
  if (distanceData[start[0]][start[1]] !== Infinity) {
    return false;
  }

  return map[start[0]][start[1]] + 1 >= map[dest[0]][dest[1]];
};

const run = () => {
  const dataArray = fs.readFileSync("./input.txt", "utf-8").split("\n");
  const data = dataArray.slice(0, dataArray.length - 1);

  const startingPosition = [0, 0];
  const destinationPosition = [0, 0];

  const heightData = [];
  const distanceData = [];

  for (let rowIdx = 0; rowIdx < data.length; rowIdx++) {
    const row = data[rowIdx];

    const nextHeightData = row.split("").map((letter, colIdx) => {
      if (letter === STARTING_CHAR) {
        startingPosition[0] = rowIdx;
        startingPosition[1] = colIdx;
        return 0;
      }

      if (letter === DESTINATION_CHAR) {
        destinationPosition[0] = rowIdx;
        destinationPosition[1] = colIdx;
        return 25;
      }

      return letter.charCodeAt(0) - 97;
    });

    const nextDistanceData = Array(nextHeightData.length).fill(Infinity);

    if (row.includes(DESTINATION_CHAR)) {
      nextDistanceData[row.indexOf(DESTINATION_CHAR)] = 0;
    }

    heightData[heightData.length] = nextHeightData;
    distanceData[distanceData.length] = nextDistanceData;
  }

  let [distanceFromStart, shortestDistance] = [Infinity, Infinity];
  let index = 0;

  while (distanceFromStart === Infinity) {
    const currentDistance =
      distanceData[startingPosition[0]][startingPosition[1]];

    if (currentDistance !== Infinity) {
      distanceFromStart = currentDistance;
      break;
    }

    for (let rowIdx = 0; rowIdx < heightData.length; rowIdx++) {
      for (let colIdx = 0; colIdx < heightData[rowIdx].length; colIdx++) {
        if (distanceData[rowIdx][colIdx] !== index) {
          continue;
        }

        if (data[rowIdx][colIdx] === "a" && shortestDistance === Infinity) {
          shortestDistance = index;
        }

        const position = [rowIdx, colIdx];
        const directionsToTry = [];

        for (let dirIdx = 0; dirIdx < DIRECTIONS.length; dirIdx++) {
          const [d0, d1] = DIRECTIONS[dirIdx];
          const nextPosition = [rowIdx + d0, colIdx + d1];

          if (canMoveToPos(nextPosition, position, heightData, distanceData)) {
            directionsToTry[directionsToTry.length] = nextPosition;
          }
        }

        directionsToTry.forEach((direction) => {
          distanceData[direction[0]][direction[1]] = index + 1;
        });
      }
    }

    index++;
  }

  console.log("Part 1 distance: ", distanceFromStart);
  console.log("Part 2 distance: ", shortestDistance);
};

run();
