import * as fs from 'fs'

const calculateTotals = (start, end) => {
  let total1 = 0
  let total2 = 0

  for (let val = start; val <= end; val++) {
    const valStr = `${val}`
    const valHalf = valStr.length / 2

    if (valStr.substring(0, valHalf) === valStr.substring(valHalf)) {
      total1 += val
      total2 += val
    } else if (isInvalidId(val)) {
      total2 += val
    }
  }

  return [total1, total2]
}

const isInvalidId = (val) => {
  // Values need to be at least 2 digits to be repeating
  if (val < 10) return false

  const valStr = `${val}`
  const valMap = valStr.split('').reduce((acc, cur) => ({ ...acc, [cur]: (acc[cur] ?? 0) + 1}), {})
  const valCounts = Object.values(valMap)
  const minValCount = Math.min(...valCounts)

  // A sequence cannot be repeating if there is a digit only appearing once
  if (minValCount === 1) return false

  // It is a repeating sequence if it is a single value
  if (Object.keys(valMap).length === 1) return true

  const chunkSize = valStr.length / minValCount
  const chunks = {}

  for (let start = 0; start < valStr.length; start += chunkSize) {
    const chunk = valStr.substring(start, start + chunkSize)
    chunks[chunk] = (chunks[chunk] ?? 0) + 1
  }

  return Object.keys(chunks).length === 1
}

const run = () => {
  const dataArray = fs.readFileSync('./input.txt', 'utf-8').split('\n')
  const data = dataArray.slice(0, dataArray.length - 1)[0].split(',')

  const [part1, part2] = data.reduce((acc, cur) => {
    const [start, end] = cur.split('-').map((n) => parseInt(n, 10))

    const [total1, total2] = calculateTotals(start, end)

    return [acc[0] + total1, acc[1] + total2]
  }, [0, 0])

  console.log('Part 1 total: ', part1)

  console.log('Part 2 total: ', part2)
}

run()
