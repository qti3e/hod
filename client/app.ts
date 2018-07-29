/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import { get } from "./context";
import { on } from "./ipc";
import { delay, len } from "./util";

// Import views.
import { renderFrame } from "./frame";
import { renderLogin } from "./login";

export type Pages = "home" | "users.list";

function renderApp(wrapper: HTMLElement) {
  // Remove all children.
  wrapper.innerHTML = "";
  // Set default direction to RTL.
  wrapper.dir = "rtl";
  // Render electron's window frame.
  renderFrame(wrapper);

  const app = document.createElement("div");
  app.id = "app";
  wrapper.appendChild(app);

  const render = async (page: Pages) => {
    // Hide current content with a fade effect.
    app.classList.add("hide");
    await delay(200);
    // Remove all the contents inside the element.
    app.innerHTML = "";
    // To prevent a flush.
    await delay(50);
    // Remove the hide class.
    app.classList.remove("hide");

    if (len(get("tokens")) === 0) {
      return renderLogin(app);
    }

    if (page === "home") {
    }
  };

  // We can emit this event from anywhere to move
  // user to another page.
  on("go-to", render);

  // Initial rendering.
  // Try to open home page, it might render login page
  render("home");
}

window.addEventListener("load", () => {
  renderApp(document.getElementById("root"));
});
