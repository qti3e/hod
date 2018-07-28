/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import { get } from "./context";
import { on } from "./ipc";

// Import views.
import { renderDashboard } from "./dashboard";
import { renderFrame } from "./frame";
import { renderLogin } from "./login";

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

  const render = () => {
    // TODO(qti3e) Maybe use a smooth animation?
    // (something like fading)
    app.innerHTML = "";
    if (get("isLoggedIn")) {
      renderDashboard(app);
    } else {
      renderLogin(app);
    }
  };

  // We can emit this event from anywhere to request
  // a rerender.
  on("render-main", render);

  // Initial rendering.
  render();
}

renderApp(document.getElementById("root"));
