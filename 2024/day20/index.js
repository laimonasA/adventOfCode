import * as fs from 'fs'

const DIRS = [[-1, 0], [0, 1], [1, 0], [0, -1]]

const findStartAndEnd = (map) => {
  const nodes = [-1, -1]

  for (let rowIdx = 0; rowIdx < map.length; rowIdx++) {
    const row = map[rowIdx]

    const startIdx = row.indexOf('S')
    const endIdx = row.indexOf('E')

    if (startIdx !== -1) {
      nodes[0] = [rowIdx, startIdx]
    }

    if (endIdx !== -1) {
      nodes[1] = [rowIdx, endIdx]
    }

    if (!nodes.includes(-1)) {
      return nodes
    }
  }

  return nodes
}

const findPath = (start, end, map) => {
  const route = [start]
  const seen = new Set([start.join(':')])

  while (!seen.has(end.join(':'))) {
    const [row, col] = (route[route.length - 1] ?? start)

    for (const dir of DIRS) {
      const [nextRow, nextCol] = [row + dir[0], col + dir[1]]
      const nextKey = `${nextRow}:${nextCol}`

      if (map[nextRow][nextCol] === '#' || seen.has(nextKey)) {
        continue
      }

      route[route.length] = [nextRow, nextCol]
      seen.add(nextKey)
    }
  }

  return route
}

const findCheats = (min, max, target, route) => {
  const cheats = new Set()
  let idx = 0

  while (idx < route.length - 1 - target) {
    const [rowIdx, colIdx] = route[idx]

    for (let cheatIdx = min; cheatIdx <= max; cheatIdx++) {
      let jumpIdx = idx + target + cheatIdx

      while (jumpIdx < route.length) {
        const [jumpRow, jumpCol] = route[jumpIdx]
  
        const rowDiff = Math.abs(rowIdx - jumpRow)
        const colDiff = Math.abs(colIdx - jumpCol)
  
        if (rowDiff + colDiff === cheatIdx) {
          cheats.add([rowIdx, colIdx, jumpRow, jumpCol].join(':'))
        }
  
        jumpIdx += 1
      }
    }

    idx += 1
  }

  return cheats.size
}

const run = () => {
  const dataArray = fs.readFileSync('./input.txt', 'utf-8').split('\n')
  const data = dataArray.slice(0, dataArray.length - 1)

  const [start, end] = findStartAndEnd(data)
  const path = findPath(start, end, data)

  const total1 = findCheats(2, 2, 100, path)
  const total2 = findCheats(1, 20, 100, path)

  console.log('Part 1 total: ', total1) // 1286

  console.log('Part 2 total: ', total2) // 989316
}

run()
