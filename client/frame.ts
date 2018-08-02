/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import { PageName } from "./app";
import { get, set } from "./context";
import { save } from "./context";
import { emit, on } from "./ipc";
import { frame as local } from "./local";
import * as t from "./types";
import { nodeRequire, prepend } from "./util";

const { remote } = nodeRequire("electron");

let frameCache: HTMLElement;

/**
 * Renders electron window's frame.
 */
export function renderFrame(app: HTMLElement): void {
  if (frameCache) {
    return void app.appendChild(frameCache);
  }
  const wrapper = document.createElement("div");
  frameCache = wrapper;
  wrapper.id = "frame-wrapper";

  // Navbar
  const navbar = document.createElement("button");
  navbar.id = "navbar";
  navbar.appendChild(document.createElement("div")).id = "b1";
  navbar.appendChild(document.createElement("div")).id = "b2";
  navbar.appendChild(document.createElement("div")).id = "b3";
  let previousPage: PageName;
  let isOpen = false;
  on("route-change", page => {
    if (page === "menu") {
      navbar.classList.add("open");
      isOpen = true;
    } else {
      previousPage = page;
      navbar.classList.remove("open");
      isOpen = false;
    }
  });
  navbar.onclick = () => {
    if (isOpen) {
      emit("goto", previousPage);
    } else {
      emit("goto", "menu");
    }
  };
  // End of Navbar

  // Drop down menu
  const dropbox = document.createElement("div");
  const currentUserEl = document.createElement("button");
  const itemsEl = document.createElement("div");
  const actionsEl = document.createElement("div");
  dropbox.id = "dropdown";
  itemsEl.id = "items";
  actionsEl.id = "actions";
  dropbox.appendChild(currentUserEl);
  dropbox.appendChild(itemsEl);
  itemsEl.appendChild(actionsEl);
  const dropboxItems = new Map<string, HTMLElement>();

  // Render actions. (login with another account / logout)
  const logoutBtn = document.createElement("button");
  logoutBtn.id = "logout";
  logoutBtn.innerText = local.logout;
  logoutBtn.onclick = () => {
    const currentToken = get("currentToken");
    const tokens = get("tokens");
    delete tokens[currentToken];
    const tokenKeys = Object.keys(tokens);
    set("currentToken", tokenKeys[0]);
    emit("login", tokens[tokenKeys[0]]);
    emit("goto", "home");
  };
  actionsEl.appendChild(logoutBtn);

  const loginBtn = document.createElement("button");
  loginBtn.id = "login";
  loginBtn.innerText = local.login;
  loginBtn.onclick = () => {
    emit("goto", "login");
  };
  actionsEl.appendChild(loginBtn);

  const updateDropbox = () => {
    const currentToken = get("currentToken");
    const tokens = get("tokens");
    // Remove menu from document.
    if (!currentToken && dropbox.parentNode) {
      navbar.parentNode.removeChild(navbar);
      return void dropbox.parentNode.removeChild(dropbox);
    } else if (currentToken && !dropbox.parentNode) {
      prepend(wrapper, dropbox);
      wrapper.insertBefore(navbar, dropbox);
    } else if (!currentToken) {
      return;
    }
    // Update current user.
    currentUserEl.innerText = getUserName(tokens[currentToken]);

    for (const token in tokens) {
      if (!dropboxItems.has(token)) {
        const item = document.createElement("div");
        item.classList.add("user");
        item.innerText = getUserName(tokens[token]);
        item.onclick = () => {
          set("currentToken", token);
          emit("login", tokens[token]);
          emit("goto", "home");
        };
        // Render and add to map.
        dropboxItems.set(token, item);
      }
    }

    dropboxItems.forEach((node, token) => {
      if (token === currentToken) {
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
        return;
      }
      if (!tokens[token] && node.parentNode) {
        node.parentNode.removeChild(node);
      } else if (tokens[token] && !node.parentNode) {
        prepend(itemsEl, node);
      }
    });
  };

  on("login", updateDropbox);
  updateDropbox();

  // End of drop down menu.

  // Close button.
  const closeBtn = document.createElement("button");
  closeBtn.id = "close";
  closeBtn.appendChild(document.createElement("div")).id = "b1";
  closeBtn.appendChild(document.createElement("div")).id = "b2";
  closeBtn.onclick = () => {
    save();
    const window = remote.getCurrentWindow();
    window.close();
  };

  wrapper.appendChild(closeBtn);
  // End of close button.

  app.appendChild(wrapper);
}

function getUserName(u: t.User): string {
  if (u.uid === 1) {
    return local.admin;
  }
  return u.name + " " + u.lastName;
}
