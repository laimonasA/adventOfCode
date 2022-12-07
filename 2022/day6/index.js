import * as fs from "fs";

const PART_1_SIZE = 4;
const PART_2_SIZE = 14;

const run = () => {
  const dataArray = fs.readFileSync("./input.txt", "utf-8").split("");
  const data = dataArray.slice(0, dataArray.length - 1);

  const indexOfFirstUniqueWindow = (size) => {
    let currentWindow = data.slice(0, size);

    // Check the first slice before shifting the window
    if ([...new Set(currentWindow)].length === size) {
      return size;
    }

    for (let index = size; index < data.length; index++) {
      // Drop the first item of the window and add the next item to the end
      currentWindow = [...currentWindow.slice(1), data[index]];

      // Check if the current window contains the required number of unique characters
      if ([...new Set(currentWindow)].length === size) {
        return index + 1;
      }
    }
  };

  console.log("Part 1 value: ", indexOfFirstUniqueWindow(PART_1_SIZE));
  console.log("Part 2 value: ", indexOfFirstUniqueWindow(PART_2_SIZE));
};

run();
