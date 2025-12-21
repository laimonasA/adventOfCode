import * as fs from 'fs'

const START_POS = 50
const LIMIT = 99 + 1

const run = () => {
  const dataArray = fs.readFileSync('./input.txt', 'utf-8').split('\n')
  const data = dataArray.slice(0, dataArray.length - 1)

  const [_, part1, part2] = data.reduce(([total, count1, count2], cur) => {
    const dir = cur.substring(0, 1)
    const num = parseInt(cur.substring(1), 10)

    const rounds = Math.floor(num / LIMIT)
    const reducedNum = num % LIMIT

    if (dir === "L") {
      const newTotal = total - reducedNum
      const nextTotal = newTotal < 0 ? LIMIT - Math.abs(newTotal % LIMIT) : newTotal % LIMIT

      const finishedOnZero = newTotal % LIMIT === 0 ? 1 : 0
      const extraRound = total !== 0 && newTotal !== nextTotal ? 1 : 0
      
      return [nextTotal, count1 + finishedOnZero, count2 + finishedOnZero + rounds + extraRound]
    } else {
      const newTotal = total + num
      const nextTotal = newTotal % LIMIT

      const finishedOnZero = nextTotal === 0 ? 1 : 0
      const extraRounds = newTotal >= LIMIT ? Math.floor(newTotal / LIMIT) : 0

      return [nextTotal, count1 + finishedOnZero, count2 + extraRounds]
    }
  }, [START_POS, 0, 0])

  console.log('Part 1 total: ', part1)

  console.log('Part 2 total: ', part2)
}

run()
