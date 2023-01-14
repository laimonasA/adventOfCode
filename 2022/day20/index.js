import * as fs from "fs";

const MULTIPLIER = [1, 811589153];
const ROUNDS = [1, 10];
const INTERVALS = [1000, 2000, 3000];

const getNewIndex = (originalIdx, value, listLength) => {
  const newIdx = (originalIdx + value) % (listLength - 1);

  return newIdx < 0 ? listLength - 1 + (newIdx % (listLength - 1)) : newIdx;
};

const mixingFunction = (data, part) => {
  let list = data.map((i, idx) => ({
    val: Number(i) * MULTIPLIER[part],
    idx,
  }));
  const order = list.map(({ val }) => val);

  for (let loopIdx = 1; loopIdx <= ROUNDS[part]; loopIdx++) {
    for (let idx = 0; idx < order.length; idx++) {
      const val = order[idx];

      const valueIdx = list.findIndex((v) => v.idx === idx);
      const newIdx = getNewIndex(valueIdx, val, list.length);

      const before = list.slice(0, valueIdx);
      const after = list.slice(valueIdx + 1);

      list = [...before, ...after];
      list.splice(newIdx, 0, { val, idx });
    }
  }

  return list.map(({ val }) => val);
};

const run = () => {
  const dataArray = fs.readFileSync("./input.txt", "utf-8").split("\n");
  const data = dataArray.slice(0, dataArray.length - 1);

  const part1List = mixingFunction(data, 0);
  const part2List = mixingFunction(data, 1);

  const idx1 = part1List.indexOf(0);
  const idx2 = part2List.indexOf(0);

  let total1 = 0;
  let total2 = 0;

  for (let n = 1; n <= INTERVALS[INTERVALS.length - 1]; n++) {
    if (INTERVALS.includes(n)) {
      total1 += part1List[(idx1 + n) % part1List.length];
      total2 += part2List[(idx2 + n) % part2List.length];
    }
  }

  console.log("Part 1 total: ", total1);
  console.log("Part 2 total: ", total2);
};

run();
