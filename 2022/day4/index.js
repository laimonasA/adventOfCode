import * as fs from "fs";

const getRange = (range) => range.split("-").map((n) => Number(n));

const doRangesOverlapFully = (e1, e2) => {
  const [e11, e12, e21, e22] = [...getRange(e1), ...getRange(e2)];

  // 1st elf overlaps the 2nd OR 2nd elf overlaps the 1st
  return (e11 <= e21 && e12 >= e22) || (e21 <= e11 && e22 >= e12);
};

const doRangesOverlapSome = (e1, e2) => {
  const [e11, e12, e21, e22] = [...getRange(e1), ...getRange(e2)];

  // Start of 2nd elf overlaps with 1st elf OR End of 2nd elf overlaps with 1st elf
  return (e21 >= e11 && e21 <= e12) || (e22 >= e11 && e22 <= e12);
};

const run = () => {
  const dataArray = fs.readFileSync("./input.txt", "utf-8").split("\n");
  const data = dataArray.slice(0, dataArray.length - 1);

  const total1 = data.reduce((acc, cur) => {
    const [elf1, elf2] = cur.split(",");

    return doRangesOverlapFully(elf1, elf2) ? acc + 1 : acc;
  }, 0);

  const total2 = data.reduce((acc, cur) => {
    const [elf1, elf2] = cur.split(",");

    const overlaps =
      doRangesOverlapFully(elf1, elf2) || doRangesOverlapSome(elf1, elf2);

    return overlaps ? acc + 1 : acc;
  }, 0);

  console.log("Part 1 total: ", total1);
  console.log("Part 2 total: ", total2);
};

run();
