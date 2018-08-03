/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import { writeFileSync } from "fs";
import { countries, readAirlines } from "./data";

// Internal file.

function listCountries(): string[] {
  return Object.keys(countries).filter(x => x.length > 2);
}

async function main() {
  {
    const names = listCountries();
    let data = "";

    for (const name of names) {
      data += name + "\n";
    }

    writeFileSync("i18n/countries.en.i18n", data);
  }

  {
    const airlines = await readAirlines(__dirname + "/airlines.dat");
    let data = "";
    let i = 0;
    for (const airline of airlines) {
      const word = airline.name + "\n";
      if (data.length + word.length > 5e3) {
        writeFileSync("i18n/airlines" + i + ".en.i18n", data);
        i++;
        data = "";
      }
      data += word;
    }
    writeFileSync("i18n/airlines" + i + ".en.i18n", data);
  }
}

if (require.main === module) {
  main();
} else {
  throw new Error("Why you import a local tool?");
}
