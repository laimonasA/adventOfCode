import * as fs from "fs";

const PART_ROUNDS = [20, 10000];

const applyOperation = (value, operationString) => {
  const [op, xStr] = operationString.split(" ").slice(6);
  const x = xStr === "old" ? value : Number(xStr);

  switch (op) {
    case "+":
      return value + x;
    case "-":
      return value - x;
    case "*":
      return value * x;
    case "/":
      return value / x;
    default:
      return value;
  }
};

const applyTest = (value, [divStr, tStr, fStr]) => {
  const divisor = Number(divStr.split("by ")[1]);
  const ifTrue = Number(tStr.split("monkey ")[1]);
  const ifFalse = Number(fStr.split("monkey ")[1]);

  return value % divisor === 0 ? ifTrue : ifFalse;
};

const calculateMonkeyBusiness = (dataArray, partIdx) => {
  const data = [];
  const state = [];

  let lcm = 1;

  // Build the initial state
  for (let idx = 0; idx < dataArray.length; idx++) {
    const d = dataArray[idx].split("\n");

    const item = d[d.length - 1] === "" ? d.slice(0, d.length - 1) : d;
    data[idx] = item;

    const items = item[1]
      .substring(18)
      .split(", ")
      .map((n) => Number(n));

    lcm *= Number(item[3].split("by ")[1]);

    state[idx] = { items, inspections: 0 };
  }

  for (let round = 0; round < PART_ROUNDS[partIdx]; round++) {
    for (let mIdx = 0; mIdx < state.length; mIdx++) {
      state[mIdx].items.forEach((item) => {
        state[mIdx].inspections++;

        const newLevel0 = Math.floor(applyOperation(item, data[mIdx][2]) / 3);
        const newLevel1 = applyOperation(item, data[mIdx][2]) % lcm;
        const newLevel = partIdx === 0 ? newLevel0 : newLevel1;

        const whereToThrow = applyTest(newLevel, data[mIdx].slice(3));

        state[mIdx].items = state[mIdx].items.slice(1);
        state[whereToThrow].items[state[whereToThrow].items.length] = newLevel;
      });
    }
  }

  return state
    .reduce((acc, { inspections }) => [...acc, inspections], [])
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((acc, cur) => acc * cur, 1);
};

const run = () => {
  const dataArray = fs.readFileSync("./input.txt", "utf-8").split("\n\n");

  console.log("Part 1 total: ", calculateMonkeyBusiness(dataArray, 0));
  console.log("Part 2 total: ", calculateMonkeyBusiness(dataArray, 1));
};

run();
