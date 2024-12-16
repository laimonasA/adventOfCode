import * as fs from 'fs'

const solve = ([x1, y1], [x2, y2], [res1, res2], limit = Infinity) => {
  const x = (res1 * y2 - res2 * x2) / (x1 * y2 - y1 * x2)

  if (x !== parseInt(x) || x > limit) return 0

  const y = (res1 - (x1 * x)) / x2

  return y > limit ? 0 : x * 3 + y
}

const run = () => {
  const dataArray = fs.readFileSync('./input.txt', 'utf-8').split('\n\n')
  const data = dataArray.map((g) => g.split('\n').filter((l) => l !== ''))

  const [total1, total2] = data.reduce((acc, cur) => {
    const [a, b, tar] = cur.map((l) => l.split(': ')[1])

    const [n1, n2] = [a, b].map(((n) => n.split('+').map((d) => parseInt(d)).filter((n) => !isNaN(n))))
    const res = tar.split(', ').map((r) => r.split('=')[1]).map((n) => parseInt(n))
    const res2 = res.map((n) => n + 10000000000000)

    return [acc[0] + solve(n1, n2, res, 100), acc[1] + solve(n1, n2, res2)]
  }, [0, 0])

  console.log('Part 1 total: ', total1) // 27105

  console.log('Part 2 total: ', total2) // 101726882250942
}

run()
