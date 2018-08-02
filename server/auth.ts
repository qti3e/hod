/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import { findUserByNationalCode, getPasswordByID } from "./db";
import { createToken } from "./token";

// This file manages authentication functionalities.

const ROOT_USERNAME = "admin";
const ROOT_PASSWORD = "12345";

export enum LOGIN_ERR_CODE {
  NOT_FOUND = -1,
  WRONG_PASSWORD = -2
}

export async function login(
  username: string,
  password: string
): Promise<string | LOGIN_ERR_CODE> {
  if (username === ROOT_USERNAME) {
    if (password === ROOT_PASSWORD) {
      // 1 is root's UID.
      return createToken("1");
    }
    return LOGIN_ERR_CODE.WRONG_PASSWORD;
  }

  const user = await findUserByNationalCode(username);
  if (!user) {
    return LOGIN_ERR_CODE.NOT_FOUND;
  }

  if (password === (await getPasswordByID(user._id))) {
    return createToken(user._id);
  }

  return LOGIN_ERR_CODE.WRONG_PASSWORD;
}
