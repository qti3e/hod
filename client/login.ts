/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import axios from "axios";
import { get, set } from "./context";
import { emit } from "./ipc";
import { login as local } from "./local";
import { onEnter } from "./util";

// Cache the elements.
let loginBoxCache: HTMLElement;

export function renderLogin(wrapper: HTMLElement): void {
  wrapper.classList.add("img-bg");
  if (loginBoxCache) {
    return void wrapper.appendChild(loginBoxCache);
  }
  // Create and cache login box.
  const loginBox = document.createElement("div");
  loginBoxCache = loginBox;
  wrapper.appendChild(loginBox);
  // Set attributes.
  loginBox.id = "login-box";

  const doLogin = () => {
    submit(usernameIn.value, passwordIn.value);
  };

  const img = document.createElement("img");
  img.src = require("./assets/logo.png");
  loginBox.appendChild(img);

  const usernameIn = document.createElement("input");
  usernameIn.type = "text";
  usernameIn.placeholder = local.username;
  onEnter(usernameIn, doLogin);
  loginBox.appendChild(usernameIn);

  const passwordIn = document.createElement("input");
  passwordIn.type = "password";
  passwordIn.placeholder = local.password;
  onEnter(passwordIn, doLogin);
  loginBox.appendChild(passwordIn);

  const loginBtn = document.createElement("button");
  loginBtn.innerText = local.login;
  loginBtn.onclick = doLogin;
  loginBox.appendChild(loginBtn);

  loginBox.addEventListener("component-will-unmount", () => {
    wrapper.classList.remove("img-bg");
  });
}

async function submit(username: string, password: string): Promise<void> {
  // Maybe do not perform query when we have an active token
  // in our context.tokens for the given username?
  const server = get("server");
  const { data } = await axios.post(server + "/auth/login", {
    username,
    password
  });
  switch (data.code) {
    case 200:
      addToken(data.token);
      break;
    default:
      emit("notification", local.error);
  }
}

async function addToken(token: string): Promise<void> {
  const tokens = get("tokens");
  const server = get("server");
  const { data: user } = await axios.post(
    server + "/auth/me",
    {},
    {
      headers: {
        "hod-token": token
      }
    }
  );
  // Remove current tokens for the user.
  for (const key in tokens) {
    if (tokens[token].uid === key) {
      delete tokens[token];
    }
  }
  tokens[token] = user;
  set("tokens", tokens);
  set("currentToken", token);
  // Emit events to let others know what we did.
  emit("login", user);
  emit("goto", "home");
}
