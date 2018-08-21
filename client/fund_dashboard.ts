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
  app.innerHTML = local.title;
}

setTimeout(() => emit("goto", "fundDashboard"));
