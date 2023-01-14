import * as fs from "fs";

// 0 for empty
// 1 for space
// 2 for wall

const DIRS = [
  [-1, 0], // N
  [0, 1], // E
  [1, 0], // S
  [0, -1], // W
];

const DIR_SCORE = [3, 0, 1, 2];

const FACE_POSITIONS = [
  [0, 50],
  [0, 100],
  [50, 50],
  [100, 0],
  [100, 50],
  [150, 0],
];

// Each item is an object where the key is the source face (f), and the value is an object where
// the key is the direction of travel (d) and the value contains an object with the information for
// the next direction (dir) and a function for the next coordinates (coords). i.e

// { f: { d: { dir: Number, coords: ([Number, Number]) => [Number, Number] } } }

const CUBE_MAPPING = {
  0: {
    0: { dir: 1, coords: ([_, p1]) => [p1 + 100, 0] },
    3: { dir: 1, coords: ([p0, _]) => [150 - p0 - 1, 0] },
  },
  1: {
    0: { dir: 0, coords: ([p0, p1]) => [p0 + 200, p1 - 100] },
    1: { dir: 3, coords: ([p0, p1]) => [150 - p0 - 1, p1 - 50] },
    2: { dir: 3, coords: ([p0, p1]) => [p1 - 50, p0 + 50] },
  },
  2: {
    1: { dir: 0, coords: ([p0, p1]) => [p1 - 50, p0 + 50] },
    3: { dir: 2, coords: ([p0, p1]) => [p1 + 50, p0 - 50] },
  },
  3: {
    0: { dir: 1, coords: ([p0, p1]) => [p1 + 50, p0 - 50] },
    3: { dir: 1, coords: ([p0, p1]) => [150 - p0 - 1, p1 + 50] },
  },
  4: {
    1: { dir: 3, coords: ([p0, p1]) => [150 - p0 - 1, p1 + 50] },
    2: { dir: 3, coords: ([p0, p1]) => [p1 + 100, p0 - 100] },
  },
  5: {
    1: { dir: 0, coords: ([p0, p1]) => [p1 + 100, p0 - 100] },
    2: { dir: 2, coords: ([_, p1]) => [0, p1 + 100] },
    3: { dir: 2, coords: ([p0, _]) => [0, p0 - 100] },
  },
};

const calculateScore = ([p0, p1], dir) =>
  1000 * (p0 + 1) + 4 * (p1 + 1) + DIR_SCORE[dir];

const getInstructionsList = (instructions) =>
  instructions.reduce(
    (acc, cur, idx) => {
      const currentSteps = `${acc.currentSteps}${cur}`;

      if (idx === instructions.length - 1) {
        return [...acc.list, Number(currentSteps)];
      }

      if (["L", "R"].includes(cur)) {
        return {
          list: [...acc.list, Number(acc.currentSteps), cur],
          currentSteps: "",
        };
      }

      return { ...acc, currentSteps };
    },
    { list: [], currentSteps: "" }
  );

const tryMovingPosition = (position, [d0, d1], map) => {
  let [p0, p1] = [position[0] + d0, position[1] + d1];

  if (map[p0]?.[p1] === 2) {
    return false;
  }

  if (d0 === 0) {
    const firstIdxOfSpace = map[p0].indexOf(1);
    const lastIdxOfSpace = map[p0].lastIndexOf(1);

    if (p1 < firstIdxOfSpace) {
      if (
        lastIdxOfSpace !== map[p0].length - 1 &&
        map[p0][lastIdxOfSpace + 1] === 2
      ) {
        return false;
      }

      position[1] = lastIdxOfSpace;
      return true;
    }

    if (p1 > lastIdxOfSpace) {
      if (firstIdxOfSpace !== 0 && map[p0][firstIdxOfSpace - 1] === 2) {
        return false;
      }

      position[1] = firstIdxOfSpace;
      return true;
    }

    position[1] = p1;
    return true;
  }

  let firstApplicableRowIdx = map.length;

  for (let idx = 0; idx < map.length; idx++) {
    if (map[idx][p1] === 1) {
      firstApplicableRowIdx = idx;
      break;
    }
  }

  let lastApplicableRowIdx = 0;

  for (let idx = map.length - 1; idx >= 0; idx--) {
    if (map[idx][p1] === 1) {
      lastApplicableRowIdx = idx;
      break;
    }
  }

  if (p0 < firstApplicableRowIdx) {
    if (
      lastApplicableRowIdx !== map.length - 1 &&
      map[lastApplicableRowIdx + 1][p1] === 2
    ) {
      return false;
    }

    position[0] = lastApplicableRowIdx;
    return true;
  }

  if (p0 > lastApplicableRowIdx) {
    if (
      firstApplicableRowIdx !== 0 &&
      map[firstApplicableRowIdx - 1][p1] === 2
    ) {
      return false;
    }

    position[0] = firstApplicableRowIdx;
    return true;
  }

  position[0] = p0;
  return true;
};

const tryMovingPosition2 = (pos, dir, map) => {
  let [d0, d1] = DIRS[dir];
  let [p0, p1] = [pos[0] + d0, pos[1] + d1];

  if (map[p0]?.[p1] === 1) {
    return { moved: true, pos: [p0, p1], dir };
  }

  if (map[p0]?.[p1] === 2) {
    return { moved: false, pos, dir };
  }

  const currentFace = FACE_POSITIONS.findIndex(
    ([f0, f1]) =>
      pos[0] >= f0 && pos[0] < f0 + 50 && pos[1] >= f1 && pos[1] < f1 + 50
  );

  const nextStuff = CUBE_MAPPING[currentFace][dir];

  const { dir: nextDir, coords } = nextStuff;

  const nextPos = coords(pos);

  if (map[nextPos[0]]?.[nextPos[1]] === 1) {
    return { moved: true, pos: nextPos, dir: nextDir };
  }

  return { moved: false, pos, dir };
};

const run = () => {
  const [dataArray, instructionStr] = fs
    .readFileSync("./input.txt", "utf-8")
    .split("\n\n");
  const data = dataArray.split("\n");
  const instructions = instructionStr.split("\n")[0];

  const map = data.map((row) =>
    row.split("").map((v) => (v === " " ? 0 : v === "." ? 1 : 2))
  );

  const instructionsList = getInstructionsList(instructions.split(""));

  let position1 = [0, map[0].indexOf(1)];
  const position2 = [0, map[0].indexOf(1)];
  let [dir1, dir2] = [1, 1];

  for (let idx = 0; idx < instructionsList.length; idx++) {
    const instruction = instructionsList[idx];

    if (["L", "R"].includes(instruction)) {
      dir1 =
        (dir1 + DIRS.length + (instruction === "L" ? -1 : 1)) % DIRS.length;

      dir2 =
        (dir2 + DIRS.length + (instruction === "L" ? -1 : 1)) % DIRS.length;

      continue;
    }

    let [steps1, steps2] = [instruction, instruction];

    while (steps1 !== 0 || steps2 !== 0) {
      if (steps1 !== 0) {
        const result1 = tryMovingPosition(position1, DIRS[dir1], map);

        steps1 = result1 ? steps1 - 1 : 0;
      }

      if (steps2 !== 0) {
        const { moved, pos, dir } = tryMovingPosition2(position2, dir2, map);

        if (moved) {
          steps2--;
          position2[0] = pos[0];
          position2[1] = pos[1];
          dir2 = dir;
        } else {
          steps2 = 0;
        }
      }
    }
  }

  console.log("Part 1 total:", calculateScore(position1, dir1));
  console.log("Part 2 total:", calculateScore(position2, dir2));
};

run();
