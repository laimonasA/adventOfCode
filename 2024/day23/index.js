import * as fs from 'fs'

const findLargestNetwork = (node, connections) => {
  const cache = new Set()
  let largestNetwork = new Set()

  const fn = (network) => {
    for (const connection of connections[node]) {
      const key = [...network, connection].sort().join(',')
  
      if (network.has(connection) || cache.has(key)) continue
  
      let allConnected = true
      for (const n of network) {
        if (!connections[n].has(connection)) {
          allConnected = false
        }
      }
  
      cache.add(key)
  
      if (allConnected) {
        const nextNetwork = new Set([...network, connection])
  
        if (largestNetwork.size < network.size + 1) {
          largestNetwork = nextNetwork
        }
  
        fn(nextNetwork)
      }
    }
  }

  fn(new Set([node]))

  return largestNetwork
}

const buildConnections = (data) => {
  const connections = {}
  const tNodes = new Set()

  for (const conn of data) {
    const [a, b] = conn.split('-')

    if (a in connections) {
      connections[a].add(b)
    } else {
      connections[a] = new Set([b])
    }

    if (b in connections) {
      connections[b].add(a)
    } else {
      connections[b] = new Set([a])
    }

    if (a.startsWith('t')) {
      tNodes.add(a)
    }

    if (b.startsWith('t')) {
      tNodes.add(b)
    }
  }

  return { connections, tNodes }
}

const run = () => {
  const dataArray = fs.readFileSync('./input.txt', 'utf-8').split('\n')
  const data = dataArray.slice(0, dataArray.length - 1)

  const { connections, tNodes } = buildConnections(data)

  const tNetworks = new Set()
  for (const node of tNodes) {
    const conns = [...connections[node]]

    if (conns.length === 1) {
      continue
    }

    for (let i1 = 0; i1 < conns.length - 1; i1++) {
      for (let i2 = i1 + 1; i2 < conns.length; i2++) {
        if (connections[conns[i1]].has(conns[i2])) {
          tNetworks.add([node, conns[i1], conns[i2]].sort().join(','))
        }
      }
    }
  }

  console.log('Part 1 total: ', tNetworks.size) // 1323

  const largestNetwork = [...tNodes].reduce((acc, cur) => {
    const network = findLargestNetwork(cur, connections)
    return network.size > acc.size ? network : acc
  }, new Set())

  console.log('Part 2 total: ', [...largestNetwork].sort().join(',')) // er,fh,fi,ir,kk,lo,lp,qi,ti,vb,xf,ys,yu
}

run()
