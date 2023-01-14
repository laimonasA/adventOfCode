import * as fs from "fs";

const TIME_LIMIT_1 = 24;
const TIME_LIMIT_2 = 32;

const BLUEPRINTS_TO_TRY = 3;

const INITIAL_STATE = {
  or: 0,
  c: 0,
  ob: 0,
  g: 0,
  orBots: 1,
  cBots: 0,
  obBots: 0,
  gBots: 0,
};

const getTime = (r1, c1, m1, r2 = 0, c2 = 0, m2 = 0) => {
  const [resRem1, resRem2] = [c1 - r1, c2 - r2];

  const time1 = resRem1 <= 0 ? 0 : Math.ceil(resRem1 / m1);
  const time2 = resRem2 <= 0 ? 0 : Math.ceil(resRem2 / m2);

  return Math.max(time1, time2) + 1;
};

const dfs = (bp, { or, c, ob, g, orBots, cBots, obBots, gBots, time }) => {
  let max = g + gBots * time;

  // Try building geo bot, unless we have only 1 minute left
  if (obBots !== 0 && time > 1) {
    const bTime = getTime(or, bp.gBotOre, orBots, ob, bp.gBotObs, obBots);

    if (time - bTime > 0) {
      max = Math.max(
        max,
        dfs(bp, {
          or: or + orBots * bTime - bp.gBotOre,
          c: c + cBots * bTime,
          ob: ob + obBots * bTime - bp.gBotObs,
          g: g + gBots * bTime,
          orBots,
          cBots,
          obBots,
          gBots: gBots + 1,
          time: time - bTime,
        })
      );
    }
  }

  // Try building ob bot, unless we have enough to produce more than we are able to consume in a turn.
  if (cBots !== 0 && obBots < bp.gBotObs && time > 2) {
    const bTime = getTime(or, bp.obBotOre, orBots, c, bp.obBotC, cBots);

    if (time - bTime > 1) {
      max = Math.max(
        max,
        dfs(bp, {
          or: or + orBots * bTime - bp.obBotOre,
          c: c + cBots * bTime - bp.obBotC,
          ob: ob + obBots * bTime,
          g: g + gBots * bTime,
          orBots,
          cBots,
          obBots: obBots + 1,
          gBots,
          time: time - bTime,
        })
      );
    }
  }

  // We can always build clay bots, but don't if it means we will produce more than we are able to consume.
  if (cBots < bp.obBotC && time > 3) {
    const bTime = getTime(or, bp.cBotOre, orBots);

    if (time - bTime > 2) {
      max = Math.max(
        max,
        dfs(bp, {
          or: or + orBots * bTime - bp.cBotOre,
          c: c + cBots * bTime,
          ob: ob + obBots * bTime,
          g: g + gBots * bTime,
          orBots,
          cBots: cBots + 1,
          obBots,
          gBots,
          time: time - bTime,
        })
      );
    }
  }

  // We can always build or bots, but don't if it means we will produce more than we are able to consume.
  const maxOre = Math.max(bp.orBotOre, bp.cBotOre, bp.obBotOre, bp.gBotOre);

  if (orBots < maxOre && time > 2) {
    const bTime = getTime(or, bp.orBotOre, orBots);

    if (time - bTime > 1) {
      max = Math.max(
        max,
        dfs(bp, {
          or: or + orBots * bTime - bp.orBotOre,
          c: c + cBots * bTime,
          ob: ob + obBots * bTime,
          g: g + gBots * bTime,
          orBots: orBots + 1,
          cBots,
          obBots,
          gBots,
          time: time - bTime,
        })
      );
    }
  }

  return max;
};

const run = () => {
  const dataArray = fs.readFileSync("./input.txt", "utf-8").split("\n");
  const data = dataArray.slice(0, dataArray.length - 1);

  const prints = [];

  for (let idx = 0; idx < data.length; idx++) {
    const [orBot, cBot, obBot, geoBot] = data[idx]
      .split(" costs ")
      .slice(1)
      .map((bot) => bot.split(" "));

    prints[prints.length] = {
      orBotOre: Number(orBot[0]),
      cBotOre: Number(cBot[0]),
      obBotOre: Number(obBot[0]),
      obBotC: Number(obBot[3]),
      gBotOre: Number(geoBot[0]),
      gBotObs: Number(geoBot[3]),
    };
  }

  let total1 = 0;
  for (let idx = 0; idx < prints.length; idx++) {
    const state = { ...INITIAL_STATE, time: TIME_LIMIT_1 };

    total1 += (idx + 1) * dfs(prints[idx], state);
  }

  console.log("Part 1 total: ", total1);

  let total2 = 1;
  for (let idx = 0; idx < Math.min(prints.length, BLUEPRINTS_TO_TRY); idx++) {
    const state = { ...INITIAL_STATE, time: TIME_LIMIT_2 };

    total2 *= dfs(prints[idx], state);
  }

  console.log("Part 2 total: ", total2);
};

run();
