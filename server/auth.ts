/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import { createToken } from "./token";

// This file manages authentication functionalities.

const ROOT_USERNAME = "admin";
const ROOT_PASSWORD = "12345";

export enum LOGIN_ERR_CODE {
  NOT_FOUND = -1,
  WRONG_PASSWORD = -2
}

export function login(
  username: string,
  password: string
): string | LOGIN_ERR_CODE {
  if (username === ROOT_USERNAME) {
    if (password === ROOT_PASSWORD) {
      // 1 is root's UID.
      return createToken(1);
    }
    return LOGIN_ERR_CODE.WRONG_PASSWORD;
  }
  return LOGIN_ERR_CODE.NOT_FOUND;
}
