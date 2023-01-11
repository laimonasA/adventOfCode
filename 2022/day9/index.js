import * as fs from "fs";

const run = () => {
  const dataArray = fs.readFileSync("./input.txt", "utf-8").split("\n");
  const data = dataArray.slice(0, dataArray.length - 1);

  const getVisitedPositions = (n) => {
    const positions = new Set(["0,0"]);
    const knots = Array(n).fill([0, 0]);

    let hX = 0;
    let hY = 0;

    for (let idx = 0; idx < data.length; idx++) {
      const [dir, steps] = data[idx].split(" ");

      const dirX = dir === "R" ? 1 : dir === "L" ? -1 : 0;
      const dirY = dir === "U" ? 1 : dir === "D" ? -1 : 0;

      for (let step = 0; step < steps; step++) {
        hX += dirX;
        hY += dirY;

        for (let kIdx = 0; kIdx < knots.length; kIdx++) {
          const [kX, kY] = knots[kIdx];
          const [tX, tY] = kIdx === 0 ? [hX, hY] : knots[kIdx - 1];

          const tUnderH = tX === kX && tY === kY;
          const tNextToHX = [tX - 1, tX, tX + 1].includes(kX);
          const tNextToHY = [tY - 1, tY, tY + 1].includes(kY);

          if (tUnderH || (tNextToHX && tNextToHY)) {
            continue;
          }

          const tIsDiagonal =
            ([tX - 1, tX + 1].includes(kX) && kY !== tY) ||
            ([tY - 1, tY + 1].includes(kY) && kX !== tX);

          if (tIsDiagonal) {
            const getDiagonal = (h, t) =>
              Math.abs(h - t) === 1 ? h : t + (h > t ? 1 : -1);

            knots[kIdx] = [getDiagonal(tX, kX), getDiagonal(tY, kY)];
          } else {
            knots[kIdx] = [
              kX === tX ? kX : kX + (tX > kX ? 1 : -1),
              kY === tY ? kY : kY + (tY > kY ? 1 : -1),
            ];
          }

          if (kIdx === n - 1) {
            positions.add(knots[kIdx].join(","));
          }
        }
      }
    }

    return positions.size;
  };

  console.log("Part 1 total: ", getVisitedPositions(1));
  console.log("Part 2 total: ", getVisitedPositions(9));
};

run();
