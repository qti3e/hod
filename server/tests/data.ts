import { assert, test } from "liltest";
import { airlines, airports } from "../data";

test(async function test_airlines() {
  assert(airlines.length > 0);
  assert(airlines.filter(x => x.active).length > 0);
  assert(airlines.filter(x => x.alias).length > 0);
  assert(airlines.filter(x => x.id === 21317).length > 0);
});

test(async function test_airports() {
  assert(airports.length > 0);
  assert(airports.filter(x => x.country === "IR").length > 0);
  assert(airports.filter(x => x.id === 12057).length > 0);
});
