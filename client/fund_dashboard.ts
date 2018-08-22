/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import { emit } from "./ipc";
import { fundDashboard as local } from "./local";

export function renderFundDashboard(app: HTMLElement): void {
  const wrapper = document.createElement("div");
  wrapper.id = "fund-dashboard-wrapper";
  app.appendChild(wrapper);

  const title = document.createElement("h1");
  title.innerText = local.title;
  wrapper.appendChild(title);
}

setTimeout(() => emit("goto", "fundDashboard"));
