import * as fs from "fs";

const FIRST_CYCLE = 20;
const CYCLE_INTERVAL = 40;
const CYCLES_IN_ADD_ACTION = 2;

const SCREEN_ROW = 40;
const PIXEL_SIZE = 3;

const shouldCountCycle = (cycle, offset = 0) =>
  (cycle - offset) % CYCLE_INTERVAL === 0;

const updateScreen = ({ value, screen }) => {
  const currentPixelIdx =
    screen[screen.length - 1].length === SCREEN_ROW
      ? 0
      : screen[screen.length - 1].length;

  // To be able to make a range either side of the value
  const pixelSpread = (PIXEL_SIZE - 1) / 2;

  const pixelIsVisible =
    currentPixelIdx >= value - pixelSpread &&
    currentPixelIdx <= value + pixelSpread;

  if (currentPixelIdx === 0) {
    // Drop the array in the initial state (so we can easily check screen line length above)
    return [
      ...(screen[0].length === 0 ? [] : screen),
      [pixelIsVisible ? "#" : "."],
    ];
  }

  const newScreen = [...screen];
  newScreen[screen.length - 1][currentPixelIdx] = pixelIsVisible ? "#" : ".";

  return newScreen;
};

const run = () => {
  const dataArray = fs.readFileSync("./input.txt", "utf-8").split("\n");
  const data = dataArray.slice(0, dataArray.length - 1);

  const { total, screen } = data.reduce(
    (acc, cur) => {
      const [action, valueRaw] = cur.split(" ");

      let { cycle, value, total, screen } = acc;

      if (action === "noop") {
        cycle++;
        total += shouldCountCycle(cycle, FIRST_CYCLE) ? value * cycle : 0;

        return { cycle, value, total, screen: updateScreen(acc) };
      }

      if (action === "addx") {
        for (let index = 0; index < CYCLES_IN_ADD_ACTION; index++) {
          cycle++;

          if (shouldCountCycle(cycle, FIRST_CYCLE)) {
            total += value * cycle;
          }

          screen = updateScreen({ value, screen });

          if (index === CYCLES_IN_ADD_ACTION - 1) {
            value += Number(valueRaw);
          }
        }

        return { cycle, value, total, screen };
      }

      return acc;
    },
    { cycle: 0, value: 1, total: 0, screen: [[]] }
  );

  const screenResult = screen.map((row) => row.join(""));

  console.log("Part 1 total: ", total);
  console.log("Part 2 result: ", screenResult);
};

run();
