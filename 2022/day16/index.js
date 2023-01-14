import * as fs from "fs";

const START = "AA";

const TIME_LIMITS = [30, 26];

const getPathKey = (v1, v2) => (v1 < v2 ? `${v1}-${v2}` : `${v2}-${v1}`);

const getAllValveData = (data) => {
  const allValves = {};
  const valvesNotWorthOpening = [];

  for (let valveIdx = 0; valveIdx < data.length; valveIdx++) {
    const [valveAndRate, tunnels] = data[valveIdx].split("; ");

    const valve = valveAndRate.split(" ")[1];
    const rate = Number(valveAndRate.split("=")[1]);

    const paths = new Set(
      (tunnels.split(" valves ")[1] || tunnels.split(" valve ")[1]).split(", ")
    );

    allValves[valve] = { rate, paths };

    if (rate === 0) {
      valvesNotWorthOpening[valvesNotWorthOpening.length] = valve;
    }
  }

  return { allValves, valvesNotWorthOpening };
};

const buildGraph = (data) => {
  const { allValves, valvesNotWorthOpening } = getAllValveData(data);

  const graph = {};

  const allValveKeys = Object.keys(allValves);
  for (let valveIdx = 0; valveIdx < allValveKeys.length; valveIdx++) {
    const valve = allValveKeys[valveIdx];

    const pathsFromValve = [...allValves[valve].paths];

    for (
      let adjacentValveIdx = 0;
      adjacentValveIdx < pathsFromValve.length;
      adjacentValveIdx++
    ) {
      const adjacentValve = pathsFromValve[adjacentValveIdx];

      const pathKey = getPathKey(valve, adjacentValve);

      if (!graph[pathKey]) {
        graph[pathKey] = 1;
      }
    }
  }

  let hasUpdatedGraph = true;
  let notWorthOpening = [...valvesNotWorthOpening];
  while (hasUpdatedGraph) {
    hasUpdatedGraph = false;

    for (let valveIdx = 0; valveIdx < notWorthOpening.length; valveIdx++) {
      const valve = notWorthOpening[valveIdx];

      if (valve === START) {
        continue;
      }

      const pathsFromValve = [...allValves[valve].paths];

      for (
        let adjacentValveIdx = 0;
        adjacentValveIdx < pathsFromValve.length;
        adjacentValveIdx++
      ) {
        const adjacentValve = pathsFromValve[adjacentValveIdx];
        const pathKey = getPathKey(valve, adjacentValve);

        allValves[valve].paths.delete(adjacentValve);
        allValves[adjacentValve].paths.delete(valve);

        if (adjacentValveIdx < pathsFromValve.length - 1) {
          const connectedValve = pathsFromValve[adjacentValveIdx + 1];
          const connectedPathKey = getPathKey(adjacentValve, connectedValve);

          const conKey = getPathKey(valve, connectedValve);

          if (!graph[connectedPathKey]) {
            graph[connectedPathKey] = graph[pathKey] + graph[conKey];
          }

          allValves[valve].paths.delete(connectedValve);
          allValves[adjacentValve].paths.add(connectedValve);
          allValves[connectedValve].paths.add(adjacentValve);
          allValves[connectedValve].paths.delete(valve);
        }

        delete graph[pathKey];
      }

      if (!Object.keys(graph).some((path) => path.includes(valve))) {
        notWorthOpening = notWorthOpening.filter((v) => v !== valve);
        delete allValves[valve];
      }

      hasUpdatedGraph = true;
    }
  }

  Object.keys(graph).forEach((path) => {
    graph[path] = graph[path] + 1;
  });

  return { graph, allValves };
};

const reduceAndBuildGraph = (data) => {
  const { graph, allValves } = buildGraph(data);

  const valveKeys = Object.keys(allValves);

  const valveRates = valveKeys.reduce((acc, cur) => {
    for (let valveIdx = 0; valveIdx < valveKeys.length; valveIdx++) {
      const valve = valveKeys[valveIdx];

      const valveKey = getPathKey(cur, valve);
      if (cur !== valve && !graph[valveKey]) {
        graph[valveKey] = Infinity;
      }
    }

    return cur === START ? acc : { ...acc, [cur]: allValves[cur].rate };
  }, {});

  const findClosestValve = (start, queue) =>
    queue.reduce((acc, cur) => {
      const accKey = getPathKey(start, acc);
      const curKey = getPathKey(start, cur);

      return graph[accKey] < graph[curKey] ? acc : cur;
    }, queue[0]);

  const dijkstra = (start, q) => {
    let queue = [...q];

    if (queue.length === 0) {
      return;
    }

    let closestValve = findClosestValve(start, queue);

    while (closestValve) {
      const pathKeyToClosestValve = getPathKey(start, closestValve);
      const connectedValves = [...allValves[closestValve].paths].filter(
        (v) => v !== start
      );

      for (
        let connectedValveIdx = 0;
        connectedValveIdx < connectedValves.length;
        connectedValveIdx++
      ) {
        const connectedValve = connectedValves[connectedValveIdx];

        const startToConnectedKey = getPathKey(start, connectedValve);
        const closestToConnectedKey = getPathKey(closestValve, connectedValve);

        graph[startToConnectedKey] = Math.min(
          graph[startToConnectedKey],
          graph[pathKeyToClosestValve] + graph[closestToConnectedKey] - 1
        );
      }

      // Remove valve from the queue
      queue = queue.filter((v) => v !== closestValve);

      closestValve = findClosestValve(start, queue);
    }
  };

  for (let valveIdx = 0; valveIdx < valveKeys.length; valveIdx++) {
    const valve = valveKeys[valveIdx];

    dijkstra(
      valve,
      Object.keys(allValves).filter((v) => valve !== v)
    );
  }

  return { graph, valveRates };
};

const calculateValueOfRoute = (route, graph, rates, timeLimit) => {
  let [total, time] = [0, 0];

  for (let idx = 0; idx < route.length - 1; idx++) {
    const valveTime = graph[getPathKey(route[idx], route[idx + 1])];

    total += (timeLimit - time - valveTime) * rates[route[idx + 1]];
    time += valveTime;
  }

  return { total, time };
};

const findRouteBFS = (graph, rates, timeLimit) => {
  const valvesList = Object.keys(rates);

  let queue = valvesList.map((v) => ({
    route: [START, v],
    ...calculateValueOfRoute([START, v], graph, rates, timeLimit),
  }));

  let total = 0;
  let bestRoute = [];

  while (queue.length !== 0) {
    let routesToCheck = [];

    for (
      let activeRouteIdx = 0;
      activeRouteIdx < queue.length;
      activeRouteIdx++
    ) {
      const activeRoute = queue[activeRouteIdx];

      // Get the unvisited valves from the current path
      const unvisitedValves = valvesList.filter(
        (v) => !activeRoute.route.includes(v)
      );

      for (
        let connectedValveIdx = 0;
        connectedValveIdx < unvisitedValves.length;
        connectedValveIdx++
      ) {
        const connectedValve = unvisitedValves[connectedValveIdx];
        const newRoute = [...activeRoute.route, connectedValve];

        const connectedRouteValue = calculateValueOfRoute(
          newRoute,
          graph,
          rates,
          timeLimit
        );

        if (connectedRouteValue.time <= timeLimit) {
          if (total !== Math.max(total, connectedRouteValue.total)) {
            total = Math.max(total, connectedRouteValue.total);
            bestRoute = newRoute;
          }

          if (activeRoute.route.length !== valvesList.length + 1) {
            routesToCheck[routesToCheck.length] = {
              route: newRoute,
              ...connectedRouteValue,
            };
          }
        }
      }
    }

    queue = routesToCheck;
  }

  return { total, bestRoute };
};

const findRouteFor2Players = (graph, rates, timeLimit) => {
  const valvesList = Object.keys(rates);

  const minValvesPerPerson = Math.floor(valvesList.length / 2);

  const getRemainingValves = (valves) =>
    valvesList.filter((v) => !valves.includes(v));

  const cache = {};
  let max = 0;

  const fn = (valves, size) => {
    if (valves.length === size) {
      const sorted = valves.sort();
      const remainingValves = getRemainingValves(sorted).sort();

      const sortedKey = sorted.join(".");
      const remainingValvesKey = remainingValves.join(".");

      if (cache[sortedKey] || cache[remainingValvesKey]) {
        return cache[sortedKey] || cache[remainingValvesKey];
      }

      const v1 = {};
      const v2 = {};

      for (let idx = 0; idx < sorted.length; idx++) {
        const v = sorted[idx];
        v1[v] = rates[v];
      }

      for (let idx = 0; idx < remainingValves.length; idx++) {
        const v = remainingValves[idx];
        v2[v] = rates[v];
      }

      const total1 = findRouteBFS(graph, v1, timeLimit).total;
      const total2 = findRouteBFS(graph, v2, timeLimit).total;
      const total = total1 + total2;

      cache[sortedKey] = total;
      cache[remainingValvesKey] = total;

      return total;
    }

    for (let idx = valves.length; idx < valvesList.length; idx++) {
      const valve = valvesList[idx];
      const nextValves = [...valves, valve].sort();

      if (!valves.includes(valve) && !cache[nextValves.join(".")]) {
        const total = fn(nextValves, size);
        max = Math.max(max, total);
      }
    }

    return max;
  };

  return fn([], minValvesPerPerson);
};

const run = () => {
  const dataArray = fs.readFileSync("./input.txt", "utf-8").split("\n");
  const data = dataArray.slice(0, dataArray.length - 1);

  const { graph, valveRates } = reduceAndBuildGraph(data);

  const total1 = findRouteBFS(graph, valveRates, TIME_LIMITS[0]).total;
  console.log("Part 1 total:", total1);

  const total2 = findRouteFor2Players(graph, valveRates, TIME_LIMITS[1]);
  console.log("Part 2 total:", total2);
};

run();
