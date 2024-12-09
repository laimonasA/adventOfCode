import * as fs from 'fs'

const reg = /mul\(([0-9]|[1-9][0-9]|[1-9][0-9][0-9]),([0-9]|[1-9][0-9]|[1-9][0-9][0-9])\)/
const doReg = /do\(\)/
const dontReg = /don't\(\)/

const findNumbers = (string, part2 = false) => {
  let total = 0
  let str = string
  let enabled = true

  while (str.search(reg) !== -1) {
    const matchPos = str.search(reg)
    const doPos = part2 ? str.search(doReg) : -1
    const dontPos = part2 ? str.search(dontReg) : -1

    if ((matchPos < doPos || doPos === -1) && (matchPos < dontPos || dontPos === -1)) {
      if (enabled) {
        const [match] = reg.exec(str)
        const [n1, n2] = match.replace('mul(', '').replace(')', '').split(',').map((n) => parseInt(n))
        total += n1 * n2
      }

      str = str.replace(reg, '')
    } else if (doPos !== -1 && doPos < matchPos && (doPos < dontPos || dontPos === -1)) {
      enabled = true
      str = str.replace(doReg, '')
    } else if (dontPos !== -1 && dontPos < matchPos && (dontPos < doPos || doPos === -1)) {
      enabled = false
      str = str.replace(dontReg, '')
    }
  }

  return total
}

const run = () => {
  const data = fs.readFileSync('./input.txt', 'utf-8').replace('\n', '')

  console.log('Part 1 total: ', findNumbers(data)) // 178886550

  console.log('Part 2 total: ', findNumbers(data, true)) // 87163705
}

run()
