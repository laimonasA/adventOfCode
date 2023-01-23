import * as fs from "fs";

const roundScore = {
  "A X": 4,
  "A Y": 8,
  "A Z": 3,
  "B X": 1,
  "B Y": 5,
  "B Z": 9,
  "C X": 7,
  "C Y": 2,
  "C Z": 6,
};

const roundScoreOutcome = {
  "A X": 3,
  "A Y": 4,
  "A Z": 8,
  "B X": 1,
  "B Y": 5,
  "B Z": 9,
  "C X": 2,
  "C Y": 6,
  "C Z": 7,
};

const run = () => {
  const dataArray = fs.readFileSync("./input.txt", "utf-8").split("\n");
  const data = dataArray.slice(0, dataArray.length - 1);

  const score1 = data.reduce((acc, cur) => acc + roundScore[cur], 0);
  const score2 = data.reduce((acc, cur) => acc + roundScoreOutcome[cur], 0);

  console.log("Part 1 score: ", score1);
  console.log("Part 2 score: ", score2);
};

run();
