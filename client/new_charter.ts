/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import { newCharter as local } from "./local";
import { cacheForUser, checkBox } from "./util";

const domCache = cacheForUser<HTMLElement>();

export function renderNewCharter(app: HTMLElement): void {
  // Check DOM cache for current user.
  if (domCache.has()) {
    return void app.appendChild(domCache.get());
  }
  // Create wrapper
  const wrapper = document.createElement("div");
  wrapper.id = "new-charter";
  wrapper.classList.add("full-page");
  domCache.set(wrapper);
  app.appendChild(wrapper);

  const title = document.createElement("h1");
  title.innerText = local.title;
  wrapper.appendChild(title);

  const checkbox = checkBox("Test");
  wrapper.appendChild(checkbox.parentElement);
}
