import * as fs from 'fs'

const findStart = (map) => {
  for (let rowIdx = 0; rowIdx < map.length; rowIdx++) {
    const row = map[rowIdx]

    for (let colIdx = 0; colIdx < row.length; colIdx++) {
      if (row[colIdx] === '^') return [[rowIdx, colIdx], [-1, 0]]
      if (row[colIdx] === '>') return [[rowIdx, colIdx], [0, 1]]
      if (row[colIdx] === 'v') return [[rowIdx, colIdx], [1, 0]]
      if (row[colIdx] === '<') return [[rowIdx, colIdx], [0, -1]]
    }
  }
}

const traverseMap = (map, startCoords, startDir) => {
  const visited = new Set([startCoords.join(':')])
  const states = new Set([`${startCoords.join(':')}:${startDir.join(':')}`])

  let [rowIdx, colIdx] = startCoords
  let [rowDir, colDir] = startDir

  while (true) {
    if (map[rowIdx + rowDir][colIdx + colDir] === '#') {
      if (rowDir === -1) {
        rowDir = 0
        colDir = 1
      } else if (colDir === 1) {
        rowDir = 1
        colDir = 0
      } else if (rowDir === 1) {
        rowDir = 0
        colDir = -1
      } else {
        rowDir = -1
        colDir = 0
      }
    } else {
      rowIdx += rowDir
      colIdx += colDir
    }

    visited.add([rowIdx, colIdx].join(':'))
    states.add(`${[rowIdx, colIdx].join(':')}:${rowDir}:${colDir}`)

    const nextRowIdx = rowIdx + rowDir
    const nextColIdx = colIdx + colDir
    if (nextRowIdx < 0 || nextRowIdx === map.length || nextColIdx < 0 || nextColIdx === map[nextRowIdx].length) {
      return visited
    }

    if (states.has(`${nextRowIdx}:${nextColIdx}:${rowDir}:${colDir}`)) {
      return new Set()
    }
  }
}

const run = () => {
  const dataArray = fs.readFileSync('./input.txt', 'utf-8').split('\n')
  const data = dataArray.slice(0, dataArray.length - 1)

  const [startCoords, startDir] = findStart(data)

  const visited = traverseMap(data, startCoords, startDir)

  console.log('Part 1 total: ', visited.size) // 4789

  const map = data.map((row) => row.split(''))

  const potentialPositions = [...visited].filter((p) => p !== startCoords.join(':'))

  const total2 = potentialPositions.reduce((acc, cur) => {
    const [pRow, pCol] = cur.split(':').map((n) => parseInt(n))

    map[pRow][pCol] = '#'
    const hasLoop = traverseMap(map, startCoords, startDir).size === 0
    map[pRow][pCol] = '.'

    return acc + (hasLoop ? 1 : 0)
  }, 0)

  console.log('Part 2 total: ', total2) // 1304
}

run()
