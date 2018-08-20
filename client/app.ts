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
import { renderListCharter } from "./list_charter";
import { renderLogin } from "./login";
import { renderMenu } from "./menu";
import { renderNewCharter } from "./new_charter";
import { renderNewSystemic } from "./new_systemic";
import { renderNewUser } from "./new_user";
import { renderUsersList } from "./users";

export type PageName =
  | "login"
  | "home"
  | "menu"
  | "usersList"
  | "newUser"
  | "newCharter"
  | "newSystemic"
  | "listCharter";

export type Page = (app: HTMLElement) => void;
export type Pages = { [key in PageName]: Page };

export const pages: Pages = {
  login: renderLogin,
  home: renderHome,
  menu: renderMenu,
  usersList: renderUsersList,
  newUser: renderNewUser,
  newCharter: renderNewCharter,
  newSystemic: renderNewSystemic,
  listCharter: renderListCharter
};

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

  const render = async (page: PageName) => {
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

  const renderModal = async (page: PageName) => {
    const modalWrapper = document.createElement("div");
    modalWrapper.className = "modal-wrapper";
    wrapper.appendChild(modalWrapper);

    const innerWrapper = document.createElement("div");
    innerWrapper.className = "modal-inner-wrapper";
    modalWrapper.appendChild(innerWrapper);

    modalWrapper.onclick = async (e) => {
      if (e.target !== modalWrapper) return;
      innerWrapper.classList.remove("show");
      // Wait till animation finishes.
      await delay(800);
      if (innerWrapper.childNodes.length > 0) {
        const child = innerWrapper.childNodes[0];
        // Let current component know we're going to unmount it.
        const e = new Event("component-will-unmount");
        const cancelled = !child.dispatchEvent(e);
        // We might want to call `e.preventDefault()`.
        if (cancelled) {
          return;
        }
      }
      if (modalWrapper.parentElement) {
        modalWrapper.parentElement.removeChild(modalWrapper);
      }
    };

    if (pages[page]) {
      pages[page](innerWrapper);
    }

    await delay(500);
    innerWrapper.classList.add("show");
  };

  // Open a modal.
  on("open-modal", renderModal);

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
