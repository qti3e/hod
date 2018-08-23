/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import { fillCharter as local } from "./local";
import * as t from "./types";

export function renderFillCharter(app: HTMLElement, doc: t.CharterDoc): void {
  const wrapper = document.createElement("div");
  wrapper.id = "fill-charter";
  app.appendChild(wrapper);

  const title = document.createElement("h1");
  title.innerText = local.title;
  wrapper.appendChild(title);

}
