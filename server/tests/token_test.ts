import { assertEqual, test } from "liltest";
import { createToken, PARSE_ERR_CODE, parseToken } from "../token";

test(function test_token_length() {
  // 4/3 because of base_64.
  // 300: TOKEN_LENGTH
  const len = 4 / 3 * 300;
  // We use a random number to add a padding
  // so here we must test this many times, to
  // ensure we have no incorrect result.
  for (let i = 0; i < 1000; ++i) {
    assertEqual(createToken(0).length, len);
    assertEqual(createToken("0").length, len);
    assertEqual(createToken("022").length, len);
    assertEqual(createToken("sasasa").length, len);
    assertEqual(createToken("0saas32").length, len);
  }
});

test(function test_token_general() {
  const token = createToken("0saa");
  const uid = parseToken(token);
  assertEqual(uid, "0saa");
});

test(function test_token_parse_invalid() {
  const uid = parseToken("xxx");
  assertEqual(uid, PARSE_ERR_CODE.INVALID);
});

test(function test_token_expire() {
  const token = createToken("XXX", -1);
  const uid = parseToken(token);
  assertEqual(uid, PARSE_ERR_CODE.EXPIRED);
});

test(function test_token_bench() {
  const t = Date.now();
  for (let i = 0; i < 1e5; ++i) {
    const token = createToken("0saa");
    const uid = parseToken(token);
    assertEqual(uid, "0saa");
  }
  console.log(`Avg time: %dms\n`, (Date.now() - t) / 1e5);
});
