import { assertEqual, test } from "liltest";
import { createToken, PARSE_ERR_CODE, parseToken } from "../token";

test(function test_token_general() {
  const token = createToken("0saa");
  const uid = parseToken(token);
  assertEqual(uid, "0saa");
});

test(function test_token_parse_invalid() {
  const uid = parseToken("xxx");
  assertEqual(uid, PARSE_ERR_CODE.INVALID);
});

// test(function test_token_expire() {
//   const token = createToken("XXX", -1);
//   const uid = parseToken(token);
//   assertEqual(uid, PARSE_ERR_CODE.EXPIRED);
// });

test(function test_token_bench() {
  const t = Date.now();
  for (let i = 0; i < 1e5; ++i) {
    const token = createToken("0saa");
    const uid = parseToken(token);
    assertEqual(uid, "0saa");
  }
  console.log(`Avg time: %dms\n`, (Date.now() - t) / 1e5);
});
