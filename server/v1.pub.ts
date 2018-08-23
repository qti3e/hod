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

router.post("/get", async (req: express.Request, res: express.Response) => {
  try {
    const msgs = await db.queryNotifications(req.user._id);
    res.send({
      code: 200,
      msgs
    });
  } catch (e) {
    res.send({
      code: 500
    });
  }
});

router.post(
  "/read/:id",
  async (req: express.Request, res: express.Response) => {
    try {
      await db.readNotification(req.params.id);
      res.send({
        code: 200
      });
    } catch (e) {
      res.send({
        code: 500
      });
    }
  }
);

export { router };
