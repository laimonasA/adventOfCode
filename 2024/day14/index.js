import * as fs from 'fs'

const ROWS = 103
const COLS = 101
const LOOPS = 100

const R_HALF = Math.floor(ROWS / 2)
const C_HALF = Math.floor(COLS / 2)

const solve = (data) => (
  data.reduce((acc, cur) => {
    const [[col, row], [vCol, vRow]] = cur

    const r = (row + (vRow * LOOPS)) % ROWS
    const c = (col + (vCol * LOOPS)) % COLS

    const newRow = r < 0 ? r + ROWS : r
    const newCol = c < 0 ? c + COLS : c

    if (newRow < R_HALF) {
      if (newCol < C_HALF) return [acc[0] + 1, acc[1], acc[2], acc[3]]
      if (newCol > C_HALF) return [acc[0], acc[1] + 1, acc[2], acc[3]]
    }

    if (newRow > R_HALF) {
      if (newCol < C_HALF) return [acc[0], acc[1], acc[2] + 1, acc[3]]
      if (newCol > C_HALF) return [acc[0], acc[1], acc[2], acc[3] + 1]
    }

    return acc
  }, [0, 0, 0, 0]).reduce((acc, cur) => acc * cur, 1)
)

const findTree = (data) => {
  let i = 0

  while (true) {
    i += 1

    const positions = new Set()
    const groupings = {}

    for (const [[col, row], [vCol, vRow]] of data) {
      const r = (row + (vRow * i)) % ROWS
      const c = (col + (vCol * i)) % COLS

      const newRow = r < 0 ? r + ROWS : r
      const newCol = c < 0 ? c + COLS : c

      positions.add(`${newRow}:${newCol}`)

      if (groupings[newCol]) {
        groupings[newCol].add(newRow)
      } else {
        groupings[newCol] = new Set([newRow])
      }
    }

    if (Object.values(groupings).filter((v) => v.size > 32).length > 1) {
      return [i, positions]
    }
  }
}

const run = () => {
  const dataArray = fs.readFileSync('./input.txt', 'utf-8').split('\n')
  const d = dataArray.slice(0, dataArray.length - 1)
  const data = d.map((l) => l.split(' ').map((pv) => pv.split('=')[1].split(',').map((n) => parseInt(n))))

  const total1 = solve(data)

  console.log('Part 1 total: ', total1) // 231221760

  const [treeIdx, positions] = findTree(data)

  console.log('Part 2: ', treeIdx) // 6771

  for (let rowIdx = 0; rowIdx < ROWS; rowIdx++) {
    const row = [rowIdx]

    for (let colIdx = 0; colIdx < COLS; colIdx++) {
      row[row.length] = positions.has(`${rowIdx}:${colIdx}`) ? '#' : ' '
    }

    console.log(row.join(''))
  }
}

run()
