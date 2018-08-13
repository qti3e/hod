/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import express from "express";
import cities from "./cities";

const router = express.Router();
const citiesRes = JSON.stringify({
  code: 200,
  data: cities
});

router.post("/cities", function(
  req: express.Request,
  res: express.Response
): void {
  res.send(citiesRes);
});

export { router };
