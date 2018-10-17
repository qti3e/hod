/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import express from "express";
import * as db from "./db";

const router = express.Router();
const results = new Map();
const times = new Map();

function randomString() {
  return Math.random()
    .toString(16)
    .substr(2)
    .padEnd(12, "0")
    .substr(0, 12);
}

router.post("/search", async function(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const { query } = req.body;
  const data = await db.searchTicket(query);
  const id = randomString();
  results.set(id, data);
  times.set(id, Date.now());
  res.send({
    code: 200,
    count: data.length,
    id
  });
});

router.post("/results", function(
  req: express.Request,
  res: express.Response
): void {
  const { page, id } = req.body;
  if (!results.has(id)) {
    return void res.send({
      code: 404
    });
  }

  const perPage = 50;
  const start = page * perPage;
  const data = results.get(id);
  times.set(id, Date.now());

  res.send({
    code: 200,
    data: data.slice(start, perPage)
  });
});

router.post("/ping", function(
  req: express.Request,
  res: express.Response
): void {
  const { id } = req.body;
  times.set(id, Date.now());
  res.send({ code: 200 });
});

router.post("/destroy", function(
  req: express.Request,
  res: express.Response
): void {
  const { id } = req.body;
  results.delete(id);
  times.delete(id);
  res.send({ code: 200 });
});

setInterval(() => {
  const lastTime = 5 * 60e3;
  const keys = results.keys();
  for (const key of keys) {
    const time = times.get(key);
    if (Date.now() - time > lastTime) {
      results.delete(key);
      times.delete(key);
    }
  }
}, 2.5e3);

export { router };
