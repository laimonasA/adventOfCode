import * as fs from 'fs'

const PART_2_LIMIT = 12

const findMax = (nums, max = 0, step = 0) => {
  if (step === PART_2_LIMIT) return max

  const startOfNums = nums.slice(0, (-PART_2_LIMIT + 1 + step) || undefined)
  const maxNum = Math.max(...startOfNums)
  const maxNumIndexes = startOfNums.reduce((acc, cur, idx) => cur === maxNum ? [...acc, idx] : acc, [])

  const newMax = parseInt(`${max}${maxNum}`, 10)
  const nextStep = maxNumIndexes.map((idx) => findMax(nums.slice(idx + 1), newMax, step + 1))

  return Math.max(...nextStep)
}

const run = () => {
  const dataArray = fs.readFileSync('./input.txt', 'utf-8').split('\n')
  const data = dataArray.slice(0, dataArray.length - 1)

  const part1 = data.reduce((acc, cur) => {
    const nums = cur.split('').map((n) => parseInt(n, 10))

    const max = Math.max(...nums)
    const indexOfMax = nums.indexOf(max)

    const max1 = indexOfMax === nums.length - 1 ? Math.max(...nums.slice(0, -1)) : max
    const indexOfMax1 = nums.indexOf(max1)

    const max2 = Math.max(...nums.slice(indexOfMax1 + 1))

    return acc + parseInt(`${max1}${max2}`, 10)
  }, 0)

  console.log('Part 1 total: ', part1)

  const part2 = data.reduce((acc, cur) => acc + findMax(cur.split('').map((n) => parseInt(n, 10))), 0)

  console.log('Part 2 total: ', part2)
}

run()
