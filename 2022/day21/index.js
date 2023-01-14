import * as fs from "fs";

const ROOT = "root";
const HUMAN = "humn";

const getNumber = (v) => (Number(v) && Number(v) !== 0 ? Number(v) : v);

const invertOp = (op) => {
  if (op === "+") {
    return "-";
  } else if (op === "-") {
    return "+";
  } else if (op === "*") {
    return "/";
  } else if (op === "/") {
    return "*";
  }
};

const checkMonkeys = (monkeys, resolved, waiting, part) => {
  let hasUpdated = true;
  while (hasUpdated) {
    hasUpdated = false;

    const toCheck = [...waiting];

    for (let idx = 0; idx < toCheck.length; idx++) {
      const monkeyToCheck = toCheck[idx];

      if (part === 2 && monkeyToCheck === HUMAN) {
        continue;
      }

      let [m1, op, m2] = monkeys[monkeyToCheck].split(" ");

      const [numberM1, numberM2] = [getNumber(m1), getNumber(m2)];

      if (typeof numberM1 === "string" && typeof monkeys[m1] === "number") {
        m1 = monkeys[m1];
        hasUpdated = true;
      }

      if (typeof numberM2 === "string" && typeof monkeys[m2] === "number") {
        m2 = monkeys[m2];
        hasUpdated = true;
      }

      monkeys[monkeyToCheck] = `${m1} ${op} ${m2}`;

      if (![typeof numberM1, typeof numberM2].includes("string")) {
        monkeys[monkeyToCheck] = eval(monkeys[monkeyToCheck]);

        resolved.delete(monkeyToCheck);
        waiting.delete(monkeyToCheck);

        hasUpdated = true;
      }
    }
  }

  return monkeys;
};

const calculatePart1 = (data, resolved, waiting) => {
  return checkMonkeys({ ...data }, resolved, waiting, 1)[ROOT];
};

const calculatePart2 = (data, resolved, waiting) => {
  const monkeys = { ...data };

  // Change op of ROOT
  const [rootM1, _, rootM2] = monkeys[ROOT].split(" ");
  monkeys[ROOT] = `${rootM1} === ${rootM2}`;

  monkeys[HUMAN] = "X";

  checkMonkeys(monkeys, resolved, waiting, 2);

  // Assumes at least one of the monkey answers is known
  const rootMonkey = monkeys[ROOT].split(" === ");

  let checkingMonkey = rootMonkey.find((n) => typeof getNumber(n) === "string");

  let checkingMonkeyValue = Number(
    rootMonkey.find((n) => typeof getNumber(n) === "number")
  );

  let hasUpdated = true;

  while (hasUpdated) {
    hasUpdated = false;

    const toCheck = [...waiting];

    for (let idx = 0; idx < toCheck.length; idx++) {
      const monkeyToCheck = toCheck[idx];

      if (monkeyToCheck !== checkingMonkey) {
        continue;
      }

      let [m1, op, m2] = monkeys[monkeyToCheck].split(" ");

      const [numberM1, numberM2] = [getNumber(m1), getNumber(m2)];
      op = invertOp(op);
      monkeys[checkingMonkey] = checkingMonkeyValue;

      if (typeof numberM1 === "string") {
        checkingMonkey = numberM1;
        checkingMonkeyValue = eval(`${checkingMonkeyValue} ${op} ${numberM2}`);
      } else if (typeof numberM2 === "string") {
        checkingMonkey = numberM2;
        if (op === "+") {
          checkingMonkeyValue = eval(`${numberM1} - ${checkingMonkeyValue}`);
        } else {
          checkingMonkeyValue = eval(
            `${checkingMonkeyValue} ${op} ${numberM1}`
          );
        }
      }

      if (checkingMonkey === HUMAN) {
        monkeys[HUMAN] = checkingMonkeyValue;
      }

      waiting.delete(monkeyToCheck);

      hasUpdated = true;
    }
  }

  return monkeys[HUMAN];
};

const run = () => {
  const dataArray = fs.readFileSync("./input.txt", "utf-8").split("\n");
  const data = dataArray.slice(0, dataArray.length - 1);

  const resolved = new Set();
  const waiting = new Set();

  const monkeys = {};
  for (let idx = 0; idx < data.length; idx++) {
    const [monkey, value] = data[idx].split(": ");

    const numVal = getNumber(value);
    monkeys[monkey] = numVal;

    typeof numVal === "number" ? resolved.add(monkey) : waiting.add(monkey);
  }

  const total1 = calculatePart1(monkeys, new Set(resolved), new Set(waiting));
  console.log("Part 1 total: ", total1);

  const total2 = calculatePart2(monkeys, new Set(resolved), new Set(waiting));
  console.log("Part 2 total: ", total2);
};

run();
