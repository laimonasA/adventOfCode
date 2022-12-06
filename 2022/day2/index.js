import * as fs from "fs";

const itemScore = { X: 1, Y: 2, Z: 3 };

const roundScore = {
  "A X": 3,
  "A Y": 6,
  "A Z": 0,
  "B X": 0,
  "B Y": 3,
  "B Z": 6,
  "C X": 6,
  "C Y": 0,
  "C Z": 3,
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

  const score1 = data.reduce(
    (acc, cur) => acc + roundScore[cur] + itemScore[cur[2]],
    0
  );

  const score2 = data.reduce((acc, cur) => acc + roundScoreOutcome[cur], 0);

  console.log("Part 1 score: ", score1);
  console.log("Part 2 score: ", score2);
};

run();
