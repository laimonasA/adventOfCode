import * as fs from 'fs'

const isPossible = (res, vals, part2 = false) => {
  if (vals.length === 1) {
    return res === vals[0]
  }

  const [v1, v2, ...v] = vals

  const addOrMultiply = isPossible(res, [v1 + v2, ...v], part2) || isPossible(res, [v1 * v2, ...v], part2)

  return part2 ? addOrMultiply || isPossible(res, [parseInt(`${v1}${v2}`), ...v], part2) : addOrMultiply
}

const run = () => {
  const dataArray = fs.readFileSync('./input.txt', 'utf-8').split('\n')
  const data = dataArray.slice(0, dataArray.length - 1)

  const [total1, total2] = data.reduce((acc, cur) => {
    const [r, v] = cur.split(': ')
    const res = parseInt(r)
    const vals = v.split(' ').map((n) => parseInt(n))

    const [p1, p2] = [isPossible(res, vals), isPossible(res, vals, true)]

    return [p1 ? acc[0] + res : acc[0], p2 ? acc[1] + res : acc[1]]
  }, [0, 0])

  console.log('Part 1 total: ', total1) // 6231007345478

  console.log('Part 2 total: ', total2) // 333027885676693
}

run()
