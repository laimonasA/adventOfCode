import * as fs from 'fs'

const run = () => {
  const rawData = fs.readFileSync('./input.txt', 'utf-8')

  const dataArray = (rawData.endsWith('\n') ? rawData.substring(0, rawData.length - 1) : rawData).split('\n\n')
  const data = dataArray.map((d) => d.split('\n'))

  const lockSize = data[0].length - 1

  const [locks, keys] = data.reduce((acc, cur) => {
    const item = []
    for (let rowIdx = 1; rowIdx < cur.length - 1; rowIdx++) {
      for (let colIdx = 0; colIdx < cur[rowIdx].length; colIdx++) {
        item[colIdx] = (item[colIdx] ?? 0) + (cur[rowIdx][colIdx] === '#' ? 1 : 0)
      }
    }

    return cur[0].includes('.') ? [acc[0], [...acc[1], item]] : [[...acc[0], item], acc[1]]
  }, [[], []])

  const total = locks.reduce((acc, cur) => (
    acc + keys.filter((key) => !cur.some((pins, idx) => pins + key[idx] >= lockSize)).length
  ), 0)

  console.log('Total: ', total) // 3077
}

run()
