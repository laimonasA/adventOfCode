import * as fs from 'fs'

const PART_1_START = 'you'
const PART_2_START = 'svr'
const END = 'out'
const TARGET_NODES = ['dac', 'fft']

const calculate = (network, part2 = false) => {
  const cache = {}

  const dfs = (node, seenTargets) => {
    const nextTargets = [...seenTargets]

    if (part2 && TARGET_NODES.includes(node)) {
      nextTargets[TARGET_NODES.indexOf(node)] = 1
    }

    const key = [node, ...nextTargets].join(':')

    if (node === END) {
      if (!part2) return 1

      return seenTargets.reduce((acc, cur) => acc + cur, 0) === TARGET_NODES.length ? 1 : 0
    }

    if (key in cache) return cache[key]

    cache[key] = network[node].reduce(((acc, cur) => acc + dfs(cur, nextTargets)), 0)

    return cache[key]
  }

  const start = part2 ? PART_2_START : PART_1_START
  const targets = part2 ? TARGET_NODES.map(() => 0) : []
  
  return dfs(start, targets)
}

const run = () => {
  const dataArray = fs.readFileSync('./input.txt', 'utf-8').split('\n')
  const data = dataArray.slice(0, dataArray.length - 1)

  const network = data.reduce((acc, cur) => {
    const [node, paths] = cur.split(':').map((p) => p.trim())

    return { ...acc, [node]: paths.split(' ') }
  }, {})

  const part1 = calculate(network)

  console.log('Part 1 total: ', part1)

  const part2 = calculate(network, true)

  console.log('Part 2 total: ', part2)
}

run()
