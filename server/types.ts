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

export interface Ticket {
  // DB id.
  readonly _id: string;
  // Ticket No.
  id: string;
  passengerName: string;
  passengerLastname: string;
  received: number;
  outline: string;
  turnline: string;
  date: string;
  route: DBCity[];
}

export interface CharterTicket extends Ticket {
  paid: number;
}

export interface CharterDoc {
  readonly _id?: string;
  kind: "internal" | "international";
  payer: string;
  payerName: string;
  nationalCode: string;
  phone: string;
  // What we send for the client.
  tickets?: CharterTicket[];
  // What we store in the database.
  ticketIds?: string[];
}
