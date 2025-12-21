import * as fs from 'fs'

const run = () => {
  const dataArray = fs.readFileSync('./input.txt', 'utf-8').split('\n\n')

  const shapes = dataArray.slice(0, dataArray.length - 1).map((s) => s.split('\n').slice(1))
  const gridData = dataArray[dataArray.length - 1].split('\n').slice(0, -1)

  const shapesCount = shapes.map((shape) => shape.join('').split('').filter((s) => s === '#').length)

  const possibleGrids = gridData.filter((g) => {
    const [dims, shapeC] = g.split(': ')
    const [x, y] = dims.split('x').map((d) => parseInt(d, 10))
    const gridSize = x * y

    const requiredSpace = shapeC.split(' ').reduce((acc, cur, idx) => (
      acc + (shapesCount[idx] * parseInt(cur, 10))
    ), 0)

    return (requiredSpace / gridSize) < 1
  })

  const part1 = possibleGrids.length

  console.log('Part 1 total: ', part1)
}

run()
