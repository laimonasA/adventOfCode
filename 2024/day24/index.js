import * as fs from 'fs'

const applyOp = (n1, n2, op) => {
  switch (op) {
    case 'AND':
      return n1 & n2
    case 'OR':
      return n1 | n2
    case 'XOR':
      return n1 ^ n2
  }

  throw new Error('Unknown operation!')
}

const evaluate = (values, mapping) => {
  const evaluated = { ...values }
  const known = new Set(Object.keys(values))
  let remaining = Object.keys(mapping)

  while (remaining.length !== 0) {
    remaining = remaining.reduce((acc, cur) => {
      const { vals: [n1, n2], op } = mapping[cur]

      if (known.has(n1) && known.has(n2)) {
        evaluated[cur] = applyOp(evaluated[n1], evaluated[n2], op)
        known.add(cur)

        return acc
      }

      return [...acc, cur]
    }, [])
  }

  return evaluated
}

const getBinaryString = (char, evaluated) => {
  const sortFn = (a, b) => parseInt(a.replace(char, '')) < parseInt(b.replace(char, '')) ? 1 : -1
  const keys = Object.keys(evaluated).filter((val) => val.startsWith(char)).sort(sortFn)

  return keys.map((key) => evaluated[key]).join('')
}

const findClosestZ = (node, targetNodes, mapping) => {
  const zNodes = targetNodes.map((n) => `z${parseInt(n.substring(1)) + 1}`)
  const deps = zNodes.reduce((acc, cur) => ({ ...acc, [cur]: [...mapping[cur].vals] }), {})

  while (Object.values(deps).flat().length !== 0) {
    for (const zNode of zNodes) {
      const nodes = deps[zNode]

      if (nodes.includes(node)) {
        return `z${parseInt(zNode.substring(1)) - 1}`
      }

      const nextNodes = []
      for (const n of nodes) {
        if (n in mapping) {
          nextNodes[nextNodes.length] = mapping[n].vals[0]
          nextNodes[nextNodes.length] = mapping[n].vals[1]
        }
      }
      deps[zNode] = nextNodes
    }
  }
}

const fixAdder = (inputs, originalMapping) => {
  const mapping = JSON.parse(JSON.stringify(originalMapping))

  const sortFn = (a, b) => parseInt(a.substring(1)) < parseInt(b.substring(1)) ? 1 : -1
  const zKeys = Object.keys(mapping).filter((val) => val.startsWith('z')).sort(sortFn)

  const incorrectNodes = Object.keys(mapping).reduce((acc, cur) => {
    const connection = mapping[cur]

    if (cur.startsWith('z') && connection.op !== 'XOR' && cur !== zKeys[0]) {
      return [acc[0], [...acc[1], cur]]
    }

    if (!cur.startsWith('z') && !(connection.vals[0] in inputs) && !(connection.vals[1] in inputs) && connection.op === 'XOR') {
      return [[...acc[0], cur], acc[1]]
    }

    return acc
  }, [[], []])

  for (const node of incorrectNodes[0]) {
    const zNode = findClosestZ(node, incorrectNodes[1], mapping)

    const temp = { ...mapping[zNode] }
    mapping[zNode] = { ...mapping[node] }
    mapping[node] = { ...temp }
  }

  const evaluated = evaluate(inputs, mapping)

  const x = getBinaryString('x', evaluated)
  const y = getBinaryString('y', evaluated)
  const z = getBinaryString('z', evaluated)

  const expected = (parseInt(x, 2) + parseInt(y, 2)).toString(2)

  const diff = z.split('').reduce((acc, cur, idx) => (cur ^ expected[idx]) + acc, '').indexOf(1)

  const remainingIncorrectNodes = Object.keys(mapping).reduce((acc, cur) => {
    const deps = mapping[cur].vals
    return deps.includes(`x${diff}`) && deps.includes(`y${diff}`) ? [...acc, cur] : acc
  }, [])

  return [...incorrectNodes.flat(), ...remainingIncorrectNodes].sort()
}

const run = () => {
  const rawData = fs.readFileSync('./input.txt', 'utf-8')

  const dataArray = (rawData.endsWith('\n') ? rawData.substring(0, rawData.length - 1) : rawData).split('\n\n')
  const [vals, functions] = dataArray.map((d) => d.split('\n'))

  const inputs = vals.reduce((acc, cur) => {
    const [key, val] = cur.split(': ')
    return { ...acc, [key]: parseInt(val) }
  }, {})

  const mapping = functions.reduce((acc, cur) => {
    const [n1, op, n2, _, res] = cur.split(' ')
    return { ...acc, [res]: { vals: [n1, n2], op } }
  }, {})

  const evaluated = evaluate(inputs, mapping)

  const total1 = parseInt(getBinaryString('z', evaluated), 2)

  console.log('Part 1 total: ', total1) // 64755511006320

  const part2 = fixAdder(inputs, mapping).join(',')

  console.log('Part 2 total: ', part2) // djg,dsd,hjm,mcq,sbg,z12,z19,z37
}

run()
