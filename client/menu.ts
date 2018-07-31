/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import { fa } from "./util";

let menuCache: HTMLElement;

export function renderMenu(wrapper: HTMLElement): void {
  if (menuCache) {
    return void wrapper.appendChild(menuCache);
  }
  const menu = document.createElement("div");
  menuCache = menu;
  menu.id = "menu";

  for (let i = 0; i < 8; ++i) {
    menu.appendChild(diamond("Hello", "user"));
  }

  wrapper.appendChild(menu);
}

function diamond(text: string, icon: string): HTMLElement {
  const el = document.createElement("div");
  const inner = document.createElement("div");
  el.className = "diamond";
  el.appendChild(inner);
  inner.appendChild(fa(icon));
  inner.className = "inner";
  const textEl = document.createElement("p");
  textEl.innerText = text;
  inner.appendChild(textEl);
  return el;
}
