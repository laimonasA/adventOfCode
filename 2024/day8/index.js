import * as fs from 'fs'

const generateMapping = (data) => {
  const locations = {}

  for (let rowIdx = 0; rowIdx < data.length; rowIdx++) {
    const row = data[rowIdx]

    for (let colIdx = 0; colIdx < row.length; colIdx++) {
      const char = row[colIdx]

      if (char === '.') continue

      locations[char] = [...(locations[char] ?? []), [rowIdx, colIdx]]
    }
  }

  return locations
}

const solve = (map, locations) => {
  const p1States = new Set()
  const p2States = new Set()

  Object.keys(locations).forEach((char) => {
    for (let p1Idx = 0; p1Idx < locations[char].length - 1; p1Idx++) {
      const [row1, col1] = locations[char][p1Idx]

      for (let p2Idx = p1Idx + 1; p2Idx < locations[char].length; p2Idx++) {
        const [row2, col2] = locations[char][p2Idx]

        const [rowDiff, colDiff] = [row2 - row1, col2 - col1]

        let [rowPrev, colPrev] = [row1, col1]
        let idx = 0

        while (rowPrev >= 0 && rowPrev < map.length && colPrev >= 0 && colPrev < map[rowPrev].length) {
          if (idx === 1) {
            p1States.add(`${rowPrev}:${colPrev}`)
          }

          p2States.add(`${rowPrev}:${colPrev}`)

          rowPrev -= rowDiff
          colPrev -= colDiff
          idx += 1
        }
        
        let [rowNext, colNext] = [row2, col2]
        idx = 0

        while (rowNext >= 0 && rowNext < map.length && colNext >= 0 && colNext < map[rowNext].length) {
          if (idx === 1) {
            p1States.add(`${rowNext}:${colNext}`)
          }

          p2States.add(`${rowNext}:${colNext}`)

          rowNext += rowDiff
          colNext += colDiff
          idx += 1
        }
      }
    }
  })

  return [p1States.size, p2States.size]
}

const run = () => {
  const dataArray = fs.readFileSync('./input.txt', 'utf-8').split('\n')
  const data = dataArray.slice(0, dataArray.length - 1)

  const locations = generateMapping(data)

  const [total1, total2] = solve(data, locations)

  console.log('Part 1 total: ', total1) // 369

  console.log('Part 2 total: ', total2) // 1169
}

run()
