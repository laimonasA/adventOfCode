import * as fs from "fs";

const DIVIDERS = [[[2]], [[6]]];

const run = () => {
  const dataArray = fs.readFileSync("./input.txt", "utf-8").split("\n");

  const data = [];
  dataArray.forEach((d) => d !== "" && (data[data.length] = JSON.parse(d)));

  const fn = (left, right) => {
    const maxLength = Math.max(left.length, right.length);

    for (let idx = 0; idx < maxLength; idx++) {
      const [leftItem, rightItem] = [left?.[idx], right?.[idx]];

      if (typeof leftItem === "number" && typeof rightItem === "number") {
        if (leftItem === rightItem) {
          continue;
        }

        return leftItem < rightItem ? -1 : 1;
      }

      if (leftItem === undefined || rightItem === undefined) {
        if (leftItem === undefined && rightItem === undefined) {
          continue;
        }

        return leftItem === undefined ? -1 : 1;
      }

      const eitherSideIsNumber =
        typeof leftItem === "number" || typeof rightItem === "number";
      const eitherSideIsArray =
        leftItem.length !== undefined || rightItem.length !== undefined;

      if (eitherSideIsNumber && eitherSideIsArray) {
        const isInOrder = fn(
          typeof leftItem === "number" ? [leftItem] : leftItem,
          typeof rightItem === "number" ? [rightItem] : rightItem
        );

        if (isInOrder === 0) {
          continue;
        }

        return isInOrder;
      }

      if (leftItem.length !== undefined && rightItem.length !== undefined) {
        const areArraysInOrder = fn(leftItem, rightItem);

        if (areArraysInOrder === 0) {
          continue;
        }

        return areArraysInOrder;
      }
    }

    return 0;
  };

  let total1 = 0;

  for (let idx = 0; idx < data.length; idx += 2) {
    const isPairInOrder = fn(data[idx], data[idx + 1]);

    total1 += isPairInOrder === -1 ? idx / 2 + 1 : 0;
  }

  const res = [...data, ...DIVIDERS].sort(fn);
  let total2 = 1;

  for (let idx = 0; idx < res.length; idx++) {
    if (
      DIVIDERS.map((div) => JSON.stringify(div)).includes(
        JSON.stringify(res[idx])
      )
    ) {
      total2 *= idx + 1;
    }
  }

  console.log("Part 1 total: ", total1);
  console.log("Part 2 total: ", total2);
};

run();
