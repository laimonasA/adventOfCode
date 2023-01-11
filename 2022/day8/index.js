import * as fs from "fs";

const DIRECTION_MAPPING = [
  { dir: [0, 1], start: (_map, [p0]) => [p0, 0] },
  { dir: [0, -1], start: (map, [p0]) => [p0, map[p0].length - 1] },
  { dir: [1, 0], start: (_map, [_, p1]) => [0, p1] },
  { dir: [-1, 0], start: (map, [_, p1]) => [map.length - 1, p1] },
];

const initMapVisibility = (data) => {
  const visibility = [];
  const scores = [];

  for (let rowIdx = 0; rowIdx < data.length; rowIdx++) {
    const row = data[rowIdx];
    visibility[rowIdx] = [];
    scores[rowIdx] = [];

    for (let colIdx = 0; colIdx < row.length; colIdx++) {
      // Top and bottom rows are visible as are the edges, everything else is not visible
      visibility[rowIdx][colIdx] =
        [0, data.length - 1].includes(rowIdx) ||
        [0, row.length - 1].includes(colIdx);

      scores[rowIdx][colIdx] = 0;
    }
  }

  return { visibility, scores };
};

const checkMapInDirection = (map, { dir, start }, { visibility, scores }) => {
  const pos = start(map, [0, 0]);

  while (
    ![-1, map.length].includes(pos[0]) &&
    ![-1, map[pos[0]].length].includes(pos[1])
  ) {
    let largestTree = map[pos[0]][pos[1]];

    while (
      ![-1, map.length].includes(pos[0]) &&
      ![-1, map[pos[0]].length].includes(pos[1])
    ) {
      const currentTree = map[pos[0]][pos[1]];

      visibility[pos[0]][pos[1]] =
        largestTree < currentTree ? true : visibility[pos[0]][pos[1]];

      largestTree = Math.max(largestTree, currentTree);

      let currentScenicScore = 0;
      let stopCounting = false;

      const scenicPos = [pos[0] + dir[0], pos[1] + dir[1]];
      for (
        let idx = 0;
        !scenicPos.includes(-1) && !scenicPos.includes(map.length);
        idx++
      ) {
        if (!stopCounting) {
          currentScenicScore++;
        }

        if (currentTree <= map[scenicPos[0]][scenicPos[1]]) {
          stopCounting = true;
        }

        scenicPos[0] += dir[0];
        scenicPos[1] += dir[1];
      }

      const prevScore = scores[pos[0]][pos[1]];
      scores[pos[0]][pos[1]] =
        prevScore === 0 ? currentScenicScore : prevScore * currentScenicScore;

      pos[0] += dir[0];
      pos[1] += dir[1];
    }

    const newPos = start(map, pos);
    pos[0] = pos[0] === newPos[0] ? pos[0] + 1 : newPos[0];
    pos[1] = pos[1] === newPos[1] ? pos[1] + 1 : newPos[1];
  }
};

const run = () => {
  const dataArray = fs.readFileSync("./input.txt", "utf-8").split("\n");
  const data = dataArray
    .slice(0, dataArray.length - 1)
    .map((dataRow) => dataRow.split("").map((item) => Number(item)));

  const map = initMapVisibility(data);

  for (let idx = 0; idx < DIRECTION_MAPPING.length; idx++) {
    const direction = DIRECTION_MAPPING[idx];

    checkMapInDirection(data, direction, map);
  }

  let [total1, total2] = [0, 0];
  for (let idxRow = 0; idxRow < data[0].length; idxRow++) {
    for (let idxCol = 0; idxCol < data[idxRow].length; idxCol++) {
      total1 += map.visibility[idxRow][idxCol] ? 1 : 0;
      total2 = Math.max(total2, map.scores[idxRow][idxCol]);
    }
  }

  console.log("Part 1 total: ", total1);
  console.log("Part 2 total: ", total2);
};

run();
