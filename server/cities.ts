/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import md5 from "md5";
import { data } from "./cities.data";
import { isPersian, normalizeText } from "./persian";
import * as t from "./types";

// This file is here to parse cities.

const cities: t.City[] = [];

export = cities;

const seen: Map<string, any> = new Map();

interface Name {
  str: string;
  acc: number;
}

console.log("Loading cities...");
for (let i = 0; i < data.length; ++i) {
  const city = data[i] as any;
  city.id = md5(city.lng.toFixed(2) + "-" + city.lat.toFixed(2));
  city.names = city.names.map(x => ({
    str: x,
    acc: Math.max(acc(city.lng) + acc(city.lat))
  }));
  if (!seen.has(city.id)) {
    seen.set(city.id, city);
    cities.push(city);
    city.lngLat = [city.lng, city.lat];
    delete city.lng;
    delete city.lat;
  } else {
    const org = seen.get(city.id);
    org.names.push(...city.names);
    if (city.country) {
      org.country = city.country;
    }
  }
}

for (let i = 0; i < cities.length; ++i) {
  const city = cities[i] as any;
  city.names.sort((a: Name, b: Name) => {
    const aPersian = isPersian(a.str);
    const bPersian = isPersian(b.str);
    if (!aPersian || !bPersian) {
      if (aPersian) {
        return -1;
      }
      if (bPersian) {
        return 1;
      }
    }
    if (a.acc < b.acc) {
      return -1;
    }
    if (b.acc < a.acc) {
      return 1;
    }
    return 0;
  });
  city.names = city.names.map(x => normalizeText(x.str));
  city.names = city.names.map(x => removeP(x));
  city.names = city.names.filter((x, i) => city.names.indexOf(x) === i);
}

console.log("Loading cities is done.");

function acc(n: number): number {
  const p = n - Math.floor(n);
  return String(p).length - 2;
}

function removeP(s: string): string {
  let ret = "";
  let p = 0;
  for (let i = 0; i < s.length; ++i) {
    const c = s[i];
    if (c === "(") {
      p++;
      continue;
    }
    if (c === ")") {
      p--;
      continue;
    }
    if (p % 2 === 0) {
      ret += c;
    }
  }
  return ret;
}
