import * as fs from 'fs'

const N_LINKS = 1000

const generateNetworkData = (data) => {
  const networks = []
  const pairs = []

  for (let idx1 = 0; idx1 < data.length; idx1++) {
    networks[networks.length] = { [idx1]: 1 }

    for (let idx2 = idx1 + 1; idx2 < data.length; idx2++) {
      const [x1, y1, z1] = data[idx1].split(',').map((n) => parseInt(n, 10))
      const [x2, y2, z2] = data[idx2].split(',').map((n) => parseInt(n, 10))

      const pairKey = [idx1, idx2].join('-')
      const distance = (x1 - x2)**2 + (y1 - y2)**2 + (z1 - z2)**2

      pairs[pairs.length] = [pairKey, distance]
    }
  }

  const sortedPairs = pairs.toSorted((a, b) => a[1] - b[1]).map((p) => p[0])

  return [networks, sortedPairs]
}

const connectNetwork = (networks, sortedPairs) => {
  let pairIdx = 0
  let linkedNetworks = JSON.parse(JSON.stringify(networks))
  let part1NetworkSize = 0

  while (linkedNetworks.length !== 1) {
    if (pairIdx === N_LINKS) {
      const sortedNetworkSizes = linkedNetworks.map((n) => Object.keys(n).length).toSorted((a, b) => b - a)
      part1NetworkSize = sortedNetworkSizes.slice(0, 3).reduce((acc, cur) => acc * cur, 1)
    }

    const [n1, n2] = sortedPairs[pairIdx].split('-')

    const indexOfNetwork1 = linkedNetworks.findIndex((network) => n1 in network || n2 in network)
    const indexOfNetwork2 = linkedNetworks.findLastIndex((network) => n1 in network || n2 in network)

    if (indexOfNetwork1 === -1) {
      linkedNetworks[linkedNetworks.length] = { [n1]: 1, [n2]: 1 }
    } else if (indexOfNetwork1 !== indexOfNetwork2) {
      linkedNetworks[indexOfNetwork1] = { ...linkedNetworks[indexOfNetwork1], ...linkedNetworks[indexOfNetwork2] }
      linkedNetworks = linkedNetworks.filter((_, idx) => idx !== indexOfNetwork2)
    } else {
      linkedNetworks[indexOfNetwork1][n1] = 1
      linkedNetworks[indexOfNetwork1][n2] = 1
    }

    pairIdx++
  }

  const part2Pair = sortedPairs[pairIdx - 1].split('-').map((n) => parseInt(n, 10))

  return [part1NetworkSize, part2Pair]
}

const run = () => {
  const dataArray = fs.readFileSync('./input.txt', 'utf-8').split('\n')
  const data = dataArray.slice(0, dataArray.length - 1)

  const [networks, sortedPairs] = generateNetworkData(data)

  const [part1, [n1, n2]] = connectNetwork(networks, sortedPairs)

  console.log('Part 1 total: ', part1)

  const part2 = parseInt(data[n1].split(',')[0], 10) * parseInt(data[n2].split(',')[0], 10)

  console.log('Part 2 total: ', part2)
}

run()
