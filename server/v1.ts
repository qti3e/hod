/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import express from "express";
import { router as admin } from "./http.admin";
import { parseToken, router as auth } from "./http.auth";

// Export
const router = express.Router();

router.get("/ver", (req, res) => {
  res.send({
    name: "Hod",
    version: "v0.1.0",
    author: "qti3e"
  });
});

router.use("/auth", auth);
// Only things that are in /auth do not need login
// by default.
router.use(parseToken);
router.use("/admin", admin);
// TODO(qti3e)
// router.use("/charter", charter);
// router.use("/systemic", systemic);

export { router };
