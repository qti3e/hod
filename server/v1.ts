/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import express from "express";
import { router as admin } from "./v1.admin";
import { requestToken, router as auth } from "./v1.auth";
import { router as data } from "./v1.data";

const router = express.Router();

router.use("/auth", auth);

// Only things that are in /auth do not need login
// by default.
router.use(requestToken);
router.use("/admin", admin);
router.use("/data", data);
// TODO(qti3e)
// router.use("/charter", charter);
// router.use("/systemic", systemic);

export { router };
