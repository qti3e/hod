/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import atob from "atob";
import btoa from "btoa";

// Some simple encryption functions.

export function encrypt(data: string, key: Uint8Array): string {
  let ret = "";
  for (let i = 0; i < data.length; ++i) {
    ret += String.fromCharCode(data.charCodeAt(i) ^ key[i % key.length]);
  }
  return btoa(ret);
}

export function decrypt(data: string, key: Uint8Array): string {
  data = atob(data);
  let ret = "";
  for (let i = 0; i < data.length; ++i) {
    ret += String.fromCharCode(data.charCodeAt(i) ^ key[i % key.length]);
  }
  return ret;
}
