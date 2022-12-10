import * as fs from "fs";

const PART_1_DIR_SIZE = 100000;
const TOTAL_SIZE = 70000000;
const REQUIRED_SIZE = 30000000;

const getCommand = (cmd) => {
  const command = cmd.split(" ");

  return ["$", "dir"].includes(command[0])
    ? command
    : [Number(command[0]), command[1]];
};

const getDirectory = (currentDirectory, [_, __, dir]) => {
  if (dir === "..") {
    const stringArray = [...currentDirectory];

    const trimmedDir = stringArray.slice(0, stringArray.length - 1).join("");
    const dirName = trimmedDir.slice(0, trimmedDir.lastIndexOf("/"));

    return dirName === "/" ? dirName : `${dirName}/`;
  }

  return dir === "/" ? "/" : `${currentDirectory}${dir}/`;
};

const getFileStructure = (data) =>
  data.reduce(
    (acc, cur) => {
      const command = getCommand(cur);
      const [arg1, arg2] = command;

      if (arg1 === "$" && arg2 === "cd") {
        return { ...acc, currentDir: getDirectory(acc.currentDir, command) };
      }

      if (typeof arg1 === "number") {
        return {
          ...acc,
          files: {
            ...acc.files,
            [`${acc.currentDir}${arg2}`]: arg1,
          },
        };
      }

      // We don't care about other commands like: ls
      return acc;
    },
    { currentDir: "", files: {} }
  ).files;

const getDirectoryTotals = (files) =>
  Object.keys(files).reduce((acc, filePath) => {
    const newAcc = { ...acc };

    // Create an array where each item is a directory, and the last item is the file
    const dirs =
      filePath.length === 1
        ? filePath
        : filePath.slice(0, filePath.lastIndexOf("/" + 1)).split("/");

    for (let index = 0; index < dirs.length; index++) {
      // Add the file size to the root dir
      if (index === 0) {
        newAcc["/"] = (newAcc["/"] ? newAcc["/"] : 0) + files[filePath];
      }

      // If you're at a non-root dir and not the file itself, then add the file size to that dir
      if (![0, dirs.length - 1].includes(index)) {
        const path = dirs.slice(0, index + 1).join("/");
        newAcc[path] = (newAcc[path] ? newAcc[path] : 0) + files[filePath];
      }
    }

    return newAcc;
  }, {});

const run = () => {
  const dataArray = fs.readFileSync("./input.txt", "utf-8").split("\n");
  const data = dataArray.slice(0, dataArray.length - 1);

  // Build up an object containing { [filePath]: fileSize }
  const fileStructure = getFileStructure(data);

  // Iterate over each filePath and calculate each directory's total
  const directoryTotals = getDirectoryTotals(fileStructure);

  const total1 = Object.keys(directoryTotals).reduce((acc, cur) => {
    const dirSize = directoryTotals[cur];

    return dirSize > PART_1_DIR_SIZE ? acc : acc + dirSize;
  }, 0);

  const sizeRequired = REQUIRED_SIZE - (TOTAL_SIZE - directoryTotals["/"]);

  const total2 = Object.keys(directoryTotals).reduce((acc, cur) => {
    const curSize = directoryTotals[cur];

    return curSize < sizeRequired ? acc : Math.min(acc, curSize);
  }, Infinity);

  console.log("Part 1 total: ", total1);
  console.log("Part 2 total: ", total2);
};

run();
