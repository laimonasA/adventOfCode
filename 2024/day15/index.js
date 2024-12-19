import * as fs from 'fs'

const DIR = {
  '^': [-1, 0],
  '>': [0, 1],
  'v': [1, 0],
  '<': [0, -1],
}

const findStart = (map) => {
  for (let rowIdx = 0; rowIdx < map.length; rowIdx++) {
    const row = map[rowIdx]
    const idx = row.indexOf('@')
    if (idx !== -1) return [rowIdx, idx]
  }
}

const expandMap = (map) => {
  const newMap = []

  for (let rowIdx = 0; rowIdx < map.length; rowIdx++) {
    const newRow = []

    for (let colIdx = 0; colIdx < map[rowIdx].length; colIdx++) {
      switch (map[rowIdx][colIdx]) {
        case '#':
          newRow[colIdx] = ['#', '#']
          break
        case 'O':
          newRow[colIdx] = ['[', ']']
          break
        case '.':
          newRow[colIdx] = ['.', '.']
          break
        case '@':
          newRow[colIdx] = ['@', '.']
          break
      }
    }
    newMap[rowIdx] = newRow.flat()
  }

  return newMap
}

const positionsToMove = (map, pos, dir) => {
  if (dir[0] === 0) {
    const positions = [pos]
    while (['O', '[', ']'].includes(map[pos[0]][pos[1] + dir[1] * positions.length])) {
      positions[positions.length] = [pos[0], pos[1] + dir[1] * positions.length]
    }

    const lastChar = map[pos[0]][pos[1] + dir[1] * positions.length]
    return lastChar === '#' ? [] : positions
  }

  const positions = []
  let posToCheck = [pos]
  while (posToCheck.length !== 0) {
    const [[p1, p2], ...restPos] = posToCheck
    posToCheck = restPos
    positions[positions.length] = [p1, p2]

    const nextChar = map[p1 + dir[0]][p2 + dir[1]]
    if (nextChar === '#') {
      return []
    }

    if (nextChar === 'O') {
      posToCheck[posToCheck.length] = [p1 + dir[0], p2 + dir[1]]
    }

    if (nextChar === '[') {
      posToCheck[posToCheck.length] = [p1 + dir[0], p2 + dir[1]]
      posToCheck[posToCheck.length] = [p1 + dir[0], p2 + dir[1] + 1]
    }

    if (nextChar === ']') {
      posToCheck[posToCheck.length] = [p1 + dir[0], p2 + dir[1]]
      posToCheck[posToCheck.length] = [p1 + dir[0], p2 + dir[1] - 1]
    }
  }

  return positions
}

const solve = (map, instructions, expand = false) => {
  let newMap = expand ? expandMap(map) : map.map((row) => [...row])

  const pos = findStart(newMap)

  for (const ins of instructions) {
    const dir = DIR[ins]

    const positions = positionsToMove(newMap, pos, dir)
    const uniqPos = new Set(positions.map((p) => p.join(':')))

    if (positions.length !== 0) {
      let tempMap = newMap.map((row) => [...row])

      for (const [posRow, posCol] of positions) {
        if (newMap[posRow][posCol] === '@') {
          pos[0] += dir[0]
          pos[1] += dir[1]
        }

        tempMap[posRow + dir[0]][posCol + dir[1]] = newMap[posRow][posCol]

        if (!uniqPos.has([posRow - dir[0], posCol - dir[1]].join(':'))) {
          tempMap[posRow][posCol] = '.'
        }
      }

      newMap = tempMap
    }
  }

  const rowTotalFn = (
    (rowIdx) => (total, char, colIdx) => total + (['O', '['].includes(char) ? 100 * rowIdx + colIdx : 0)
  )

  return newMap.reduce((total, row, rowIdx) => total + row.reduce(rowTotalFn(rowIdx), 0), 0)
}

const run = () => {
  const dataArray = fs.readFileSync('./input.txt', 'utf-8').split('\n\n')
  const [map, inst] = dataArray.map((d) => d.split('\n').filter((l) => l !== '').map((l) => l.split('')))
  const instructions = inst.flat()

  const total1 = solve(map, instructions)

  console.log('Part 1 total: ', total1) // 1511865

  const total2 = solve(map, instructions, true)

  console.log('Part 2 total: ', total2) // 1519991
}

run()
