/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import bodyparser from "body-parser";
import cors from "cors";
import express from "express";

const app = express();

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded());

app.post("/login", async (req, res) => {
});
