/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import axios from "axios";
import { get, set } from "./context";
import { login as local } from "./fa";

let loginBoxCache: HTMLElement;

export function renderLogin(wrapper: HTMLElement): void {
  if (loginBoxCache) {
    return void wrapper.appendChild(loginBoxCache);
  }
  // Create and cache login box.
  const loginBox = document.createElement("div");
  loginBoxCache = loginBox;
  wrapper.appendChild(loginBox);
  // Set attributes.
  loginBox.id = "login-box";

  const img = document.createElement("img");
  img.src = require("./assets/logo.png");
  loginBox.appendChild(img);

  const usernameIn = document.createElement("input");
  usernameIn.type = "text";
  usernameIn.name = "username";
  usernameIn.placeholder = local.username;
  loginBox.appendChild(usernameIn);

  const passwordIn = document.createElement("input");
  passwordIn.type = "password";
  passwordIn.name = "password";
  passwordIn.placeholder = local.password;
  loginBox.appendChild(passwordIn);

  const loginBtn = document.createElement("button");
  loginBtn.innerText = local.login;
  loginBox.appendChild(loginBtn);
}
