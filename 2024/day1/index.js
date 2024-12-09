import * as fs from 'fs'

const run = () => {
  const dataArray = fs.readFileSync('./input.txt', 'utf-8').split('\n')
  const data = dataArray.slice(0, dataArray.length - 1)

  const [l1, l2] = data.reduce((acc, cur) => {
    const [x1, x2] = cur.split('   ').map((n) => parseInt(n))
    return [[...acc[0], x1], [...acc[1], x2]]
  }, [[], []])

  l1.sort()
  l2.sort()

  const total1 = l1.reduce((acc, cur, idx) => acc + Math.abs(cur - l2[idx]), 0)

  console.log('Part 1 total: ', total1) // 2904518

  const apps = l2.reduce((acc, cur) => ({ ...acc, [cur]: (acc[cur] ?? 0) + 1 }), {})

  const total2 = l1.reduce((acc, cur) => acc + (cur * (apps[cur] ?? 0)), 0)

  console.log('Part 2 total: ', total2) // 18650129
}

run()
