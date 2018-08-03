/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import { createReadStream, readFileSync } from "fs";
import { createInterface } from "readline";
import * as t from "./types";

export const countries: { [k: string]: string } = {};

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

export function readAirlines(path: string): Promise<t.Airline[]> {
  const data: t.Airline[] = [];

  let resolve;
  const promise = new Promise<t.Airline[]>(r => (resolve = r));

  const rl = createInterface({
    input: createReadStream(path)
  });

  rl.on("line", line => {
    line = "[" + line.replace(/\\N/g, "null") + "]";
    line = cleanString(line);
    line = JSON.parse(line);
    data.push({
      id: line[0],
      name: line[1],
      alias: line[2],
      IATA: line[3],
      ICAO: line[4],
      callsign: line[5],
      country: toShortForm(line[6]),
      active: line[7] === "Y"
    });
  });

  rl.on("close", () => resolve(data));

  return promise;
}

export function readAirports(path: string): Promise<t.Airport[]> {
  const data: t.Airport[] = [];

  let resolve;
  const promise = new Promise<t.Airport[]>(r => (resolve = r));

  const rl = createInterface({
    input: createReadStream(path)
  });

  rl.on("line", line => {
    line = "[" + line.replace(/\\N/g, "null") + "]";
    line = cleanString(line);
    line = JSON.parse(line);
    data.push({
      id: line[0],
      name: line[1],
      city: line[2],
      country: toShortForm(line[3]),
      IATA: line[4],
      ICAO: line[5],
      lat: line[6],
      lng: line[7],
      alt: line[8],
      timezone: line[9]
    });
  });

  rl.on("close", () => resolve(data));

  return promise;
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

loadContries();
