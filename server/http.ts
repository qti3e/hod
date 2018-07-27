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
import morgan from "morgan";
import { router as v1 } from "./v1";

const app = express();

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(morgan("tiny"));

app.use("/v1", v1);

app.listen(10234);
