/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import { get } from "./context";
import { emit, on } from "./ipc";
import { common as local } from "./local";
import { delay } from "./util";

// Import views.
import { renderFrame } from "./frame";
import { renderHome } from "./home";
import { renderLogin } from "./login";
import { renderMenu } from "./menu";
import { renderUsersList } from "./users";

// TODO(qti3e) User typescript like an expert :D
export const pages = {
  login: renderLogin,
  home: renderHome,
  menu: renderMenu,
  usersList: renderUsersList
};

// TODO(qti3e) `keyof pages` should work here?
export type Pages = "login" | "home" | "menu";

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
    // First try to remove the first node very nicely.
    if (app.childNodes.length > 0) {
      const child = app.childNodes[0];
      // Let current component know we're going to unmount it.
      const e = new Event("component-will-unmount");
      const cancelled = !child.dispatchEvent(e);
      // We might want to call `e.preventDefault()`.
      if (cancelled) {
        return;
      }
      app.removeChild(child);
    }
    // Hard-remove all other contents inside the element.
    app.innerHTML = "";
    // First render page, then show it to the user.
    try {
      const currentToken = get("currentToken");
      const shouldLogin = !currentToken || !get("tokens")[currentToken];
      if (page === "login" || shouldLogin) {
        page = "login";
        return renderLogin(app);
      }

      if (pages[page]) {
        return pages[page](app);
      } else {
        console.log("404", page);
        emit("notification", local["404"]);
        if (page !== "home") {
          emit("goto", "home");
        } else {
          emit("notification", "Home page is lost!");
        }
      }
    } finally {
      emit("route-change", page);
      // To prevent a flush.
      await delay(50);
      // Remove the hide class.
      app.classList.remove("hide");
    }
  };

  // We can emit this event from anywhere to move
  // user to another page.
  on("goto", render);

  // Initial rendering.
  // Try to open home page, it might render login page in
  // case user is not signed-in.
  render("home");
}

window.addEventListener("load", () => {
  renderApp(document.getElementById("root"));
});

on("notification", (text: string) => {
  return new Notification("Hod Hod", {
    body: text
  });
});
