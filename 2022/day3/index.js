import * as fs from "fs";

const ELVES_IN_GROUP = 3;

const intersection = (a, b) => [...a].filter((item) => b.has(item));

const letterScore = (l) => l.charCodeAt(0) - (l.charCodeAt(0) < 97 ? 38 : 96);

const run = () => {
  const dataArray = fs.readFileSync("./input.txt", "utf-8").split("\n");
  const data = dataArray.slice(0, dataArray.length - 1);

  const total1 = data.reduce((acc, cur) => {
    const firstHalf = new Set(cur.slice(0, cur.length / 2));
    const secondHalf = new Set(cur.slice(cur.length / 2));

    return acc + letterScore(intersection(firstHalf, secondHalf)[0]);
  }, 0);

  const { score: total2 } = data.reduce(
    ({ commonItems, currentElfInGroup, score }, cur) => {
      const currentBackpackSet = new Set(cur);

      const intersect = intersection(commonItems, currentBackpackSet);

      const accScore = score + letterScore(intersect[0] || "");

      return {
        commonItems: currentElfInGroup === 0 ? currentBackpackSet : intersect,
        currentElfInGroup: (currentElfInGroup + 1) % 3,
        score: currentElfInGroup === ELVES_IN_GROUP - 1 ? accScore : score,
      };
    },
    { commonItems: new Set(), currentElfInGroup: 0, score: 0 }
  );

  console.log("Part 1 score: ", total1);
  console.log("Part 2 score: ", total2);
};

run();
