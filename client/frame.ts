/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import { get } from "./context";
import { save } from "./context";
import { on } from "./ipc";
import { nodeRequire, prepend } from "./util";

const { remote } = nodeRequire("electron");

let frameCache: HTMLElement;

/**
 * Renders electron window's frame.
 */
export function renderFrame(wrapper: HTMLElement): void {
  if (frameCache) {
    return void wrapper.appendChild(frameCache);
  }
  const div = document.createElement("div");
  frameCache = div;
  div.id = "frame-wrapper";

  const dropbox = document.createElement("div");
  const drropboxItems = new Map<string, HTMLElement>();

  on("login", () => {});

  const closeBtn = document.createElement("button");
  closeBtn.id = "close";
  closeBtn.appendChild(document.createElement("div")).id = "b1";
  closeBtn.appendChild(document.createElement("div")).id = "b2";
  closeBtn.onclick = () => {
    save();
    const window = remote.getCurrentWindow();
    window.close();
  };

  div.appendChild(closeBtn);

  wrapper.appendChild(div);
}
