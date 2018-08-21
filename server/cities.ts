/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import md5 from "md5";
import { data } from "./cities.data";
import { normalizeText } from "./persian";
import * as t from "./types";

// This file is here to parse cities.

const cities: t.City[] = [];

const seen = new Map<string, number>();

export = cities;

console.log("Loading cities...");
for (let i = 0; i < data.length; ++i) {
  const city = data[i];

  if (seen.has(city.Cities)) {
    continue;
  }
  seen.set(city.Cities, 1);

  const lngLat = city.coordinate_location
    .slice(6, -1)
    .split(" ")
    .map(Number);
  if (lngLat.length !== 2) {
    continue;
  }

  cities.push({
    id: md5(city.Cities),
    names: [normalizeText(city.label_fa), city.label_en],
    lngLat: [lngLat[0], lngLat[1]],
    country: normalizeText(city.country_fa)
  });
}

seen.clear();
console.log("Loading cities is done.");
