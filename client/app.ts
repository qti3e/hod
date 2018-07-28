/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import { renderFrame } from "./frame";

function renderApp(wrapper: HTMLElement) {
  // Remove all children.
  wrapper.innerHTML = "";
  // Set default direction to RTL.
  wrapper.dir = "rtl";
  // Render electron's window frame.
  renderFrame(wrapper);
}

renderApp(document.getElementById("root"));
