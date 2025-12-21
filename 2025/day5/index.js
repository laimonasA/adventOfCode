import * as fs from 'fs'

const mergeRanges = (ranges) => {
  const sortedRanges = ranges.toSorted((a, b) =>
    a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]
  )

  return sortedRanges.reduce((acc, cur, idx) => {
    if (idx === 0) return [cur]

    const [prevStart, prevEnd] = acc[acc.length - 1]
    const [curStart, curEnd] = cur

    if (curStart <= prevEnd + 1) {
      return [...acc.slice(0, -1), [prevStart, Math.max(prevEnd, curEnd)]]
    }

    return [...acc, cur]
  }, [])
}

const run = () => {
  const dataArray = fs.readFileSync('./input.txt', 'utf-8').split('\n\n')

  const [ranges, items] = dataArray.map((b, idx) => {
    const items = b.split('\n')

    if (idx === 0) {
      return items.map((r) => r.split('-').map((n) => parseInt(n, 10)))
    }

    return items.slice(0, -1).map((n) => parseInt(n, 10))
  })

  const part1 = items.filter((i) => ranges.some(([start, end]) => i >= start && i <= end)).length

  console.log('Part 1 total: ', part1)

  const reducedRanges = mergeRanges(ranges)
  const part2 = reducedRanges.reduce((acc, [start, end]) => acc + (end - start + 1), 0)

  console.log('Part 2 total: ', part2)
}

run()
