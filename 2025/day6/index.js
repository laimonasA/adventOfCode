import * as fs from 'fs'

const run = () => {
  const dataArray = fs.readFileSync('./input.txt', 'utf-8').split('\n')
  const data = dataArray.slice(0, dataArray.length - 1).map((l) => l.replace(/\s+/g, ' ').trim().split(' '))

  const rows = data.slice(0, -1).map((r) => r.map((n) => parseInt(n, 10)))
  const ops = data[data.length - 1]

  const part1Totals = ops.reduce((acc, cur, idx) => {
    let total = cur === '*' ? 1 : 0

    for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
      const number = rows[rowIdx][idx]
      total = cur === '*' ? total * number : total + number
    }

    return [...acc, total]
  }, [])

  const part1 = part1Totals.reduce((acc, cur) => acc + cur, 0)

  console.log('Part 1 total: ', part1)

  const data2 = dataArray.slice(0, dataArray.length - 1)

  const rows2 = data2.slice(0, -1).map((l) => l.split(''))
  const ops2 = data2[data2.length - 1].split('')

  const part2Numbers = ops2.reduce((acc, _, idx) => {
    const newNum = []

    for (let rowIdx = 0; rowIdx < rows2.length; rowIdx++) {
      const num = rows2[rowIdx][idx]
      if (num !== ' ') {
        newNum[newNum.length] = rows2[rowIdx][idx]
      }
    }

    if (newNum.length === 0) return [...acc, []]

    return [...acc.slice(0, -1), [...acc[acc.length - 1], parseInt(newNum.join(''), 10)]]
  }, [[]])

  const part2Totals = []

  for (let idx1 = 0; idx1 < part2Numbers.length; idx1++) {
    const num = part2Numbers[idx1]
    let total = ops[idx1] === '*' ? 1 : 0

    for (let idx2 = 0; idx2 < num.length; idx2++) {
      const number = num[idx2]
      total = ops[idx1] === '*' ? total * number : total + number
    }

    part2Totals[part2Totals.length] = total
  }

  const part2 = part2Totals.reduce((acc, cur) => acc + cur, 0)

  console.log('Part 2 total: ', part2)
}

run()
