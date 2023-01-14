import * as fs from "fs";

const MAP_WIDTH = 7;
const ROCK_START_Y = 3;
const ROCKS_TO_DROP = [2022, 1000000000000];

const ROCK_1 = [[0, 0, 2, 2, 2, 2]];

const ROCK_2 = [
  [0, 0, 0, 2],
  [0, 0, 2, 2, 2],
  [0, 0, 0, 2],
];

const ROCK_3 = [
  [0, 0, 2, 2, 2],
  [0, 0, 0, 0, 2],
  [0, 0, 0, 0, 2],
];

const ROCK_4 = [
  [0, 0, 2],
  [0, 0, 2],
  [0, 0, 2],
  [0, 0, 2],
];

const ROCK_5 = [
  [0, 0, 2, 2],
  [0, 0, 2, 2],
];

const ROCK_ORDER = [ROCK_1, ROCK_2, ROCK_3, ROCK_4, ROCK_5];

const patterns = new Set();
const patternData = {};

const addRockToMap = (rock, map) => {
  let rowsToAdd = ROCK_START_Y;
  let numberOfEmptyRows = 0;

  if (map.length) {
    for (let rowIdx = map.length - 1; rowIdx > 0; rowIdx--) {
      if (map[rowIdx].includes(1)) {
        rowIdx = 0;
      } else {
        rowsToAdd--;
        numberOfEmptyRows++;
      }
    }
  }

  const mapLength = map.length;
  for (let rowIdx = mapLength; rowIdx < mapLength + rowsToAdd; rowIdx++) {
    map[rowIdx] = new Array(MAP_WIDTH).fill(0);
  }

  const newMapLength = map.length;
  const offset =
    numberOfEmptyRows > ROCK_START_Y ? numberOfEmptyRows - ROCK_START_Y : 0;

  for (
    let rowIdx = newMapLength - offset;
    rowIdx < newMapLength + rock.length - offset;
    rowIdx++
  ) {
    map[rowIdx] = [];

    for (let colIdx = 0; colIdx < MAP_WIDTH; colIdx++) {
      map[rowIdx][colIdx] = rock[rowIdx - newMapLength + offset][colIdx] || 0;
    }
  }
};

const rockIsDropping = (direction, map) => {
  // Find the lowest point of the rock

  let minPoint = map.length - 1;
  let hasSeenRock = false;

  for (let idx = map.length - 1; idx >= 0; idx--) {
    if (map[idx].includes(2)) {
      hasSeenRock = true;
      minPoint = idx;
    } else if (hasSeenRock) {
      idx = -1;
    }
  }

  // Try moving in y-direction

  const dir = direction === ">" ? 1 : -1;

  let canMoveInDirection = true;

  for (let rowIdx = minPoint; rowIdx < map.length; rowIdx++) {
    for (let colIdx = 0; colIdx < map[rowIdx].length; colIdx++) {
      if (map[rowIdx][colIdx] === 2) {
        const newCol = colIdx + dir;

        if (
          [-1, map[rowIdx].length].includes(newCol) ||
          map[rowIdx][newCol] === 1
        ) {
          canMoveInDirection = false;
          colIdx = map[rowIdx].length;
        }
      }
    }

    if (!canMoveInDirection) {
      rowIdx = map.length;
    }
  }

  if (canMoveInDirection) {
    if (dir === 1) {
      for (let rowIdx = minPoint; rowIdx < map.length; rowIdx++) {
        const rowLength = map[rowIdx].length;
        for (let colIdx = rowLength - 1; colIdx >= 0; colIdx--) {
          if (map[rowIdx][colIdx] === 2) {
            map[rowIdx][colIdx] = 0;
            map[rowIdx][colIdx + dir] = 2;
          }
        }
      }
    } else {
      for (let rowIdx = minPoint; rowIdx < map.length; rowIdx++) {
        const rowLength = map[rowIdx].length;
        for (let colIdx = 0; colIdx < rowLength; colIdx++) {
          if (map[rowIdx][colIdx] === 2) {
            map[rowIdx][colIdx] = 0;
            map[rowIdx][colIdx + dir] = 2;
          }
        }
      }
    }
  }

  // Try dropping the rock down

  let rockCanDrop = true;

  for (let rowIdx = minPoint; rowIdx < map.length; rowIdx++) {
    for (let colIdx = 0; colIdx < map[rowIdx].length; colIdx++) {
      if (map[rowIdx][colIdx] === 2) {
        if (rowIdx === 0 || map[rowIdx - 1][colIdx] === 1) {
          rockCanDrop = false;
        }
      }
    }
  }

  for (let rowIdx = minPoint; rowIdx < map.length; rowIdx++) {
    for (let colIdx = 0; colIdx < map[rowIdx].length; colIdx++) {
      if (map[rowIdx][colIdx] === 2) {
        if (rowIdx !== 0) {
          map[rowIdx - 1][colIdx] = rockCanDrop ? 2 : map[rowIdx - 1][colIdx];
        }
        map[rowIdx][colIdx] = rockCanDrop ? 0 : 1;
      }
    }
  }

  return rockCanDrop;
};

const getMapHeight = ({ map, offset = 0 }) => {
  if (map.length === 0) {
    return 0;
  }

  let total = map.length;
  for (let idx = map.length - 10; idx < map.length; idx++) {
    total -= map[idx].includes(1) ? 0 : 1;
  }

  return total + offset;
};

const checkForPattern = ({ rockIdx, map, step }) => {
  if (map.length <= 50) {
    return null;
  }

  const topPartOfMap = map.slice(map.length - 40);
  const patternKey = JSON.stringify(`${step}-${topPartOfMap}`);

  if (!patterns.has(patternKey)) {
    patterns.add(patternKey);

    patternData[patternKey] = {
      rockIdx,
      mapHeight: getMapHeight({ map }),
    };

    return null;
  }

  return patternData[patternKey];
};

const dropRocks = (data, rocksToDrop, checkPatterns = false) => {
  const map = [];
  let [step, offset] = [0, 0];

  for (let rockIdx = 0; rockIdx < rocksToDrop; rockIdx++) {
    const rock = ROCK_ORDER[rockIdx % ROCK_ORDER.length];

    const pattern =
      checkPatterns &&
      offset === 0 &&
      checkForPattern({ rockIdx, map, step: step % data.length });

    if (pattern) {
      const rockDiff = rockIdx - pattern.rockIdx;
      const patternsToAdd = Math.floor((rocksToDrop - rockIdx) / rockDiff);

      rockIdx += patternsToAdd * rockDiff;
      offset = patternsToAdd * (getMapHeight({ map }) - pattern.mapHeight);
    }

    addRockToMap(rock, map);

    let rockCanDrop = true;
    while (rockCanDrop) {
      rockCanDrop = rockIsDropping(data[step % data.length], map);
      step++;
    }
  }

  return { map, offset };
};

const run = () => {
  const dataArray = fs.readFileSync("./input.txt", "utf-8").split("\n");
  const data = dataArray.slice(0, dataArray.length - 1)[0].split("");

  const total1 = getMapHeight(dropRocks(data, ROCKS_TO_DROP[0]));
  console.log("Part 1 total: ", total1);

  const total2 = getMapHeight(dropRocks(data, ROCKS_TO_DROP[1], true));
  console.log("Part 2 total: ", total2);
};

run();
