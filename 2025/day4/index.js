import * as fs from 'fs'

const DIRS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

const LIMIT = 4

const findAvailableSpots = (map) => {
  const spots = []

  for (let rowIdx = 0; rowIdx < map.length; rowIdx++) {
    const row = map[rowIdx];

    for (let colIdx = 0; colIdx < row.length; colIdx++) {
      if (row[colIdx] === ".") continue

      const occupied = DIRS.filter(([rowDir, colDir]) => {
        if (
          rowIdx + rowDir < 0 ||
          rowIdx + rowDir === map.length ||
          colIdx + colDir < 0 ||
          colIdx + colDir === row.length
        ) {
          return false
        }

        return map[rowIdx + rowDir][colIdx + colDir] === "@"
      })

      if (occupied.length < LIMIT) {
        spots[spots.length] = [rowIdx, colIdx]
      }
    }
  }

  return spots
}

const removeAvailableSpots = (map, spots) => {
  const newMap = JSON.parse(JSON.stringify(map))

  spots.forEach(([rowIdx, colIdx]) => {
    newMap[rowIdx][colIdx] = "."
  })

  return newMap
}

const run = () => {
  const dataArray = fs.readFileSync('./input.txt', 'utf-8').split('\n')
  const data = dataArray.slice(0, dataArray.length - 1).map((l) => l.split(''))

  let availableSpots = findAvailableSpots(data)

  const part1 = availableSpots.length

  console.log('Part 1 total: ', part1) // 1537

  let part2 = part1
  let workingMap = data

  while (availableSpots.length !== 0) {
    workingMap = removeAvailableSpots(workingMap, availableSpots)
    availableSpots = findAvailableSpots(workingMap)
    part2 += availableSpots.length
  }

  console.log('Part 2 total: ', part2) // 8707
}

run()
