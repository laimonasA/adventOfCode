import * as fs from 'fs'

const run = () => {
  const dataArray = fs.readFileSync('./input.txt', 'utf-8').split('\n')
  const data = dataArray.slice(0, dataArray.length - 1)

  const START = [0, data[0].indexOf('S'), 1]

  const splitters = {}

  let queue = [START]
  let complete = false

  const routes = {}

  while (!complete) {
    const nextNodes = {}

    while (queue.length !== 0) {
      const currentCoord = queue[0].map((n) => parseInt(n, 10))
      queue = queue.slice(1)

      const currentKey = currentCoord.slice(0, -1).join(':')

      if (currentCoord[0] === data.length) {
        routes[currentKey] = currentCoord[2]
      }

      if (
        currentCoord[0] < 0 ||
        currentCoord[0] === data.length ||
        currentCoord[1] < 0 ||
        currentCoord[1] === data[currentCoord[0]].length
      ) {
        continue
      }

      if (['S', '.'].includes(data[currentCoord[0]][currentCoord[1]])) {
        const nextKey = [currentCoord[0] + 1, currentCoord[1]].join(':')
        nextNodes[nextKey] = (nextNodes[nextKey] || 0) + currentCoord[2]
      } else {

        const leftKey = [currentCoord[0] + 1, currentCoord[1] - 1].join(':')
        const rightKey = [currentCoord[0] + 1, currentCoord[1] + 1].join(':')

        if (!(currentKey in splitters)) {
          splitters[currentKey] = 1
        }

        nextNodes[leftKey] = (nextNodes[leftKey] ?? 0) + currentCoord[2]
        nextNodes[rightKey] = (nextNodes[rightKey] ?? 0) + currentCoord[2]
      }
    }

    if (Object.keys(nextNodes).length !== 0) {
      queue = Object.keys(nextNodes).reduce((acc, cur) => [...acc, [...cur.split(':'), nextNodes[cur]]], [])
    } else {
      complete = true
    }
  }

  const part1 = Object.keys(splitters).length

  console.log('Part 1 total: ', part1)

  const part2 = Object.values(routes).reduce((acc, cur) => acc + cur, 0)

  console.log('Part 2 total: ', part2)
}

run()
