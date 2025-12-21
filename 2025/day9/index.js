import * as fs from 'fs'

const reduceCoords = (coords) => (acc, cur, idx) => {
  if (idx === 0) return [cur]

  const [curN, curIdx] = cur
  const [prevN] = coords[idx - 1]
  const [newN] = acc[acc.length - 1]

  if (curN === prevN) return [...acc, [newN, curIdx]]

  return curN - prevN > 1 ? [...acc, [newN + 1, cur[1]]] : [...acc, cur]
}

const reduceMap = (coords) => {
  const xCoords = coords.map(([x]) => x)
  const yCoords = coords.map(([_, y]) => y)

  const minX = Math.min(...xCoords)
  const minY = Math.min(...yCoords)

  const shiftedCoords = coords.map(([x1, y1]) => [x1 - minX + 1, y1 - minY + 1])

  const sortedXCoords = shiftedCoords.map(([x], idx) => [x, idx]).toSorted(([a], [b]) => a - b)
  const sortedYCoords = shiftedCoords.map(([, y], idx) => [y, idx]).toSorted(([a], [b]) => a - b)

  const reducedXCoords = sortedXCoords.reduce(reduceCoords(sortedXCoords), [])
  const reducedYCoords = sortedYCoords.reduce(reduceCoords(sortedYCoords), [])

  const sortedReducedXCoords = reducedXCoords.toSorted(([_, a], [__, b]) => a - b)
  const sortedReducedYCoords = reducedYCoords.toSorted(([_, a], [__, b]) => a - b)

  return sortedReducedXCoords.map(([x, idx]) => [x, sortedReducedYCoords[idx][0]])
}

const getPerimeter = (coords) => coords.reduce((acc, cur, idx) => {
  const [row1, col1] = cur
  const [row2, col2] = coords[(idx + 1) % coords.length]

  const rowDist = row2 - row1
  const colDist = col2 - col1

  const rowDir = rowDist === 0 ? 0 : Math.abs(rowDist) / rowDist
  const colDir = colDist === 0 ? 0 : Math.abs(colDist) / colDist

  const perim = {}
  const newPoint = [row1, col1]

  while (newPoint[0] !== row2 || newPoint[1] !== col2) {
    perim[newPoint.join(':')] = 1

    newPoint[0] += rowDir
    newPoint[1] += colDir
  }

  perim[[row2, col2].join(':')] = 1

  return { ...acc, ...perim }
}, {})

const findOutside = (coords) => {
  const perimeter = getPerimeter(coords)

  const start = [0, 0].join(':')
  const outside = { [start]: 1 }

  const maxX = Math.max(...Object.keys(perimeter).map((c) => parseInt(c.split(':')[0], 10))) + 1
  const maxY = Math.max(...Object.keys(perimeter).map((c) => parseInt(c.split(':')[1], 10))) + 1

  const dirs = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]]

  let queue = [start]
  while (queue.length !== 0) {
    const [pos, ...restQueue] = queue
    const [posX, posY] = pos.split(':').map((n) => parseInt(n, 10))

    for (let dirIdx = 0; dirIdx < dirs.length; dirIdx++) {
      const [dirX, dirY] = dirs[dirIdx]
      const [newX, newY] = [posX + dirX, posY + dirY]
      const newKey = [newX, newY].join(':')

      if (newX < 0 || newY < 0 || newX > maxX || newY > maxY || newKey in outside || newKey in perimeter) {
        continue
      }

      outside[newKey] = 1
      restQueue[restQueue.length] = newKey
    }

    queue = restQueue
  }

  return outside
}

const isWithinBounds = (coords, idx1, idx2, outside) => {
  const [x1, y1] = coords[idx1]
  const [x2, y2] = coords[idx2]

  const perimeter = getPerimeter([coords[idx1], [x1, y2], coords[idx2], [x2, y1]])

  return !Object.keys(perimeter).some((p) => p in outside)
}

const solve = (coords, part2 = false) => {
  const reducedCoords = part2 ? reduceMap(coords) : coords
  const outside = part2 ? findOutside(reducedCoords) : {}

  return coords.reduce((acc, [x1, y1], idx) => {
    const areaSizes = [acc]

    for (let compIdx = idx + 1; compIdx < coords.length; compIdx++) {
      const [x2, y2] = coords[compIdx]

      if (!part2 || isWithinBounds(reducedCoords, idx, compIdx, outside)) {
        areaSizes[areaSizes.length] = (Math.sqrt((x1 - x2)**2) + 1) * (Math.sqrt((y1 - y2)**2) + 1)
      }
    }

    return Math.max(...areaSizes)
  }, 0)
}

const run = () => {
  const dataArray = fs.readFileSync('./input.txt', 'utf-8').split('\n')
  const data = dataArray.slice(0, dataArray.length - 1)

  const coords = data.reduce((acc, cur) => [...acc, cur.split(',').map((n) => parseInt(n, 10))], [])

  const part1 = solve(coords)

  console.log('Part 1 total: ', part1)

  const part2 = solve(coords, true)

  console.log('Part 2 total: ', part2)
}

run()
