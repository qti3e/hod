/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

// Common types.

export interface User {
  readonly _id?: string;
  nationalCode: string;
  name: string;
  lastName?: string;
  isRoot?: boolean;
}

export interface City {
  readonly id: string;
  readonly names: ReadonlyArray<string>;
  readonly lngLat: [number, number];
  readonly country?: string;
  // Matched result.
  name?: string;
}

export interface DBCity {
  id: string;
  displayName: string;
  lngLat: [number, number];
}

export interface TicketBase {
  // DB id.
  readonly _id?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly docId?: string;
  readonly cancelationDoc?: string;
  readonly doc?: DocBase<TicketBase>;
  owner?: User;
  _ownerId?: string;
  // Ticket No.
  id: string;
  passengerName: string;
  passengerLastname: string;
  received: number;
  airline: string;
  date: number;
  route: DBCity[];
}

export interface DocBase<T extends TicketBase> {
  // Nedb data.
  readonly _id?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  owner?: User;
  // Our information about the documentation.
  kind: string;
  payer: string;
  payerName: string;
  nationalCode: string;
  phone: string;
  // What we send for the client.
  tickets?: T[];
  // What we store in the database.
  _ticketIds?: string[];
  _ownerId?: string;
}

export interface CharterTicket extends TicketBase {
  paid: number;
}

export interface SystemicTicket extends TicketBase {}

export enum CharterReceiveKind {
  cacheReceive,
  bankReceive,
  hekmatCardReceive,
  notificationReceive
}

export interface CacheReceive {
  kind: CharterReceiveKind.cacheReceive;
  amount: number;
  date: number;
  receiverName: string;
}

export interface BankReceive {
  kind: CharterReceiveKind.bankReceive;
  amount: number;
  account: string;
  date: number;
}

export interface HekmatCardReceive {
  kind: CharterReceiveKind.hekmatCardReceive;
  amount: number;
  date: number;
}

export interface NotificationReceive {
  kind: CharterReceiveKind.notificationReceive;
  amount: number;
  number: string;
  date: number;
}

export type CharterReceive =
  | CacheReceive
  | BankReceive
  | HekmatCardReceive
  | NotificationReceive;

export interface CharterPayment {
  date: number;
  amount: number;
  account: string;
}

export interface CharterPayData {
  base: {
    A: number;
    B: number;
    C: number;
    D: number;
    E: number;
    I: number;
  };
  receives: CharterReceive[];
  payments: CharterPayment[];
  additionalComments: string;
}

export interface CharterDoc extends DocBase<CharterTicket> {
  kind: "internal" | "international";
  providedBy: "cache" | "credit";
  pay: CharterPayData;
  providerAgency: string;
}

export type SystemicReceive = CharterReceive;

export interface SystemicPayData {
  base: {
    A: number;
    B: number;
    C: number;
    D: number;
    E: number;
    I: number;
  };
  receives: SystemicReceive[];
  additionalComments: string;
}

export interface SystemicDoc extends DocBase<SystemicTicket> {
  kind: "internal" | "international" | "train";
  pay: SystemicPayData;
}

export enum NotificationMsgKind {
  newDoc = 1
}

export interface NewDocNotification {
  readonly kind: NotificationMsgKind.newDoc;
  readonly id: string;
  readonly collection: string;
}

export type NotificationMsg = NewDocNotification;

export interface Notification {
  readonly _id?: string;
  readonly createdAt?: string;
  readonly uid: string;
  readonly msg: NotificationMsg;
  read: boolean;
}
