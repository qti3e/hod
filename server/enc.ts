/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import { Base64 } from "js-base64";

// Some simple encryption functions.

export function encrypt(data: string, key: Uint8Array): string {
  let ret = "";
  for (let i = 0; i < data.length; ++i) {
    ret += String.fromCharCode(data.charCodeAt(i) ^ key[i % key.length]);
  }
  return Base64.encode(ret);
}

export function decrypt(data: string, key: Uint8Array): string {
  data = Base64.decode(data);
  let ret = "";
  for (let i = 0; i < data.length; ++i) {
    ret += String.fromCharCode(data.charCodeAt(i) ^ key[i % key.length]);
  }
  return ret;
}
