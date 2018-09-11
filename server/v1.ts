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
import { router as charter } from "./v1.charter";
import { router as data } from "./v1.data";
import { router as pub } from "./v1.pub";
import { router as systemic } from "./v1.systemic";
import { router as tickets } from "./v1.tickets";

const router = express.Router();

router.use("/auth", auth);

// Only things that are in /auth do not need login
// by default.
router.use(requestToken);
router.use("/admin", admin);
router.use("/data", data);
router.use("/charter", charter);
router.use("/systemic", systemic);
router.use("/tickets", tickets);
router.use("/pub", pub);

export { router };
