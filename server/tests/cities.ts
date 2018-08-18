import { assert, test } from "liltest";
import cities from "../cities";

test(function test_cities() {
  // There should be no NaN in lat and lng.
  for (let i = 0; i < cities.length; ++i) {
    try {
      assert(!isNaN(cities[i].lngLat[0]));
      assert(!isNaN(cities[i].lngLat[1]));
    } catch (e) {
      console.log("City:");
      console.log(cities[i]);
      console.log();
      throw e;
    }
  }
});

test(function test_cities_uniqId() {
  const ids = [];
  for (let i = 0; i < cities.length; ++i) {
    const id = cities[i].id;
    const index = ids.indexOf(id);
    if (index > -1) {
      console.log(cities[i], cities[index]);
      assert(false);
    }
    ids.push(id);
  }
  assert(ids.length === cities.length);
});
