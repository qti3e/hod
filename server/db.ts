/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import Datastore from "nedb-promise";
import * as t from "./types";

export const collections = {
  users: new Datastore({ filename: ".db/users.db", autoload: true }),
  passwords: new Datastore({ filename: ".db/passwords.db", autoload: true})
};

export async function getUser(uid: t.UID): Promise<t.User> {
  if (uid === 1) {
    return {
      uid: 1,
      name: "root",
      isRoot: true
    };
  }

  return null;
}

export async function findUserByUsername(username: string): Promise<t.User> {
  return await collections.users.findOne({ username });
}

export async function getPasswordByUID(uid: t.UID): Promise<string> {
  return await collections.passwords.findOne({ uid }).password;
}
