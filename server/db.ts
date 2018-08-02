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
  passwords: new Datastore({ filename: ".db/passwords.db", autoload: true })
};

export async function getUser(id: t.UID): Promise<t.User> {
  if (id === "1") {
    return {
      _id: "1",
      uid: "1",
      name: "root",
      isRoot: true
    };
  }

  return await collections.users.findOne({ _id: id });
}

export async function findUserByNationalCode(uid: t.UID): Promise<t.User> {
  if (uid === "1") {
    throw new Error(
      "It should not happen." +
        " (looking for root user using findUserByUsername)"
    );
  }
  return await collections.users.findOne({ uid });
}

export async function getPasswordByID(id: string): Promise<string> {
  return (await collections.passwords.findOne({ _id: id })).password;
}

export async function newUser(data: t.User, password: string): Promise<string> {
  await collections.users.insert(data);
  return await collections.passwords.insert({ uid: data.uid, password });
}

export async function listUsers(): Promise<t.User[]> {
  return await collections.users.find({});
}
