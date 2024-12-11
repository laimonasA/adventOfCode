import * as fs from 'fs'

const getStartingPositions = (map) => {
  const positions = []

  for (let rowIdx = 0; rowIdx < map.length; rowIdx++) {
    const row = map[rowIdx]

    for (let colIdx = 0; colIdx < row.length; colIdx++) {
      if (row[colIdx] === 0) {
        positions[positions.length] = [rowIdx, colIdx]
      }
    }
  }

  return positions
}

const findTrails = (position, map) => {
  let queue = [position]
  const finishes = new Set()
  let trails = 0

  while (queue.length !== 0) {
    const [[rowIdx, colIdx], ...restQueue] = queue
    queue = restQueue

    const val = map[rowIdx][colIdx]

    if (val === 9) {
      finishes.add(`${rowIdx}:${colIdx}`)
      trails += 1
      continue
    }

    if (rowIdx > 0 && map[rowIdx - 1][colIdx] === val + 1) {
      queue[queue.length] = [rowIdx - 1, colIdx]
    }

    if (rowIdx < map.length - 1 && map[rowIdx + 1][colIdx] === val + 1) {
      queue[queue.length] = [rowIdx + 1, colIdx]
    }

    if (colIdx > 0 && map[rowIdx][colIdx - 1] === val + 1) {
      queue[queue.length] = [rowIdx, colIdx - 1]
    }

    if (colIdx < map[rowIdx].length - 1 && map[rowIdx][colIdx + 1] === val + 1) {
      queue[queue.length] = [rowIdx, colIdx + 1]
    }
  }

  return [finishes.size, trails]
}

const run = () => {
  const dataArray = fs.readFileSync('./input.txt', 'utf-8').split('\n')
  const data = dataArray.slice(0, dataArray.length - 1).map((l) => l.split('').map((n) => parseInt(n)))

  const [total1, total2] = getStartingPositions(data).reduce((acc, cur) => {
    const [t1, t2] = findTrails(cur, data)

    return [acc[0] + t1, acc[1] + t2]
  }, [0, 0])

  console.log('Part 1 total: ', total1) // 644

  console.log('Part 2 total: ', total2) // 1366
}

run()
