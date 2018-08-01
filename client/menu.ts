/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import { get } from "./context";
import { emit } from "./ipc";
import { menu as local } from "./local";
import { fa } from "./util";

const menuCache = new Map<string, HTMLElement>();

export function renderMenu(wrapper: HTMLElement): void {
  const currentToken = get("currentToken");
  if (menuCache.has(currentToken)) {
    return void wrapper.appendChild(menuCache.get(currentToken));
  }

  const user = get("tokens")[get("currentToken")];
  const menu = document.createElement("div");
  menuCache.set(currentToken, menu);
  menu.id = "menu";

  if (user.uid === 1) {
    menu.appendChild(diamond("users", "group", "usersList"));
  }

  wrapper.appendChild(menu);
}

function diamond(text: string, icon: string, page?: string): HTMLElement {
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
