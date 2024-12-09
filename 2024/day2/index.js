import * as fs from 'fs'

const isReportSafe = (levels) => {
  let dir
  for (let idx = 0; idx < levels.length - 1; idx++) {
    const l1 = levels[idx]
    const l2 = levels[idx + 1]

    if (idx === 0) {
      dir = l1 < l2 ? 1 : -1
    }

    if (l1 === l2) return false

    if ((dir === 1 && l1 > l2) || (dir === -1 && l1 < l2)) return false

    const diff = Math.abs(l1 - l2)

    if (diff > 3) return false
  }

  return true
}

const run = () => {
  const dataArray = fs.readFileSync('./input.txt', 'utf-8').split('\n')
  const data = dataArray.slice(0, dataArray.length - 1)

  const part2 = []

  const total1 = data.reduce((acc, cur) => {
    const levels = cur.split(' ').map((n) => parseInt(n))

    const isSafe = isReportSafe(levels)

    if (!isSafe) {
      part2.push(levels)
    }

    return isSafe ? acc + 1 : acc
  }, 0)

  console.log('Part 1 total: ', total1) // 585

  const total2 = part2.reduce((acc, cur) => {
    for (let idx = 0; idx < cur.length; idx++) {
      if (isReportSafe(cur.filter((_, nIdx) => nIdx !== idx))) return acc + 1
    }

    return acc
  }, total1)

  console.log('Part 2 total: ', total2) // 626
}

run()
