import { assert, test } from "liltest";
import { readAirlines, readAirports } from "../data";

test(async function test_airlines() {
  const data = await readAirlines(__dirname + "/../airlines.dat");
  assert(data.length > 0);
  assert(data.filter(x => x.active).length > 0);
  assert(data.filter(x => x.alias).length > 0);
});

test(async function test_airports() {
  const data = await readAirports(__dirname + "/../airports.dat");
  assert(data.length > 0);
  assert(data.filter(x => x.country === "Iran").length > 0);
});
