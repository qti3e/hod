/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import express from "express";

const router = express.Router();

router.post("/airlines", function(
  req: express.Request,
  res: express.Response
): void {
  const { query } = req.body;
});

export { router };
