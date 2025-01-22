import * as fs from 'fs'

const getComboValue = (val, a, b, c) => {
  const n = Number(val)
  if (n < 4) return val
  if (n === 4) return a
  if (n === 5) return b
  if (n === 6) return c
  throw new Error('Invalid val')
}

const runInstructions = (ins, a, b = 0, c = 0) => {
  const output = []

  let idx = 0
  let [a1, b1, c1] = [a, b, c].map((n) => BigInt(n))

  while (idx < ins.length - 1) {
    const litVal = BigInt(ins[idx + 1])
    const comVal = getComboValue(litVal, a1, b1, c1)
    
    switch (ins[idx]) {
      case 0:
        a1 = a1 / (BigInt(2)**comVal)
        break
      case 1:
        b1 = b1^litVal
        break
      case 2:
        b1 = comVal % BigInt(8)
        break
      case 3:
        if (a1 === BigInt(0)) break
        idx = Number(litVal)
        continue
      case 4:
        b1 = b1^c1
        break
      case 5:
        output[output.length] = Number(comVal % BigInt(8))
        break
      case 6:
        b1 = a1 / (BigInt(2)**comVal)
        break
      case 7:
        c1 = a1 / (BigInt(2)**comVal)
        break
    }

    idx += 2
  }

  return output
}

const solve = (input) => {
  const powers = new Array(input.length).fill(0)
  powers[powers.length - 1] = 1

  const testString = input.join(',')

  const lastIncorrectIdx = (vals) => {
    const output = runInstructions(input, vals.reduce(
      (acc, cur, idx) => acc + BigInt(cur)*BigInt(8)**BigInt(idx), BigInt(0)
    ))

    if (output.join(',') === testString) {
      return -1
    }

    return output.reduceRight((acc, cur, idx) => cur === input[idx] || acc !== -1 ? acc : idx, -1)
  }

  let lastIdx = lastIncorrectIdx(powers)
  while (lastIdx !== -1) {
    powers[lastIdx] += 1
  
    while (powers.indexOf(8) !== -1) {
      const idx = powers.indexOf(8)
      powers[idx] = 0
      powers[idx + 1] += 1
    }

    lastIdx = lastIncorrectIdx(powers)
  }

  return powers.reduce((acc, cur, idx) => acc + BigInt(cur)*BigInt(8)**BigInt(idx), BigInt(0))
}

const run = () => {
  const data = fs.readFileSync('./input.txt', 'utf-8').split('\n')
  const fn = (str, idx) => idx === 3 ? str.split(',').map((n) => parseInt(n)) : parseInt(str)
  const [a, b, c, ins] = data.filter((l) => l !== '').map((l, idx) => fn(l.split(': ')[1], idx))

  const part1 = runInstructions(ins, BigInt(a), BigInt(b), BigInt(c))

  console.log('Part 1: ', part1.join(',')) // 1,5,0,5,2,0,1,3,5

  const part2 = Number(solve(ins))

  console.log('Part 2: ', part2) // 236581108670061
}

run()
