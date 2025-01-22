import * as fs from 'fs'

const cache = {}

const isPossible = (combination, options) => {
  if (combination === '') return 1

  if (cache[combination] !== undefined) return cache[combination]

  for (const option of options) {
    if (combination.startsWith(option)) {
      cache[combination] = (cache[combination] ?? 0) + isPossible(combination.substring(option.length), options)
    }
  }

  return cache[combination] ?? 0
}

const run = () => {
  const dataArray = fs.readFileSync('./input.txt', 'utf-8').split('\n\n')
  const [options, data] = dataArray
  const opts = options.split(', ')
  const list = data.split('\n').filter((l) => l !== '')

  const possibilities = list.reduce((acc, cur) => isPossible(cur, opts) ? [...acc, cur] : acc, [])

  const total1 = possibilities.length

  console.log('Part 1 total: ', total1) // 350

  const total2 = possibilities.reduce((acc, cur) => acc + cache[cur], 0)

  console.log('Part 2 total: ', total2) // 769668867512623
}

run()
