/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import express from "express";
import * as db from "./db";
import { parseToken } from "./token";

const router = express.Router();

export function requestToken(
  req: express.Request,
  res: express.Response
): void {
  const token = req.get("hod-token");
  const uid = token && parseToken(token);

  if (!uid) {
    res.status(403);
    return;
  }

  req.user = db.getUser(uid);

  req.next();
}

export { router };
