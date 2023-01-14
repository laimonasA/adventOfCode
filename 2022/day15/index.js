import * as fs from "fs";

const Y_POS = 2000000;

const LIMIT = 4000000;
const MULTIPLIER = 4000000;

const getPointsOutsideOfBorder = (center, dist) => {
  const points = new Set();

  const distToOutside = dist + 1;

  const directions = [
    [1, 1],
    [1, -1],
    [-1, -1],
    [-1, 1],
  ];

  const curBorder = [center[0] - distToOutside, center[1]];

  for (let dirIdx = 0; dirIdx < directions.length; dirIdx++) {
    const direction = directions[dirIdx];

    for (let borderIdx = 0; borderIdx < distToOutside; borderIdx++) {
      curBorder[0] = curBorder[0] + direction[0];
      curBorder[1] = curBorder[1] + direction[1];

      if (
        curBorder[0] >= 0 &&
        curBorder[0] <= LIMIT &&
        curBorder[1] >= 0 &&
        curBorder[1] <= LIMIT
      ) {
        points.add(`${curBorder[0]},${curBorder[1]}`);
      }
    }
  }

  return [...points].map((coords) =>
    coords.split(",").map((coord) => Number(coord))
  );
};

const isPointInRange = (center, dist, p) =>
  Math.abs(center[0] - p[0]) + Math.abs(center[1] - p[1]) <= dist;

const findNonBeaconPositions = (data, targetRow) => {
  const noBeacon = new Set();

  const dataWithDistances = data.reduce((acc, cur) => {
    const [s, b] = cur.split(": ").map((item) =>
      item
        .split(" at ")[1]
        .split(", ")
        .map((item) => Number(item.split("=")[1]))
    );

    const distance = Math.abs(s[0] - b[0]) + Math.abs(s[1] - b[1]);

    const isRowInRange =
      (targetRow <= s[1] && targetRow >= s[1] - distance) ||
      (targetRow >= s[1] && targetRow <= s[1] + distance);

    const distanceRemaining = Math.abs(Math.abs(s[1] - targetRow) - distance);

    if (isRowInRange) {
      for (let index = 0; index <= distanceRemaining; index++) {
        index <= LIMIT && noBeacon.add(s[0] + index);
        index >= 0 && noBeacon.add(s[0] - index);
      }
    }

    return [...acc, { s, b, distance }];
  }, []);

  // Remove the beacons from the target row
  for (let idx = 0; idx < dataWithDistances.length; idx++) {
    const { b } = dataWithDistances[idx];

    if (b[1] === targetRow) {
      noBeacon.delete(b[0]);
    }
  }

  return { dataWithDistances, noBeacon };
};

const findUnreachablePoint = (data) => {
  for (let centerIdx = 0; centerIdx < data.length; centerIdx++) {
    const { s } = data[centerIdx];

    const borderPoints = getPointsOutsideOfBorder(s, data[centerIdx].distance);

    for (
      let borderPointIdx = 0;
      borderPointIdx < borderPoints.length;
      borderPointIdx++
    ) {
      const borderPoint = borderPoints[borderPointIdx];

      let pointIsInRange = false;
      let centerTestIdx = -1;

      while (!pointIsInRange && centerTestIdx < data.length - 1) {
        centerTestIdx++;

        const centerTest = data[centerTestIdx];

        if (s[0] === centerTest.s[0] && s[1] === centerTest.s[1]) {
          continue;
        }

        if (isPointInRange(centerTest.s, centerTest.distance, borderPoint)) {
          pointIsInRange = true;
        }
      }

      if (!pointIsInRange) {
        return borderPoint;
      }
    }
  }
};

const run = () => {
  const dataArray = fs.readFileSync("./input.txt", "utf-8").split("\n");
  const data = dataArray.slice(0, dataArray.length - 1);

  const { dataWithDistances, noBeacon } = findNonBeaconPositions(data, Y_POS);
  const total1 = noBeacon.size;
  console.log("Part 1 total:", total1);

  const unreachablePoint = findUnreachablePoint(dataWithDistances);
  const total2 = unreachablePoint[0] * MULTIPLIER + unreachablePoint[1];
  console.log("Part 2 total:", total2);
};

run();
