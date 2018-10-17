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
    const ret = await db.storeSystemic(doc, req.user);
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

router.post("/update", async function(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const doc: t.SystemicDoc = req.body.doc;
  let error = true;
  try {
    const ret = await db.updateSystemic(doc, req.user);
    error = !ret;
  } catch (e) {
    console.log(e);
  }
  res.send({
    code: error ? 500 : 200
  });
});

router.post("/list/:page", async function(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const page = Number(req.params.page);
  if (isNaN(page) || page < 0) {
    return void res.send({
      code: 403
    });
  }
  try {
    const ret = await db.listSystemic(page);
    res.send({
      code: 200,
      docs: ret
    });
  } catch (e) {
    console.log(e);
    res.send({
      code: 500
    });
  }
});

router.post("/view/:id", async function(
  req: express.Request,
  res: express.Response
): Promise<void> {
  try {
    const ret = await db.getSystemic(req.params.id);
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

router.post("/payment/:id", async function(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const pay: t.SystemicPayData = req.body.pay;
  if (!pay) {
    return void res.send({
      code: 403
    });
  }
  try {
    await db.paySystemic(req.params.id, pay);
    res.send({
      code: 200
    });
  } catch (e) {
    console.log(e);
    res.send({
      code: 500
    });
  }
});

export { router };
