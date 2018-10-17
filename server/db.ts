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

for (const key in collections) {
  if (collections[key]) {
    const collection = collections[key];
    Object.defineProperty(collection, "_name", {
      value: key.toLowerCase()
    });
  }
}

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
      id: insertedDoc._id,
      collection: docCollection["_name"]
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
  return await collections.tickets.findOne({ _id: id });
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

export async function payCharter(
  id: string,
  data: t.CharterPayData
): Promise<void> {
  await collections.charters.update({ _id: id }, { $set: { pay: data } });
}

export async function paySystemic(
  id: string,
  data: t.SystemicPayData
): Promise<void> {
  await collections.systemics.update({ _id: id }, { $set: { pay: data } });
}

export async function acTicketById(text: string): Promise<t.TicketBase[]> {
  const regex = new RegExp(`^${text}`, "i");
  return await collections.tickets.find({
    id: { $regex: regex },
    cancelationDoc: { $exists: false }
  });
}

export async function searchTicket<T extends t.TicketBase>(q): Promise<T[]> {
  const tickets = [];
  const docs = new Map();
  if (q.systemic) {
    const tmp = await collections.systemics.find(q.systemic);
    for (const doc of tmp) {
      tickets.push(...doc._ticketIds);
      docs.set(doc._id, doc);
    }
  }
  if (q.charter) {
    const tmp = await collections.charters.find(q.charter);
    for (const doc of tmp) {
      tickets.push(...doc._ticketIds);
      docs.set(doc._id, doc);
    }
  }
  if (tickets.length === 0) {
    return [];
  }
  let rawData = await collections.tickets.find(q.ticket);
  rawData = rawData.filter(t => tickets.indexOf(t._id) > -1);
  for (let i = 0; i < rawData.length; ++i) {
    rawData[i].owner = await getUser(rawData[i]._ownerId);
    rawData[i].doc = docs.get(rawData[i].docId);
    delete rawData[i]._ownerId;
  }
  return rawData;
}

function update(db) {
  if (!db || !db.update || !db.findOne) {
    throw new Error("Bad argument passed to update()");
  }

  async function getDoc(id) {
    const doc = await db.findOne({
      _id: id
    });
    if (!doc) return;
    doc.tickets = [];
    for (let i = 0; i < doc._ticketIds.length; ++i) {
      doc.tickets.push(getTicket(doc._ticketIds[i]));
    }
    doc.tickets = await Promise.all(doc.tickets);
    return doc;
  }

  return async function(doc, user) {
    const id = doc._id;
    const oldDoc = await getDoc(id);
    if (!oldDoc) {
      return false;
    }
    // User can not change the owner.
    doc._ownerId = oldDoc._ownerId;
    delete doc.owner;
    delete doc.modifier;
    delete doc.updatedAt;
    delete doc.createdAt;
    delete doc._id;

    doc.modifier = user._id;
    doc._old = oldDoc; // Backup

    const tickets = doc.tickets;
    delete doc.tickets;
    doc._ticketIds = [];

    const ticketsToRemove = [...oldDoc._ticketIds];
    const oldTickets = new Map();

    for (let i = 0; i < oldDoc._ticketIds.length; ++i) {
      for (let j = 0; j < oldDoc.tickets.length; ++j) {
        if (oldDoc._ticketIds[i] === oldDoc.tickets[j]._id) {
          oldTickets.set(oldDoc._ticketIds[i], oldDoc.tickets[j]);
        }
      }
    }

    for (let i = 0; i < tickets.length; ++i) {
      const ticket = tickets[i];
      const index = ticketsToRemove.indexOf(ticket._id);
      const newTicket = index < 0;

      console.log(ticket._id, newTicket);

      if (newTicket) {
        // Insert ticket to database.
        ticket.docId = id;
        ticket._ownerId = user._id;
        const t = await storeTicket(ticket);
        doc._ticketIds.push(t._id);
        tickets[i] = t;
      } else {
        // Don't remove this ticket
        ticketsToRemove.splice(index, 1);
        // Update ticket
        ticket._ownerId = oldTickets.get(ticket._id)._ownerId;
        delete ticket.owner;
        delete ticket.createdAt;
        delete ticket.updatedAt;
        const _id = ticket._id;
        delete ticket._id;
        await collections.tickets.update({ _id }, ticket, {});
        doc._ticketIds.push(_id);
      }
    }

    for (let i = 0; i < ticketsToRemove.length; ++i) {
      const _id = ticketsToRemove[i];
      // Delete ticket
      await collections.tickets.remove({ _id }, {});
    }

    // Now store the new document in database.
    await db.update({ _id: id }, doc, {});

    // TODO(qti3e) Broadcast only to users who have access to fund.
    broadcast(
      {},
      {
        kind: t.NotificationMsgKind.newDoc,
        id,
        collection: db["_name"]
      }
    );

    return true;
  };
}

export const updateCharter = update(collections.charters);

export const updateSystemic = update(collections.systemics);
