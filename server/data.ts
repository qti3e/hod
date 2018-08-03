/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import { openSync, readFileSync, readSync } from "fs";
import * as t from "./types";

export const countries: { [k: string]: string } = {};
export const airlines: t.Airline[] = [];
export const airports: t.Airport[] = [];

function loadContries() {
  const data = readFileSync(__dirname + "/countries.dat").toString();
  let skip = false;
  let i = 0;
  let nameA = "";
  let nameB = "";
  let x = 0;
  while (true) {
    const c = data[i++];

    if (i === data.length) {
      break;
    }

    if (c === "\n") {
      countries[nameA] = nameB;
      countries[nameB] = nameA;
      nameA = "";
      nameB = "";
      skip = false;
      x = 0;
      continue;
    } else if (skip) {
      continue;
    }

    if (c === ",") {
      if (x === 1) {
        skip = true;
      } else {
        x = 1;
      }
      continue;
    }

    if (x === 0) {
      nameA += c;
    } else {
      nameB += c;
    }
  }
  countries[nameA] = nameB;
  countries[nameB] = nameA;
}

export function toShortForm(name: string): string {
  const name2 = countries[name];
  if (name2 && name2.length < name.length) {
    return name2;
  }
  return name;
}

export function loadAirlines(): void {
  readLineByLine(__dirname + "/airlines.dat", line => {
    line = "[" + line.replace(/\\N/g, "null") + "]";
    line = cleanString(line);
    const data = JSON.parse(line);
    airlines.push({
      id: data[0],
      name: data[1],
      alias: data[2],
      IATA: data[3],
      ICAO: data[4],
      callsign: data[5],
      country: toShortForm(data[6]),
      active: data[7] === "Y"
    });
  });
}

export function loadAirports(): void {
  readLineByLine(__dirname + "/airports.dat", line => {
    line = "[" + line.replace(/\\N/g, "null") + "]";
    line = cleanString(line);
    const data = JSON.parse(line);
    airports.push({
      id: data[0],
      name: data[1],
      city: data[2],
      country: toShortForm(data[3]),
      IATA: data[4],
      ICAO: data[5],
      lat: data[6],
      lng: data[7],
      alt: data[8],
      timezone: data[9]
    });
  });
}

function cleanString(s: string): string {
  let ret = "";
  for (let i = 0; i < s.length; ++i) {
    const code = s.charCodeAt(i);
    if (code === 27) {
      i += 2;
    } else if (code <= 127) {
      ret += s[i];
    }
  }
  return ret;
}

function readLineByLine(path: string, cb: (line: string) => void): void {
  const maxLen = 205;
  const fd = openSync(path, "r");
  const buffer = new ArrayBuffer(maxLen);
  const ui8 = new Uint8Array(buffer);
  let pos = 0;
  while (true) {
    ui8.fill(0);
    const read = readSync(fd, ui8, 0, maxLen, pos);
    if (read === 0) {
      break;
    }
    const index = ui8.indexOf(0xa);
    if (index < 0) {
      throw new Error("Unexcpected line.");
    }
    pos += index + 1;
    cb(String.fromCharCode(...ui8.slice(0, index)));
  }
}

loadContries();
loadAirlines();
loadAirports();
