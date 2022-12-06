import * as fs from "fs";

const getStacksFromData = (data) => {
  const dataNoCols = data.slice(0, data.length - 1);
  const dataCols = data[data.length - 1].replaceAll(" ", "");

  const numberOfStacks = Number(dataCols[dataCols.length - 1]);

  const innerReduceFunction = (acc, cur, idx) => {
    // If it's anything other than a letter then ignore it
    if ([" ", "[", "]"].includes(cur)) {
      return acc;
    }

    const accCopy = [...acc];

    const stackNumber = (idx - 1) / 4;
    accCopy[stackNumber] = [cur, ...accCopy[stackNumber]];

    return accCopy;
  };

  // For each row of the stack data, iterate over each character to build up the stack
  return dataNoCols.reduce(
    (acc, cur) => cur.split("").reduce(innerReduceFunction, acc),
    Array(numberOfStacks).fill([])
  );
};

const getInstruction = (text) => {
  const [amountString, instructionString] = text.split(" from ");

  const [, amountS] = amountString.split("move ");
  const [fromS, toS] = instructionString.split(" to ");

  return [amountS, fromS, toS].map((s, idx) => Number(s) - (idx === 0 ? 0 : 1));
};

const getWordFromStack = (stack) =>
  stack.reduce((acc, cur) => acc + (cur[cur.length - 1] || ""), "");

const run = () => {
  const [stackDataRaw, movesDataRaw] = fs
    .readFileSync("./input.txt", "utf-8")
    .split("\n\n")
    .map((data) => data.split("\n"));

  const stackData = getStacksFromData(stackDataRaw);
  const movesData = movesDataRaw.slice(0, movesDataRaw.length - 1);

  const reduceFunction = (acc, cur, shouldReverse) => {
    const [amount, from, to] = getInstruction(cur);

    const newAcc = [...acc];
    const newFromStack = acc[from].slice(0, acc[from].length - amount);
    const removedParts = acc[from].slice(acc[from].length - amount);

    newAcc[from] = newFromStack;

    const reversedParts = [...removedParts];
    reversedParts.reverse();

    newAcc[to] = [
      ...acc[to],
      ...(shouldReverse ? reversedParts : removedParts),
    ];

    return newAcc;
  };

  const result1 = movesData.reduce(
    (acc, cur) => reduceFunction(acc, cur, true),
    stackData
  );

  const result2 = movesData.reduce(
    (acc, cur) => reduceFunction(acc, cur, false),
    stackData
  );

  console.log("Part 1 result: ", getWordFromStack(result1));
  console.log("Part 2 result: ", getWordFromStack(result2));
};

run();
