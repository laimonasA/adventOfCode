import * as fs from 'fs'

const WORD = ['X', 'M', 'A', 'S']

const countWords = (grid, rowIdx, colIdx) => {
  let dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
    [-1, 1],
    [1, 1],
    [1, -1],
    [-1, -1]
  ]

  for (let idx = 1; idx < WORD.length; idx++) {
    const char = WORD[idx]

    dirs = dirs.filter(([dirRow, dirCol]) => {
      const nextRow = rowIdx + (dirRow * idx)
      const nextCol = colIdx + (dirCol * idx)

      if (nextRow < 0 || nextRow > grid.length - 1 || nextCol < 0 || nextCol > grid[nextRow].length - 1) {
        return false
      }

      return grid[nextRow][nextCol] === char
    })

    if (dirs.length === 0) return 0
  }

  return dirs.length
}

const countCrosses = (grid, rowIdx, colIdx) => {
  const tl = grid[rowIdx - 1][colIdx - 1]
  const tr = grid[rowIdx - 1][colIdx + 1]
  const bl = grid[rowIdx + 1][colIdx - 1]
  const br = grid[rowIdx + 1][colIdx + 1]

  if (
    ((tl === 'M' && br === 'S') || (tl === 'S' && br === 'M')) &&
    (((tr === 'M' && bl === 'S') || (tr === 'S' && bl === 'M')))
  ) {
    return 1
  }

  return 0
}

const run = () => {
  const dataArray = fs.readFileSync('./input.txt', 'utf-8').split('\n')
  const data = dataArray.slice(0, dataArray.length - 1)

  let total1 = 0

  for (let rowIdx = 0; rowIdx < data.length; rowIdx++) {
    const row = data[rowIdx]

    for (let colIdx = 0; colIdx < row.length; colIdx++) {
      const char = row[colIdx]

      if (char === WORD[0]) {
        total1 += countWords(data, rowIdx, colIdx)
      }
    }
  }

  console.log('Part 1 total: ', total1) // 2646

  let total2 = 0

  for (let rowIdx = 1; rowIdx < data.length - 1; rowIdx++) {
    const row = data[rowIdx]

    for (let colIdx = 1; colIdx < row.length - 1; colIdx++) {
      const char = row[colIdx]

      if (char === 'A') {
        total2 += countCrosses(data, rowIdx, colIdx)
      }
    }
  }

  console.log('Part 2 total: ', total2) // 2000
}

run()
