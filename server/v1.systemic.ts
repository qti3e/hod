/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import express from "express";
import * as db from "./db";
import * as t from "./types";

const router = express.Router();

router.post("/new", async function(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const doc: t.SystemicDoc = req.body.doc;
  try {
    const ret = await db.storeSystemic(doc);
    res.send({
      code: 200,
      doc: ret
    });
  } catch (e) {
    console.log(e);
    res.send({
      code: 500
    });
  }
});

export { router };
