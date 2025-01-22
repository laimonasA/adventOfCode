import * as fs from 'fs'

const sequences = {}

const applyFunctions = (num, iterations) => {
  let secret = BigInt(num)
  let prev = parseInt(`${secret}`.slice(-1))
  const deltas = []
  const seen = new Set()

  const fn = (secret, val) => (secret^val) % BigInt(16777216)

  for (let idx = 0; idx < iterations; idx++) {
    secret = fn(secret, secret * BigInt(64))
    secret = fn(secret, secret / BigInt(32))
    secret = fn(secret, secret * BigInt(2048))

    const unit = parseInt(`${secret}`.slice(-1))

    deltas[deltas.length] =  unit - prev
    prev = unit

    const key = deltas.slice(idx - 3, idx + 1).join(',')
    if (idx > 2 && idx < iterations && !seen.has(key)) {
      sequences[key] = (sequences[key] ?? 0) + unit
      seen.add(key)
    }
  }

  return secret
}

const run = () => {
  const dataArray = fs.readFileSync('./input.txt', 'utf-8').split('\n')
  const data = dataArray.slice(0, dataArray.length - 1)

  const total1 = data.reduce((acc, cur) => acc + parseInt(applyFunctions(cur, 2000)), 0)

  console.log('Part 1 total: ', total1) // 16619522798

  const total2 = Object.keys(sequences).reduce((acc, cur) => acc < sequences[cur] ? sequences[cur] : acc, 0)

  console.log('Part 2 total: ', total2) // 1854
}

run()
