import * as t from "./types";

declare module "express" {
  interface Request {
    user: t.User;
  }
}
