import * as fs from "fs";

const MAPPING = {
  "=": -2,
  "-": -1,
  0: 0,
  1: 1,
  2: 2,
};

const snafuStringToDecimal = (n) => {
  const nArray = n.split("");

  let total = 0;

  for (let idx = 0; idx < nArray.length; idx++) {
    const item = nArray[idx];

    if (idx === nArray.length - 1) {
      return total + MAPPING[item];
    }

    const pos = nArray.length - idx - 1;
    total += 5 ** pos * MAPPING[item];
  }
};

const decimalNumberToSnafu = (n) => {
  const remainders = [];
  let val = n;

  while (val !== 0) {
    remainders[remainders.length] = val % 5;
    val = Math.floor(val / 5);
  }

  let snafuValue = "";
  for (let idx = 0; idx < remainders.length; idx++) {
    const number = remainders[idx];

    if (number === 5) {
      snafuValue = `0${snafuValue}`;
    } else if (number === 4) {
      snafuValue = `-${snafuValue}`;
    } else if (number === 3) {
      snafuValue = `=${snafuValue}`;
    } else {
      snafuValue = `${number}${snafuValue}`;
    }

    if (number > 2) {
      remainders[idx + 1] = (remainders[idx + 1] || 0) + 1;
    }
  }

  return snafuValue;
};

const run = () => {
  const dataArray = fs.readFileSync("./input.txt", "utf-8").split("\n");
  const data = dataArray.slice(0, dataArray.length - 1);

  let total = 0;
  for (let idx = 0; idx < data.length; idx++) {
    total += snafuStringToDecimal(data[idx]);
  }

  console.log("Total:", decimalNumberToSnafu(total));
};

run();
