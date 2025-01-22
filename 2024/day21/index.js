import * as fs from 'fs'

// +---+---+---+
// | 7 | 8 | 9 |
// +---+---+---+
// | 4 | 5 | 6 |
// +---+---+---+
// | 1 | 2 | 3 |
// +---+---+---+
//     | 0 | A |
//     +---+---+

const numbers = {
  7: { 8: '>', 9: '>>', 4: 'v', 5: 'v>', 6: 'v>>', 1: 'vv', 2: 'vv>', 3: 'vv>>', 0: '>vvv', 'A': '>>vvv' },
  8: { 7: '<', 9: '>', 4: '<v', 5: 'v', 6: 'v>', 1: '<vv', 2: 'vv', 3: 'vv>', 0: 'vvv', 'A': 'vvv>' },
  9: { 7: '<<', 8: '<', 4: '<<v', 5: '<v', 6: 'v', 1: '<<vv', 2: '<vv', 3: 'vv', 0: '<vvv', 'A': 'vvv' },
  4: { 7: '^', 8: '^>', 9: '^>>', 5: '>', 6: '>>', 1: 'v', 2: 'v>', 3: 'v>>', 0: '>vv', 'A': '>>vv' },
  5: { 7: '<^', 8: '^', 9: '^>', 4: '<', 6: '>', 1: '<v', 2: 'v', 3: 'v>', 0: 'vv', 'A': 'vv>' },
  6: { 7: '<<^', 8: '<^', 9: '^', 4: '<<', 5: '<', 1: '<<v', 2: '<v', 3: 'v', 0: '<vv', 'A': 'vv' },
  1: { 7: '^^', 8: '^^>', 9: '^^>>', 4: '^', 5: '^>', 6: '^>>', 2: '>', 3: '>>', 0: '>v', 'A': '>>v' },
  2: { 7: '<^^', 8: '^^', 9: '^^>', 4: '<^', 5: '^', 6: '^>', 1: '<', 3: '>', 0: 'v', 'A': 'v>' },
  3: { 7: '<<^^', 8: '<^^', 9: '^^', 4: '<<^', 5: '<^', 6: '^', 1: '<<', 2: '<', 0: '<v', 'A': 'v' },
  0: { 7: '^^^<', 8: '^^^', 9: '^^^>', 4: '^^<', 5: '^^', 6: '^^>', 1: '^<', 2: '^', 3: '^>', 'A': '>' },
  'A': { 7: '^^^<<', 8: '<^^^', 9: '^^^', 4: '^^<<', 5: '<^^', 6: '^^', 1: '^<<', 2: '<^', 3: '^', 0: '<' },
}

//     +---+---+
//     | ^ | A |
// +---+---+---+
// | < | v | > |
// +---+---+---+

const directions = {
  '^': { 'A': '>', '<': 'v<', 'v': 'v', '>': 'v>' },
  'A': { '^': '<', '<': 'v<<', 'v': '<v', '>': 'v' },
  '<': { '^': '>^', 'A': '>>^', 'v': '>', '>': '>>' },
  'v': { '^': '^', 'A': '^>', '<': '<', '>': '>' },
  '>': { '^': '<^', 'A': '^', '<': '<<', 'v': '<' },
}

const solve = (pin, iterations) => {
  let position = 'A'
  let moves = {}

  let prev = 'A'

  for (let idx = 0; idx < pin.length; idx++) {
    const char = pin[idx]

    const numMoves = (numbers[position][char] ?? '') + 'A'

    for (const move of numMoves) {
      const key = `${prev}-${move}`
      moves[key] = (moves[key] ?? 0) + 1
      prev = move
    }

    position = char
  }

  let idx = 0
  let nextMoves = {}

  while (idx < iterations) {
    idx += 1
    let prev = 'A'

    for (const move in moves) {
      const [from, to] = move.split('-')

      const dirMoves = (directions[from][to] ?? '') + 'A'

      for (const m of dirMoves) {
        const key = `${prev}-${m}`
        nextMoves[key] = (nextMoves[key] ?? 0) + moves[move]
        prev = m
      }
    }

    moves = nextMoves
    nextMoves = {}
  }

  return Object.values(moves).reduce((acc, cur) => acc + cur, 0)
}

const run = () => {
  const dataArray = fs.readFileSync('./input.txt', 'utf-8').split('\n')
  const data = dataArray.slice(0, dataArray.length - 1)

  const total1 = data.reduce((acc, cur) => (
    acc + (solve(cur, 2) * parseInt(cur.substring(0, cur.length - 1)))
  ), 0)

  console.log('Part 1 total: ', total1) // 105458

  const total2 = data.reduce((acc, cur) => (
    acc + (solve(cur, 25) * parseInt(cur.substring(0, cur.length - 1)))
  ), 0)

  console.log('Part 2 total: ', total2) // 129551515895690
}

run()
