/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import { createReadStream } from "fs";
import { createInterface } from "readline";
import * as t from "./types";

export function readAirlines(path: string): Promise<t.Airline[]> {
  const data: t.Airline[] = [];

  let resolve;
  const promise = new Promise<t.Airline[]>(r => (resolve = r));

  const rl = createInterface({
    input: createReadStream(path)
  });

  rl.on("line", line => {
    line = "[" + line.replace(/\\N/g, "null") + "]";
    line = JSON.parse(line);
    data.push({
      id: line[0],
      name: line[1],
      alias: line[2],
      IATA: line[3],
      ICAO: line[4],
      callsign: line[5],
      country: line[6],
      active: line[7] === "Y"
    });
  });

  rl.on("end", () => resolve(data));

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
    line = JSON.parse(line);
    data.push({
      id: line[0],
      name: line[1],
      city: line[2],
      country: line[3],
      IATA: line[4],
      ICAO: line[5],
      lat: line[6],
      lng: line[7],
      alt: line[8],
      timezone: line[9]
    });
  });

  rl.on("end", () => resolve(data));

  return promise;
}
