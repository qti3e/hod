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
  passwords: new Datastore({ filename: ".db/passwords.db", autoload: true }),
  // Tickets.
  tickets: new Datastore({
    filename: "./db/tickets.db",
    autoload: true,
    timestampData: true
  }),
  // Docs.
  charters: new Datastore({
    filename: "./db/charters.db",
    autoload: true,
    timestampData: true
  }),
  systemics: new Datastore({
    filename: "./db/systemics.db",
    autoload: true,
    timestampData: true
  })
};

export async function getUser(id: string): Promise<t.User> {
  if (id === "1") {
    return {
      _id: "1",
      nationalCode: null,
      name: "root",
      isRoot: true
    };
  }

  return await collections.users.findOne({ _id: id });
}

export async function findUserByNationalCode(
  nationalCode: string
): Promise<t.User> {
  return await collections.users.findOne({ nationalCode });
}

export async function getPasswordByID(id: string): Promise<string> {
  return (await collections.passwords.findOne({ user: id })).password;
}

export async function newUser(data: t.User, password: string): Promise<string> {
  const user = await collections.users.insert(data);
  await collections.passwords.insert({
    user: user._id,
    password
  });
  return user;
}

export async function listUsers(): Promise<t.User[]> {
  return await collections.users.find({});
}

/** @internal */
async function storeTicket<T extends t.TicketBase>(ticket: T): Promise<T> {
  return collections.tickets.insert(ticket);
}

/** @internal */
async function storeDoc<A extends t.TicketBase, T extends t.DocBase<A>>(
  doc: T,
  owner: t.User,
  docCollection
): Promise<T> {
  // Prepare doc for database.
  const tickets = doc.tickets;
  doc.tickets = undefined;
  doc._ticketIds = [];
  doc._ownerId = owner._id;

  const tmpId = (Math.random() + 1)
    .toString(36)
    .padEnd(12, "0")
    .slice(2, 12);

  for (let i = 0; i < tickets.length; ++i) {
    (tickets[i] as any).docId = tmpId;
    tickets[i]._ownerId = owner._id;
    const ticket = await storeTicket(tickets[i]);
    doc._ticketIds.push(ticket._id);
    tickets[i] = ticket;
  }

  const insertedDoc: T = await docCollection.insert(doc);

  // Prepare insertedDoc for sending to client.
  delete insertedDoc._ticketIds;
  delete insertedDoc._ownerId;
  insertedDoc.tickets = tickets;
  insertedDoc.owner = owner;

  // Make the relation.
  await collections.tickets.update(
    { docId: tmpId },
    { docId: insertedDoc._id },
    {}
  );
  for (let i = 0; i < tickets.length; ++i) {
    (tickets[i] as any).docId = insertedDoc._id;
    delete tickets[i]._ownerId;
    tickets[i].owner = owner;
  }

  return insertedDoc;
}

export function storeCharter(
  doc: t.CharterDoc,
  owner: t.User
): Promise<t.CharterDoc> {
  return storeDoc(doc, owner, collections.charters);
}

export async function storeSystemic(
  doc: t.SystemicDoc,
  owner: t.User
): Promise<t.SystemicDoc> {
  return storeDoc(doc, owner, collections.systemics);
}
