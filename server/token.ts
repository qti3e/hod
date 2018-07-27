/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import { decrypt, encrypt } from "./enc";
import * as t from "./types";

const TOKEN_LENGTH = 300;
const DEFAULT_EXPIRE = 18 * 3600;
const ENC_KEY = new Uint8Array(TOKEN_LENGTH * 2).map((x, i) =>
  Math.round(
    1000 *
    Math.abs(
      Math.cos(i * Math.PI / 180) * Math.tan(i * Math.PI / 180 + Math.PI)
    )
  ) % 256
);

export function createToken(uid: t.UID, expire = DEFAULT_EXPIRE): string {
  const token = JSON.stringify({
    uid,
    expire: Math.floor(Date.now() / 1000) + expire
  });
  const len = token.length;
  const padding = TOKEN_LENGTH - len;
  const paddingLeft = Math.floor(
    padding *
    Math.min(Math.random(), 0.8)
  );
  // -2: two -1, each due to the followings stuff:
  //  * str[0] = paddingLeft
  //  * str[1] = len
  const paddingRight = padding - paddingLeft - 2;
  let str = "";
  str += String.fromCharCode(paddingLeft);
  str += String.fromCharCode(len);
  str += randomBytes(paddingLeft);
  str += token;
  str += randomBytes(paddingRight);
  return encrypt(str, ENC_KEY);
}

export enum PARSE_ERR_CODE {
  INVALID = -1,
  EXPIRED = -2
}

export function parseToken(token: string): t.UID | PARSE_ERR_CODE {
  token = decrypt(token, ENC_KEY);
  const paddingLeft = token.charCodeAt(0);
  const len = token.charCodeAt(1);
  token = token.substr(paddingLeft + 2, len);
  try {
    const data = JSON.parse(token);
    if (!data.uid || !data.expire) {
      return PARSE_ERR_CODE.INVALID;
    }
    if (Date.now() / 1000 > data.expire) {
      return PARSE_ERR_CODE.EXPIRED;
    }
    if (String(Number(data.uid)) === data.uid) {
      return Number(data.uid);
    }
    return data.uid;
  } catch (e) {
    return PARSE_ERR_CODE.INVALID;
  }
}

function randomBytes(n: number): string {
  let ret = "";
  for (; n > 0; --n) {
    ret += randomByte();
  }
  return ret;
}

function randomByte(): string {
  const code = Math.random() * 255;
  return String.fromCharCode(code);
}
