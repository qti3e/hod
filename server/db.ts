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
    autoload: true
  }),
  // Docs.
  charters: new Datastore({ filename: "./db/charters.db", autoload: true }),
  systemics: new Datastore({ filename: "./db/systemics.db", autoload: true })
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

export async function storeTicket<T extends t.TicketBase>(
  ticket: T
): Promise<T> {
  return collections.tickets.insert(ticket);
}

export async function storeCharter(doc: t.CharterDoc): Promise<t.CharterDoc> {
  // Prepare doc for database.
  const tickets = doc.tickets;
  doc.tickets = undefined;
  doc.ticketIds = [];

  for (let i = 0; i < tickets.length; ++i) {
    const ticket = await storeTicket(tickets[i]);
    doc.ticketIds.push(ticket._id);
    tickets[i] = ticket;
  }

  const insertedDoc = await collections.charters.insert(doc);

  // Prepare insertedDoc for sending to client.
  delete insertedDoc.ticketIds;
  insertedDoc.tickets = tickets;

  return insertedDoc;
}

export async function storeSystemic(
  doc: t.SystemicDoc
): Promise<t.SystemicDoc> {
  // Prepare doc for database.
  const tickets = doc.tickets;
  doc.tickets = undefined;
  doc.ticketIds = [];

  for (let i = 0; i < tickets.length; ++i) {
    const ticket = await storeTicket(tickets[i]);
    doc.ticketIds.push(ticket._id);
    tickets[i] = ticket;
  }

  const insertedDoc = await collections.systemics.insert(doc);

  // Prepare insertedDoc for sending to client.
  delete insertedDoc.ticketIds;
  insertedDoc.tickets = tickets;

  return insertedDoc;
}
