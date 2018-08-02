/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import axios from "axios";
import { get } from "./context";
import * as t from "./types";

let elCache: HTMLElement;

export function renderUsersList(app: HTMLElement): void {
  if (elCache) {
    return void app.appendChild(elCache);
  }
  const wrapper = document.createElement("div");
  elCache = wrapper;
  wrapper.id = "users-list";

  // TODO

  fetchData().then(console.log);

  app.appendChild(wrapper);
}

async function fetchData(): Promise<t.User[]> {
  const token = get("currentToken");
  const server = get("server");
  const { data: res } = await axios.post(
    server + "/admin/users/list",
    {},
    {
      headers: {
        "hod-token": token
      }
    }
  );
  return res.data;
}
