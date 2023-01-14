import * as fs from "fs";

const START_POS = [0, 1];

const initState = (data) => {
  const state = {
    up: new Set(),
    down: new Set(),
    left: new Set(),
    right: new Set(),
  };

  for (let rowIdx = 1; rowIdx < data.length - 1; rowIdx++) {
    const row = data[rowIdx].split("");

    for (let colIdx = 1; colIdx < row.length - 1; colIdx++) {
      const key = `${rowIdx}-${colIdx}`;
      const item = row[colIdx];

      item === "^" && state.up.add(key);
      item === ">" && state.right.add(key);
      item === "v" && state.down.add(key);
      item === "<" && state.left.add(key);
    }
  }

  return state;
};

const updateMap = (data, { up, down, left, right }) => {
  const newUp = new Set();
  const newDown = new Set();
  const newLeft = new Set();
  const newRight = new Set();

  const getCoords = (item) => item.split("-").map((n) => Number(n));

  up.forEach((item) => {
    const [row, col] = getCoords(item);

    newUp.add(`${row - 1 === 0 ? data.length - 2 : row - 1}-${col}`);
  });

  down.forEach((item) => {
    const [row, col] = getCoords(item);

    newDown.add(`${row + 1 === data.length - 1 ? 1 : row + 1}-${col}`);
  });

  left.forEach((item) => {
    const [row, col] = getCoords(item);

    newLeft.add(`${row}-${col - 1 === 0 ? data[row].length - 2 : col - 1}`);
  });

  right.forEach((item) => {
    const [row, col] = getCoords(item);

    newRight.add(`${row}-${col + 1 === data[row].length - 1 ? 1 : col + 1}`);
  });

  return { up: newUp, down: newDown, left: newLeft, right: newRight };
};

const canMoveToPosition = (pos, start, data, { up, down, left, right }) => {
  const key = pos.join("-");

  if (pos[0] === start[0] && pos[1] === start[1]) {
    return true;
  }

  if (
    pos.includes(0) ||
    pos.includes(-1) ||
    pos[0] >= data.length - 1 ||
    pos[1] >= data[pos[0]].length - 1
  ) {
    return false;
  }

  return !(up.has(key) || down.has(key) || left.has(key) || right.has(key));
};

const findMinMinutesToExit = (data, state, start, exit, offsetMins = 0) => {
  let atExit = false;
  let mins = offsetMins;
  let spacesToCheck = new Set([start.join("-")]);

  while (atExit === false) {
    mins++;

    const { up, down, left, right } = updateMap(data, state);

    state.up = up;
    state.down = down;
    state.left = left;
    state.right = right;

    const nextSpacesToCheck = new Set();

    spacesToCheck.forEach((item) => {
      const pos = item.split("-").map((i) => Number(i));

      const directions = [
        pos,
        [pos[0] - 1, pos[1]],
        [pos[0] + 1, pos[1]],
        [pos[0], pos[1] - 1],
        [pos[0], pos[1] + 1],
      ];

      for (let dirIdx = 0; dirIdx < directions.length; dirIdx++) {
        const direction = directions[dirIdx];

        if (direction[0] === exit[0] && direction[1] === exit[1]) {
          atExit = true;
        }

        if (canMoveToPosition(direction, start, data, state)) {
          nextSpacesToCheck.add(direction.join("-"));
        }
      }
    });

    spacesToCheck = nextSpacesToCheck;
  }

  return mins;
};

const run = () => {
  const dataArray = fs.readFileSync("./input.txt", "utf-8").split("\n");
  const data = dataArray.slice(0, dataArray.length - 1);

  const state = initState(data);

  const exit = [data.length - 1, data[data.length - 1].length - 2];

  const minutes1 = findMinMinutesToExit(data, state, START_POS, exit);
  const minutes2 = findMinMinutesToExit(data, state, exit, START_POS, minutes1);
  const minutes3 = findMinMinutesToExit(data, state, START_POS, exit, minutes2);

  console.log("Part 1 minutes:", minutes1);
  console.log("Part 2 minutes:", minutes3);
};

run();
