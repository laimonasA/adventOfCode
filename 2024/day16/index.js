import * as fs from 'fs'

const findStart = (map) => {
  for (let rowIdx = 0; rowIdx < map.length; rowIdx++) {
    const row = map[rowIdx]
    for (let colIdx = 0; colIdx < row.length; colIdx++) {
      if (row[colIdx] === 'S') {
        return [rowIdx, colIdx]
      }
    }
  }
}

const getValidDirs = (pos, dir, map) => {
  const dirs = dir[0] === 0 ? [[1, 0], [-1, 0]] : [[0, 1], [0, -1]]
  dirs[dirs.length] = dir

  return dirs.filter(([dir1, dir2]) => map[pos[0] + dir1][pos[1] + dir2] !== '#')
}

const solve = (map) => {
  const start = findStart(map)
  const startKey = [...start, 0, 1].join(':')

  const route = {}
  route[startKey] = [0, new Set([start.join(':')])]

  const ends = new Set()

  let best = Infinity
  let queue = [startKey]
  while (queue.length !== 0) {
    const [curKey, ...restQ] = queue
    const [row, col, rowDir, colDir] = curKey.split(':').map((n) => parseInt(n))
    queue = restQ

    if (map[row][col] === 'E') {
      ends.add(curKey)
      best = Math.min(route[curKey][0], best)
      continue
    }

    if (route[curKey][0] >= best) {
      continue
    }

    const dirs = getValidDirs([row, col], [rowDir, colDir], map)

    for (const dir of dirs) {
      const curVal = route[curKey][0]
      const nextKey = [row + dir[0], col + dir[1], dir[0], dir[1]].join(':')

      if (rowDir === dir[0] && colDir === dir[1]) {
        if (curVal + 1 >= best) continue

        if (curVal + 1 < (route[nextKey]?.[0] ?? Infinity)) {
          route[nextKey] = [curVal + 1, new Set([...route[curKey][1], [row + dir[0], col + dir[1]].join(':')])]
          queue[queue.length] = nextKey
        } else if (curVal + 1 === (route[nextKey][0] ?? Infinity)) {
          route[nextKey][1] = new Set([...route[curKey][1], ...route[nextKey][1], [row + dir[0], col + dir[1]].join(':')])
          queue[queue.length] = nextKey
        }
      } else {
        if (curVal + 1001 < (route[nextKey]?.[0] ?? Infinity)) {
          route[nextKey] = [curVal + 1001, new Set([...route[curKey][1], [row + dir[0], col + dir[1]].join(':')])]
          queue[queue.length] = nextKey
        } else if (curVal + 1001 === (route[nextKey][0] ?? Infinity)) {
          route[nextKey][1] = new Set([...route[curKey][1], ...route[nextKey][1], [row + dir[0], col + dir[1]].join(':')])
          queue[queue.length] = nextKey
        }
      }
    }
  }

  return [...ends].reduce((acc, cur) => route[cur][0] < acc[0] ? [route[cur][0], route[cur][1].size] : acc, [Infinity, 0])
}

const run = () => {
  const dataArray = fs.readFileSync('./input.txt', 'utf-8').split('\n')
  const data = dataArray.slice(0, dataArray.length - 1)

  const [total1, total2] = solve(data)

  console.log('Part 1 total: ', total1) // 105496

  console.log('Part 2 total: ', total2) // 524
}

run()
