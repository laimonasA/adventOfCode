import * as fs from 'fs'

const MAP_SIZE = 70
const LINES = 1024

const DIRS = [[-1, 0], [0, 1], [1, 0], [0, -1]]

const findRoute = (blocks) => {
  const startKey = '0,0'
  const scores = { [startKey]: new Set() }
  let queue = [startKey]

  while (queue.length !== 0) {
    const [curKey, ...restQueue] = queue
    queue = restQueue
    const [row, col] = curKey.split(',').map((n) => parseInt(n))

    if (row === MAP_SIZE && col === MAP_SIZE) {
      return scores[curKey]
    }

    for (const dir of DIRS) {
      const nextCoords = [row + dir[0], col + dir[1]]
      const nextKey = nextCoords.join(',')

      if (
        blocks.has(nextKey) || [-1, MAP_SIZE + 1].includes(nextCoords[0]) || [-1, MAP_SIZE + 1].includes(nextCoords[1])
      ) {
        continue
      }

      if (scores[nextKey] === undefined || scores[curKey].size + 1 < scores[nextKey].size) {
        scores[nextKey] = new Set([...scores[curKey], nextKey])
        queue[queue.length] = nextKey
      }
    }
  }

  return new Set()
}

const findRouteBlocker = (nodes, blocks, route) => {
  let [idx, b, r] = [LINES, blocks, route]

  while (r.size !== 0) {
    idx = nodes.findIndex((node) => r.has(node) && !b.has(node))
    b = new Set(nodes.slice(0, idx + 1))
    r = findRoute(b)
  }

  return nodes[idx]
}

const run = () => {
  const dataArray = fs.readFileSync('./input.txt', 'utf-8').split('\n')
  const data = dataArray.slice(0, dataArray.length - 1)

  const blocks = new Set(data.slice(0, LINES))
  const route = findRoute(blocks)

  console.log('Part 1: ', route.size) // 404

  const part2 = findRouteBlocker(data, blocks, route)

  console.log('Part 2: ', part2) // 27,60
}

run()
