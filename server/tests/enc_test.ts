import { assertEqual, test } from "liltest";
import { decrypt, encrypt } from "../enc";

const ENC_KEY = new Uint8Array(500).map(
  (x, i) =>
    Math.round(
      1000 *
        Math.abs(
          Math.cos((i * Math.PI) / 180) *
            Math.tan((i * Math.PI) / 180 + Math.PI)
        )
    ) % 256
);

test(function test_enc() {
  const data = "Hello World! QTI3E";
  const enc = encrypt(data, ENC_KEY);
  assertEqual(typeof enc, "string");
  const dec = decrypt(enc, ENC_KEY);
  assertEqual(dec, data);
});

test(function test_enc_short_key() {
  const data = "Hello world!";
  const key = ENC_KEY.slice(0, 5);
  assertEqual(key.length, 5);
  const enc = encrypt(data, key);
  assertEqual(typeof enc, "string");
  const dec = decrypt(enc, key);
  assertEqual(dec, data);
});
