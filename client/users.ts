/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import axios from "axios";
import { get } from "./context";
import { usersList as local } from "./local";
import * as t from "./types";

let elCache: HTMLElement;

export function renderUsersList(app: HTMLElement): void {
  if (elCache) {
    fetchData().then(render);
    return void app.appendChild(elCache);
  }
  const wrapper = document.createElement("div");
  elCache = wrapper;
  wrapper.id = "users-list";

  // TODO(qti3e) Add title and use #app > .full-page css class.

  function render(users: t.User[]) {
    wrapper.innerHTML = "";
    const head = document.createElement("div");
    head.classList.add("head");
    const name = document.createElement("div");
    name.innerText = local.name;
    const lastName = document.createElement("div");
    lastName.innerText = local.lastName;
    const nationalCode = document.createElement("div");
    nationalCode.innerText = local.nationalCode;
    head.appendChild(name);
    head.appendChild(lastName);
    head.appendChild(nationalCode);
    const content = document.createElement("div");
    content.id = "content";
    wrapper.appendChild(head);
    wrapper.appendChild(content);

    for (const key in users) {
      if (users[key]) {
        const user = users[key];
        const row = document.createElement("div");
        row.classList.add("row");
        const name = document.createElement("div");
        name.innerText = user.name;
        const lastName = document.createElement("div");
        lastName.innerText = user.lastName;
        const nationalCode = document.createElement("div");
        nationalCode.innerText = user.nationalCode;
        row.appendChild(name);
        row.appendChild(lastName);
        row.appendChild(nationalCode);
        content.appendChild(row);
      }
    }
  }

  fetchData().then(render);

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
