import * as fs from 'fs'

const findPart1 = (target, buttons) => {
  const buttonPressResults = buttons.map((b) => target.split('').map((_, idx) => b.includes(idx) ? '1' : '0').join(''))

  const initialButtonsPressed = buttons.map(() => 0)
  const seenCombinations = { [initialButtonsPressed.join(':')]: 1 }

  let queue = [initialButtonsPressed]
  const possibleCombinations = []

  while (queue.length !== 0) {
    const [curButtonsPressed, ...restQueue] = queue

    for (let btnIdx = 0; btnIdx < buttons.length; btnIdx++) {
      if (curButtonsPressed[btnIdx]) {
        continue
      }

      const nextButtonsPressed = [...curButtonsPressed]
      nextButtonsPressed[btnIdx] = 1
      const nextButtonsPressedKey = nextButtonsPressed.join(':')

      if (nextButtonsPressedKey in seenCombinations) {
        continue
      }

      const result = nextButtonsPressed.reduce((acc, cur, idx) => (
        cur === 0 ? acc : acc ^ parseInt(buttonPressResults[idx], 2)
      ), 0)

      if (result === parseInt(target, 2)) {
        possibleCombinations[possibleCombinations.length] = nextButtonsPressed
      }

      seenCombinations[nextButtonsPressedKey] = 1
      restQueue[restQueue.length] = nextButtonsPressed
    }

    queue = [...restQueue]
  }

  return possibleCombinations
}

const findPart2 = (acc, [_, buttons, target]) => {
  const finalState = target.map(() => 0).join(',')

  const cache = {}
  const buttonCombinationsCache = {}
  const buttonPressCache = {}

  const getStateFromButtonsPressed = (buttonsPressed) => {
    const buttonsPressedKey = buttonsPressed.join(':')

    if (buttonsPressedKey in buttonPressCache) {
      return buttonPressCache[buttonsPressedKey]
    }

    const presses = target.map(() => 0)

    buttonsPressed.forEach((button, idx) => {
      if (button) {
        buttons[idx].forEach((stateX) => {
          presses[stateX] += 1
        })
      }
    })

    buttonPressCache[buttonsPressedKey] = presses

    return buttonPressCache[buttonsPressedKey]
  }

  const search = (state) => {
    const stateKey = state.join(',')

    if (stateKey.includes('-')) return Infinity

    if (stateKey === finalState) return 0

    if (stateKey in cache) return cache[stateKey]

    const binaryTarget = state.map((t) => t % 2).join('')

    const buttonCombinations = buttonCombinationsCache[binaryTarget] ??= findPart1(binaryTarget, buttons)
    const nextStates = []

    for (let combIdx = 0; combIdx < buttonCombinations.length; combIdx++) {
      const buttonCombination = buttonCombinations[combIdx]
      const numButtonsPressed = buttonCombination.filter((b) => b).length

      const resState = getStateFromButtonsPressed(buttonCombination)
      nextStates[nextStates.length] = [state.map((p, idx) => (p - resState[idx]) / 2), numButtonsPressed]
    }

    if (!binaryTarget.includes('1')) {
      nextStates[nextStates.length] = [state.map((p) => p / 2), 0]
    }

    cache[stateKey] = Math.min(...nextStates.map(([s, count]) => 2 * search(s) + count))
    
    return cache[stateKey]
  }

  return acc + search(target)
}

const run = () => {
  const dataArray = fs.readFileSync('./input.txt', 'utf-8').split('\n')
  const data = dataArray.slice(0, dataArray.length - 1)

  const parsedData = data.reduce((acc, cur) => {
    const [t, restLine] = cur.slice(1).split(']')
    const [restButtons, r] = restLine.slice(0, -1).split('{')
    const b = restButtons.trim().split(' ')

    const target = t.split('').map((v) => v === '.' ? 0 : 1).join('')
    const buttons = b.map((b) => b.slice(1, -1).split(',').map((p) => parseInt(p, 10)))
    const reqs = r.split(',').map((n) => parseInt(n, 10))

    return [...acc, [target, buttons, reqs]]
  }, [])

  const part1 = parsedData.reduce((acc, [target, buttons]) => (
    acc + findPart1(target, buttons)[0].filter((b) => b === 1).length
  ), 0)

  console.log('Part 1 total: ', part1)

  const part2 = parsedData.reduce(findPart2, 0)

  console.log('Part 2 total: ', part2)
}

run()
