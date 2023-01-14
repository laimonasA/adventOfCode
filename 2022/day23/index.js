import * as fs from "fs";

const DIRECTION_ORDER = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

const ROUNDS = [10, Infinity];

const updateMap = (map) => {
  let updatedMap = [];

  for (let row = 0; row < map.length; row++) {
    updatedMap[row] = [...map[row]];
  }

  const [row0, row1, ...mapRest] = updatedMap;

  const rowN = updatedMap[updatedMap.length - 1];
  const rowNMinus1 = updatedMap[updatedMap.length - 2];

  // Check top
  if (row0.includes(1)) {
    // Add another row of blanks
    updatedMap = [new Array(row0.length).fill(0), ...updatedMap];
  } else if (!row1.includes(1)) {
    // Remove row above
    updatedMap = [row1, ...mapRest];
  }

  // Check bottom
  if (rowN.includes(1)) {
    // Add another row of blanks
    updatedMap[updatedMap.length] = new Array(rowN.length).fill(0);
  } else if (!rowNMinus1.includes(1)) {
    // Remove row below
    updatedMap = updatedMap.slice(0, updatedMap.length - 1);
  }

  const [l0, l1, r0, r1] = [[], [], [], []];

  for (let row = 0; row < updatedMap.length; row++) {
    l0[l0.length] = updatedMap[row][0];
    l1[l1.length] = updatedMap[row][1];

    r0[r0.length] = updatedMap[row][updatedMap[row].length - 1];
    r1[r1.length] = updatedMap[row][updatedMap[row].length - 2];
  }

  // Check left
  if (l0.includes(1)) {
    for (let rowIdx = 0; rowIdx < updatedMap.length; rowIdx++) {
      const row = updatedMap[rowIdx];
      updatedMap[rowIdx] = [0, ...row];
    }
  } else if (!l1.includes(1)) {
    for (let rowIdx = 0; rowIdx < updatedMap.length; rowIdx++) {
      const [_, ...row] = updatedMap[rowIdx];
      updatedMap[rowIdx] = row;
    }
  }

  // Check right
  if (r0.includes(1)) {
    for (let rowIdx = 0; rowIdx < updatedMap.length; rowIdx++) {
      const row = updatedMap[rowIdx];
      updatedMap[rowIdx] = [...row, 0];
    }
  } else if (!r1.includes(1)) {
    for (let rowIdx = 0; rowIdx < updatedMap.length; rowIdx++) {
      updatedMap[rowIdx] = updatedMap[rowIdx].slice(
        0,
        updatedMap[rowIdx].length - 1
      );
    }
  }

  return updatedMap;
};

const shouldStayPut = ([x, y], map) =>
  ![
    map[x][y + 1],
    map[x + 1][y + 1],
    map[x + 1][y],
    map[x + 1][y - 1],
    map[x][y - 1],
    map[x - 1][y - 1],
    map[x - 1][y],
    map[x - 1][y + 1],
  ].includes(1);

const shouldMoveToDirection = ([x, y], [dirX, dirY], map) => {
  if (dirX === 0) {
    return ![
      map[x - 1][y + dirY],
      map[x][y + dirY],
      map[x + 1][y + dirY],
    ].includes(1);
  }

  return ![
    map[x + dirX][y - 1],
    map[x + dirX][y],
    map[x + dirX][y + 1],
  ].includes(1);
};

const runGame = (data, rounds) => {
  let map = updateMap(data);

  for (let round = 0; round < rounds; round++) {
    const proposedLocations = {};
    const elves = {};

    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[row].length; col++) {
        const pos = map[row][col];

        if (pos === 0 || shouldStayPut([row, col], map)) {
          continue;
        }

        const d1 = DIRECTION_ORDER[round % DIRECTION_ORDER.length];
        const d2 = DIRECTION_ORDER[(round + 1) % DIRECTION_ORDER.length];
        const d3 = DIRECTION_ORDER[(round + 2) % DIRECTION_ORDER.length];
        const d4 = DIRECTION_ORDER[(round + 3) % DIRECTION_ORDER.length];

        let newPos = [row, col];

        if (shouldMoveToDirection([row, col], d1, map)) {
          newPos = [row + d1[0], col + d1[1]];
        } else if (shouldMoveToDirection([row, col], d2, map)) {
          newPos = [row + d2[0], col + d2[1]];
        } else if (shouldMoveToDirection([row, col], d3, map)) {
          newPos = [row + d3[0], col + d3[1]];
        } else if (shouldMoveToDirection([row, col], d4, map)) {
          newPos = [row + d4[0], col + d4[1]];
        }

        elves[`${row},${col}`] = newPos;
        proposedLocations[newPos.join(",")] =
          proposedLocations[newPos.join(",")] + 1 || 1;
      }
    }

    const updates = Object.keys(elves);

    if (updates.length === 0) {
      return { map, rounds: round + 1 };
    }

    for (let idx = 0; idx < updates.length; idx++) {
      const toUpdate = updates[idx];
      const proposedLocation = elves[toUpdate];

      if (proposedLocations[proposedLocation.join(",")] !== 1) {
        continue;
      }

      const oldCoords = toUpdate.split(",").map((n) => Number(n));

      map[oldCoords[0]][oldCoords[1]] = 0;
      map[proposedLocation[0]][proposedLocation[1]] = 1;
    }

    map = updateMap(map);
  }

  return { map };
};

const run = () => {
  const dataArray = fs.readFileSync("./input.txt", "utf-8").split("\n");
  const data = dataArray
    .slice(0, dataArray.length - 1)
    .map((row) => row.split("").map((s) => (s === "." ? 0 : 1)));

  const { map } = runGame(data, ROUNDS[0]);
  const mapRect = map
    .slice(1, map.length - 1)
    .map((row) => row.slice(1, row.length - 1));

  let total1 = 0;

  for (let row = 0; row < mapRect.length; row++) {
    for (let col = 0; col < mapRect[row].length; col++) {
      total1 += mapRect[row][col] === 1 ? 0 : 1;
    }
  }

  console.log("Part 1 total:", total1);

  const { rounds: total2 } = runGame(data, ROUNDS[1]);
  console.log("Part 2 total:", total2);
};

run();
