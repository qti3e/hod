/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import { PageName } from "./app";
import { get } from "./context";
import { emit } from "./ipc";
import { menu as local } from "./local";
import { fa } from "./util";

const menuCache = new Map<string, HTMLElement>();

export function renderMenu(app: HTMLElement): void {
  const currentToken = get("currentToken");
  if (menuCache.has(currentToken)) {
    return void app.appendChild(menuCache.get(currentToken));
  }
  const menuWrapper = document.createElement("div");
  menuCache.set(currentToken, menuWrapper);
  menuWrapper.id = "menu";
  // menuWrapper.className = "img-bg";

  const wrapper = document.createElement("div");
  wrapper.id = "diamonds";
  menuWrapper.appendChild(wrapper);

  wrapper.appendChild(diamond("home", "home", "home"));

  const user = get("tokens")[currentToken];
  if (user.isRoot) {
    wrapper.appendChild(diamond("users", "users", "usersList"));
    wrapper.appendChild(diamond("new_user", "user-plus", "newUser"));
  } else {
    const newDocIcon = ["file", "plus"];
    const listDocIcon = ["file", "eye"];

    wrapper.appendChild(diamond("new_charter", newDocIcon, "newCharter"));
    wrapper.appendChild(diamond("list_charter", listDocIcon, "listCharter"));

    wrapper.appendChild(diamond("new_systemic", newDocIcon, "newSystemic"));
    wrapper.appendChild(diamond("list_systemic", listDocIcon, "listSystemic"));

    wrapper.appendChild(
      diamond("fund_dashboard", "file-invoice-dollar", "fundDashboard")
    );

    // wrapper.appendChild(diamond("cancel", "file-excel", "cancel"));
    wrapper.appendChild(diamond("tickets", "ticket-alt", "tickets"));
  }

  app.appendChild(menuWrapper);
}

function diamond(
  text: string,
  icon: string | string[],
  page?: PageName
): HTMLElement {
  const el = document.createElement("div");
  const inner = document.createElement("div");
  el.className = "diamond";
  el.appendChild(inner);
  inner.appendChild(fa(icon));
  inner.className = "inner";
  const textEl = document.createElement("p");
  textEl.innerText = local[text] || text;
  inner.appendChild(textEl);
  if (page) {
    el.addEventListener("click", () => {
      emit("goto", page);
    });
  }
  return el;
}
