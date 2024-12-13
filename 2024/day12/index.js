import * as fs from 'fs'

const getRegions = (map) => {
  const regions = []
  const explored = new Set()

  for (let rowIdx = 0; rowIdx < map.length; rowIdx++) {
    const row = map[rowIdx]

    for (let colIdx = 0; colIdx < row.length; colIdx++) {
      if (explored.has(`${rowIdx}:${colIdx}`)) continue

      const letter = map[rowIdx][colIdx]
      regions[regions.length] = []

      let q = [[rowIdx, colIdx]]
      explored.add(`${rowIdx}:${colIdx}`)

      while (q.length !== 0) {
        const [[curRow, curCol], ...restQ] = q
        q = restQ

        const regLen = regions.length - 1
        regions[regLen][regions[regLen].length] = [curRow, curCol]

        for (const [d1, d2] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
          const [nextRow, nextCol] = [curRow + d1, curCol + d2]

          if (
            explored.has(`${nextRow}:${nextCol}`) ||
            [-1, map.length].includes(nextRow) ||
            [-1, map[nextRow].length].includes(nextCol)
          ) {
            continue
          }

          if (map[nextRow][nextCol] === letter) {
            q[q.length] = [nextRow, nextCol]
            explored.add(`${nextRow}:${nextCol}`)
          }
        }
      }
    }
  }

  return regions
}

const calculate = (region, map) => region.length * region.reduce((acc, cur) => {
  const [rIdx, cIdx] = cur

  const edges = [
    rIdx === 0 || map[rIdx - 1][cIdx] !== map[rIdx][cIdx],
    rIdx === map.length - 1 || map[rIdx + 1][cIdx] !== map[rIdx][cIdx],
    cIdx === 0 || map[rIdx][cIdx - 1] !== map[rIdx][cIdx],
    cIdx === map[rIdx].length - 1 || map[rIdx][cIdx + 1] !== map[rIdx][cIdx]
  ].filter((e) => e)

  return acc + edges.length
}, 0)


const calculateGroups = (region, map) => {
  let total = 0

  const topGroup = new Set()
  const rightGroup = new Set()
  const bottomGroup = new Set()
  const leftGroup = new Set()

  const sortedRegion = [...region].sort(([a1, a2], [b1, b2]) => a1 === b1 ? a2 - b2 : a1 - b1)

  for (const [rowIdx, colIdx] of sortedRegion) {
    const letter = map[rowIdx][colIdx]
    const key = `${rowIdx}:${colIdx}`

    if (!topGroup.has(key) && (rowIdx === 0 || map[rowIdx - 1][colIdx] !== letter)) {
      topGroup.add(key)
      total += 1

      let i = 1
      while (i > 0) {
        if (colIdx + i < map[rowIdx].length && map[rowIdx][colIdx + i] === letter && (rowIdx === 0 || map[rowIdx - 1][colIdx + i] !== letter)) {
          topGroup.add(`${rowIdx}:${colIdx + i}`)
          i += 1
        } else {
          i = 0
        }
      }
    }

    if (!rightGroup.has(key) && (colIdx === map[rowIdx].length - 1 || map[rowIdx][colIdx + 1] !== letter)) {
      rightGroup.add(key)
      total += 1

      let i = 1
      while (i > 0) {
        if (rowIdx + i < map.length && map[rowIdx + i][colIdx] === letter && (colIdx === map[rowIdx].length - 1 || map[rowIdx + i][colIdx + 1] !== letter)) {
          rightGroup.add(`${rowIdx + i}:${colIdx}`)
          i += 1
        } else {
          i = 0
        }
      }
    }

    if (!bottomGroup.has(key) && (rowIdx === map.length - 1 || map[rowIdx + 1][colIdx] !== letter)) {
      bottomGroup.add(key)
      total += 1

      let i = 1
      while (i > 0) {
        if (colIdx + i < map[rowIdx].length && map[rowIdx][colIdx + i] === letter && (rowIdx === map.length - 1 || map[rowIdx + 1][colIdx + i] !== letter)) {
          bottomGroup.add(`${rowIdx}:${colIdx + i}`)
          i += 1
        } else {
          i = 0
        }
      }
    }

    if (!leftGroup.has(key) && (colIdx === 0 || map[rowIdx][colIdx - 1] !== letter)) {
      leftGroup.add(key)
      total += 1

      let i = 1
      while (i > 0) {
        if (rowIdx + i < map.length && map[rowIdx + i][colIdx] === letter && (colIdx === 0 || map[rowIdx + i][colIdx - 1] !== letter)) {
          leftGroup.add(`${rowIdx + i}:${colIdx}`)
          i += 1
        } else {
          i = 0
        }
      }
    } 
  }

  return total * region.length
}

const run = () => {
  const dataArray = fs.readFileSync('./input.txt', 'utf-8').split('\n')
  const data = dataArray.slice(0, dataArray.length - 1)

  const regions = getRegions(data)

  const total1 = regions.reduce((acc, cur) => acc + calculate(cur, data), 0)

  console.log('Part 1 total: ', total1) // 1549354

  const total2 = regions.reduce((acc, cur) => acc + calculateGroups(cur, data), 0)

  console.log('Part 2 total: ', total2) // 937032
}

run()
