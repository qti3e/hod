/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import { get } from "./context";
import { on } from "./ipc";

/**
 * Renders electron window's frame.
 */
export function renderFrame(wrapper: HTMLElement): void {
  const div = document.createElement("div");
  div.id = "frame-wrapper";

  on("login", () => {
  });

  wrapper.appendChild(div);
}
