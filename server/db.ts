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

  return await collections.users.findOne({ uid });
}

// TODO(qti3e) remove this function - we don't want to user username.
export async function findUserByUsername(uid: t.UID): Promise<t.User> {
  if (uid === 1) {
    throw new Error("It should not happen." +
      " (looking for root user using findUserByUsername)");
  }
  return await collections.users.findOne({ uid });
}

export async function getPasswordByUID(uid: t.UID): Promise<string> {
  return (await collections.passwords.findOne({ uid })).password;
}

export async function newUser(data: t.User, password: string): Promise<void> {
  await collections.users.insert(data);
  await collections.passwords.insert({ uid: data.uid, password });
}
