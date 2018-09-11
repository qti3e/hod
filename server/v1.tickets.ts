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

// AutoComplete
router.post("/ac", async function(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const { text } = req.body;
  if (!text) {
    return void res.send({
      code: 403
    });
  }
  const tickets: t.TicketBase[] = await db.acTicketById(name);
  res.send({
    code: 200,
    tickets
  });
});

export { router };
