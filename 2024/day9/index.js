import * as fs from 'fs'

const orderData1 = (data) => {
  const d = JSON.parse(JSON.stringify(data))

  while (true) {
    const spaceIdx = d.findIndex(([n]) => n === -1)
    const numIdx = d.findLastIndex(([n]) => n !== -1)

    if (spaceIdx === d.length - 1 || spaceIdx > numIdx) {
      return d
    }

    const val = [d[numIdx][0], Math.min(d[spaceIdx][1], d[numIdx][1])]
    d.splice(spaceIdx, 0, val)

    d[spaceIdx + 1][1] -= val[1]
    d[numIdx + 1][1] -= val[1]
    d[d.length - 1][1] += val[1]

    if (d[numIdx + 1][1] === 0) {
      d.splice(numIdx + 1, 1)
    }

    if (d[spaceIdx + 1][1] === 0) {
      d.splice(spaceIdx + 1, 1)
    }
  }
}

const orderData2 = (data) => {
  const d = JSON.parse(JSON.stringify(data))

  let id = d.reduce((acc, cur) => Math.max(acc, cur[0]), 0) + 1

  while (id !== 0) {
    id -= 1

    const blockIdx = d.findIndex((block) => block[0] === id)
    const [bId, bCount] = d[blockIdx]

    const spaceIdx = d.findIndex(([n, count]) => n === -1 && count >= bCount)

    if (spaceIdx === -1 || spaceIdx > blockIdx) continue

    d.splice(spaceIdx, 0, [bId, bCount])
    d[spaceIdx + 1][1] -= bCount
    d[blockIdx + 1][0] = -1

    if (d[blockIdx + 1][0] === -1 === d[blockIdx + 2][0]) {
      d[blockIdx + 1][1] += d[blockIdx + 2][1]
      d.splice(blockIdx + 2, 1)
    }

    if (d[blockIdx][0] === -1 === d[blockIdx + 1][0]) {
      d[blockIdx][1] += d[blockIdx + 1][1]
      d.splice(blockIdx + 1, 1)
    }
  }

  return d
}

const calculateTotal = (data) =>
  data.reduce((acc, [id, count]) => {
    let total = 0
    let newIdx = acc[1]

    for (let idx = 0; idx < count; idx++) {
      if (id !== -1) {
        total += newIdx * id
      }
      newIdx += 1
    }

    return [acc[0] + total, newIdx]
  }, [0, 0])[0]


const run = () => {
  const dataArray = fs.readFileSync('./input.txt', 'utf-8').split('\n')
  const data = dataArray.slice(0, dataArray.length - 1)[0]

  const structured = data.split('').reduce((acc, cur, idx) => (
    [...acc, [idx % 2 === 0 ? (acc.length / 2) : -1, parseInt(cur)]]
  ), [])

  if (structured[structured.length - 1][0] !== -1) {
    structured[structured.length] = [-1, 0]
  }

  const total1 = calculateTotal(orderData1(structured))

  console.log('Part 1 total: ', total1) // 6398608069280

  const total2 = calculateTotal(orderData2(structured))

  console.log('Part 2 total: ', total2) // 6427437134372
}

run()
