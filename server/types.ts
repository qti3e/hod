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

export interface Airline {
  id: number;
  name: string;
  alias: string;
  IATA: string;
  ICAO: string;
  callsign: string;
  country: string;
  active: boolean;
}

export interface Airport {
  id: number;
  name: string;
  city: string;
  country: string;
  IATA: string;
  ICAO: string;
  lat: number;
  lng: number;
  alt: number;
  timezone: number;
}
