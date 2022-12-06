import * as fs from "fs";

const run = () => {
  const dataArray = fs.readFileSync("./input.txt", "utf-8").split("\n");
  const data = dataArray.slice(0, dataArray.length - 1);

  const totals = data.reduce(
    (acc, cur) => {
      if (!cur) {
        return [...acc, 0];
      }

      const currentElf = acc[acc.length - 1];
      const restElves = acc.slice(0, acc.length - 1);

      return [...restElves, currentElf + Number(cur)];
    },
    [0]
  );

  const top3Elves = totals.sort((a, b) => a - b).slice(totals.length - 3);
  const top3Total = top3Elves.reduce((acc, cur) => acc + cur, 0);

  console.log("Part 1 total: ", top3Elves);
  console.log("Part 2 total: ", top3Total);
};

run();
