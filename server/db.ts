/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import Datastore from "nedb";
import * as t from "./types";

export const collections = {
  users: new Datastore({ filename: ".db/users.db", autoload: true })
};

export function getUser(uid: t.UID): t.User {
  if (uid === 1) {
    return {
      uid: 1,
      name: "root",
      isRoot: true
    };
  }

  return null;
}
