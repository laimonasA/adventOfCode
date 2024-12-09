import * as fs from 'fs'

const isDataValid = (data, rules) => {
  for (let idx = 0; idx < data.length; idx++) {
    const char = data[idx]

    for (let nIdx = 1; nIdx < data.length - idx; nIdx++) {
      const nChar = data[idx + nIdx]

      if (rules[nChar]?.includes(char)) {
        return false
      }
    }
  }

  return true
}

const findMiddleValue = (data) => data[Math.floor(data.length / 2)]

const getSortingFn = (rules) => (a, b) => {
  if (rules[a]?.includes(b)) return -1
  if (rules[b]?.includes(a)) return 1
  return 0
}


const run = () => {
  const [rulesString, dataString] = fs.readFileSync('./input.txt', 'utf-8').split('\n\n')

  const rules = rulesString.split('\n').map((r) => r.split('|').map((n) => parseInt(n)))

  const dataArray = dataString.split('\n')
  const data = dataArray.slice(0, dataArray.length - 1).map((d) => d.split(',').map((n) => parseInt(n)))

  const mapping = rules.reduce((acc, [pre, post]) => ({ ...acc, [pre]: [...(acc[pre] ?? []), post] }), {})

  const [total1, incorrectData] = data.reduce((acc, cur) =>
    isDataValid(cur, mapping) ? [acc[0] + findMiddleValue(cur), acc[1]] : [acc[0], [...acc[1], cur]], [0, []]
  )

  console.log('Part 1 total: ', total1) // 4462

  const sortingFn = getSortingFn(mapping)

  const total2 = incorrectData.map((d) => d.toSorted(sortingFn)).reduce((acc, cur) => acc + findMiddleValue(cur), 0)

  console.log('Part 2 total: ', total2) // 6767
}

run()
