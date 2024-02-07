import * as fs from "fs";

const run = () => {
  const dataArray = fs.readFileSync("./input.ex.txt", "utf-8").split("\n");
  // const dataArray = fs.readFileSync("./input.txt", "utf-8").split("\n");
  const data = dataArray.slice(0, dataArray.length - 1);

  console.log(data);

  console.log("Part 1 total: ", 0);

  console.log("Part 2 total: ", 0);
};

run();
