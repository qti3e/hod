import { assert, assertEqual, test } from "liltest";
import cities from "../cities";

test(function test_cities() {
  const tehran = cities.filter(x => x.name === "Tehran")[0];
  assertEqual(!!tehran, true);
  assertEqual(tehran.lat, 35.67194277);
  assertEqual(tehran.lng, 51.42434403);

  // There should be no NaN in lat and lng.
  for (let i = 0; i < cities.length; ++i) {
    try {
    assert(!isNaN(cities[i].lat));
    assert(!isNaN(cities[i].lng));
    } catch (e) {
      console.log("City:");
      console.log(cities[i]);
      console.log();
      throw e;
    }
  }

  // The current CSV has 7322 cities.
  assertEqual(cities.length, 7322);
});
