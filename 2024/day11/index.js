import * as fs from 'fs'

const LOOPS_1 = 25
const LOOPS_2 = 75

const applyRules = (dict) => {
  const nextDict = {}

  Object.keys(dict).forEach((valStr) => {
    const val = parseInt(valStr)

    if (val === 0) {
      nextDict[1] = (nextDict[1] ?? 0) + dict[val]
    } else if (valStr.length % 2 === 0) {
      const halfIdx = valStr.length / 2

      const h1 = parseInt(valStr.substring(0, halfIdx))
      const h2 = parseInt(valStr.substring(halfIdx))

      nextDict[h1] = (nextDict[h1] ?? 0) + dict[val]
      nextDict[h2] = (nextDict[h2] ?? 0) + dict[val]
    } else {
      const mul = val * 2024
      nextDict[mul] = (nextDict[mul] ?? 0) + dict[val]
    }
  })

  return nextDict
}

const run = () => {
  const dataArray = fs.readFileSync('./input.txt', 'utf-8').split('\n')
  const data = dataArray.slice(0, dataArray.length - 1)[0].split(' ')

  let dict = data.reduce((acc, cur) => ({ ...acc, [cur]: (acc[cur] ?? 0) + 1 }), {})
  let dict1 = {}

  for (let idx = 0; idx < LOOPS_2; idx++) {
    dict = applyRules(dict)

    if (idx === LOOPS_1 - 1) {
      dict1 = { ...dict }
    }
  }

  const total1 = Object.values(dict1).reduce((acc, cur) => acc + cur, 0)

  console.log('Part 1 total: ', total1) // 199753

  const total2 = Object.values(dict).reduce((acc, cur) => acc + cur, 0)

  console.log('Part 2 total: ', total2) // 239413123020116
}

run()
