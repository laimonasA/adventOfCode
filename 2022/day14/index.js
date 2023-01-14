import * as fs from "fs";

const SAND_STARTING_POINT = [0, 500];
const DIRECTIONS = [0, -1, 1];

// 0 => empty
// 1 => rock
// 2 => sand

const getMapSize = (data) => {
  let [maxRow, maxCol] = [0, 0];

  for (let idx = 0; idx < data.length; idx++) {
    const line = data[idx];

    for (let itemIdx = 0; itemIdx < line.length; itemIdx++) {
      const item = line[itemIdx];
      maxCol = Math.max(maxCol, item[0]);
      maxRow = Math.max(maxRow, item[1]);
    }
  }

  return [maxRow, maxCol];
};

const compare = (point1, point2) => {
  if (point1 === point2) {
    return 0;
  }

  return point1 < point2 ? 1 : -1;
};

const initMap = (data) => {
  const [maxRow, maxCol] = getMapSize(data);

  // Create a blank map
  const map = new Array(maxRow + 3);
  for (let i = 0; i < map.length; i++) {
    map[i] = new Array(SAND_STARTING_POINT[1] + parseInt(maxCol / 2, 10)).fill(
      0
    );
  }

  // Update the map with rock positions
  for (let lineIdx = 0; lineIdx < data.length; lineIdx++) {
    const line = data[lineIdx];
    for (let pointIdx = 0; pointIdx < line.length - 1; pointIdx++) {
      const curPoint = line[pointIdx];
      const nextPoint = line[pointIdx + 1];

      const direction = [
        compare(curPoint[0], nextPoint[0]),
        compare(curPoint[1], nextPoint[1]),
      ];

      map[curPoint[1]][curPoint[0]] = 1;

      while (curPoint[0] !== nextPoint[0] || curPoint[1] !== nextPoint[1]) {
        curPoint[0] = curPoint[0] + direction[0];
        curPoint[1] = curPoint[1] + direction[1];

        map[curPoint[1]][curPoint[0]] = 1;
      }
    }
  }

  return map;
};

const addSandToMap = (map, coords) => {
  // If the sand is in the abyss, stop
  if (coords[0] === map.length - 1) {
    return true;
  }

  for (let idx = 0; idx < DIRECTIONS.length; idx++) {
    const dir = DIRECTIONS[idx];

    if (map[coords[0] + 1][coords[1] + dir] === 0) {
      return addSandToMap(map, [coords[0] + 1, coords[1] + dir]);
    }
  }

  map[coords[0]][coords[1]] = 2;

  return (
    coords[0] === SAND_STARTING_POINT[0] && coords[1] === SAND_STARTING_POINT[1]
  );
};

const fillWithSandUntilFull = (map) => {
  let isFull = false;

  while (!isFull) {
    isFull = addSandToMap(map, SAND_STARTING_POINT);
  }

  let totalSand = 0;
  for (let rowIdx = 0; rowIdx < map.length; rowIdx++) {
    totalSand = map[rowIdx].reduce(
      (acc, cur) => (cur === 2 ? acc + 1 : acc),
      totalSand
    );
  }

  return totalSand;
};

const run = () => {
  const dataRaw = fs.readFileSync("./input.txt", "utf-8").split("\n");
  const dataArray = dataRaw.slice(0, dataRaw.length - 1);

  const data = dataArray.map((item) =>
    item
      .split(" -> ")
      .map((coord) => coord.split(",").map((coord) => Number(coord)))
  );

  const map = initMap(data);

  console.log("Part 1 total:", fillWithSandUntilFull(map));

  // Add a floor for Part 2
  map[map.length - 1] = map[map.length - 1].map(() => 1);

  console.log("Part 2 total:", fillWithSandUntilFull(map));
};

run();
