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
    filename: ".db/tickets.db",
    autoload: true,
    timestampData: true
  }),
  // Docs.
  charters: new Datastore({
    filename: ".db/charters.db",
    autoload: true,
    timestampData: true
  }),
  systemics: new Datastore({
    filename: ".db/systemics.db",
    autoload: true,
    timestampData: true
  }),
  // Notifications.
  notifications: new Datastore({
    filename: ".db/notifications.db",
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
    { $set: { docId: insertedDoc._id } },
    { multi: true }
  );
  for (let i = 0; i < tickets.length; ++i) {
    (tickets[i] as any).docId = insertedDoc._id;
    delete tickets[i]._ownerId;
    tickets[i].owner = owner;
  }

  // TODO(qti3e) Broadcast only to users who have access to fund.
  broadcast(
    {},
    {
      kind: t.NotificationMsgKind.newDoc,
      id: insertedDoc._id
    }
  );

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

export async function listCharter(page: number): Promise<t.CharterDoc[]> {
  const rawData: t.CharterDoc[] = await collections.charters
    .cfind({})
    .sort({ day: 1 })
    .skip(20 * page)
    .limit(20)
    .exec();
  for (let i = 0; i < rawData.length; ++i) {
    rawData[i].owner = await getUser(rawData[i]._ownerId);
    delete rawData[i]._ownerId;
  }
  return rawData;
}

async function getTicket<T extends t.TicketBase>(id: string): Promise<T> {
  return collections.tickets.findOne({ _id: id });
}

export async function getCharter(id: string): Promise<t.CharterDoc> {
  const rawData: t.CharterDoc = await collections.charters.findOne({ _id: id });

  rawData.owner = await getUser(rawData._ownerId);
  rawData.tickets = [];

  for (let i = 0; i < rawData._ticketIds.length; ++i) {
    rawData.tickets.push(
      await getTicket<t.CharterTicket>(rawData._ticketIds[i])
    );
  }

  delete rawData._ownerId;
  delete rawData._ticketIds;

  return rawData;
}

export async function listSystemic(page: number): Promise<t.SystemicDoc[]> {
  const rawData: t.SystemicDoc[] = await collections.systemics
    .cfind({})
    .sort({ day: 1 })
    .skip(20 * page)
    .limit(20)
    .exec();
  for (let i = 0; i < rawData.length; ++i) {
    rawData[i].owner = await getUser(rawData[i]._ownerId);
    delete rawData[i]._ownerId;
  }
  return rawData;
}

export async function getSystemic(id: string): Promise<t.SystemicDoc> {
  const rawData: t.SystemicDoc = await collections.systemics.findOne({
    _id: id
  });

  rawData.owner = await getUser(rawData._ownerId);
  rawData.tickets = [];

  for (let i = 0; i < rawData._ticketIds.length; ++i) {
    rawData.tickets.push(
      await getTicket<t.SystemicTicket>(rawData._ticketIds[i])
    );
  }

  delete rawData._ownerId;
  delete rawData._ticketIds;

  return rawData;
}

export async function sendNotification(
  uid: string,
  msg: t.NotificationMsg
): Promise<void> {
  const notification: t.Notification = {
    uid,
    msg,
    read: false
  };
  await collections.notifications.insert(notification);
}

export async function queryNotifications(uid: string): Promise<t.Notification> {
  const res = await collections.notifications.find({
    uid,
    read: false
  });
  return res;
}

export async function readNotification(id: string): Promise<void> {
  await collections.notifications.update({ _id: id }, { $set: { read: true } });
}

export async function broadcast(
  query,
  msg: t.NotificationMsg
): Promise<number> {
  return (await collections.users.find(query)).map(({ _id }) =>
    sendNotification(_id, msg)
  ).length;
}
