/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import { cancel as local } from "./local";
import { cacheForUser } from "./util";

const domCache = cacheForUser<HTMLElement>();

export function renderCancel(app: HTMLElement): void {
  if (domCache.has()) {
    return void app.appendChild(domCache.get());
  }

  const wrapper = document.createElement("div");
  wrapper.id = "cancel-page";
  wrapper.className = "full-page";
  app.appendChild(wrapper);

  const title = document.createElement("h1");
  title.innerText = local.title;
  wrapper.appendChild(title);

}
