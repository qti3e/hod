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
  owner?: User;
  _ownerId?: string;
  // Ticket No.
  id: string;
  passengerName: string;
  passengerLastname: string;
  received: number;
  outline: string;
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
  receives: {
    ICI: number;
    cache: number;
    companyCost: number;
    credit: number;
    installmentBase: number;
    wage: number;
  };
  // What we send for the client.
  tickets?: T[];
  // What we store in the database.
  _ticketIds?: string[];
  _ownerId?: string;
}

export interface CharterTicket extends TicketBase {
  paid: number;
  turnline: string;
}

export interface SystemicTicket extends TicketBase {}

export interface CharterDoc extends DocBase<CharterTicket> {
  kind: "internal" | "international";
  providedBy: "cache" | "credit";
}

export interface SystemicDoc extends DocBase<SystemicTicket> {
  kind: "internal" | "international" | "train";
}
