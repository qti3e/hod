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
import { frame as local } from "./local";
import * as t from "./types";
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

  // Navbar
  const navbar = document.createElement("div");
  navbar.id = "navbar";
  navbar.appendChild(document.createElement("div")).id = "b1";
  navbar.appendChild(document.createElement("div")).id = "b2";
  navbar.appendChild(document.createElement("div")).id = "b3";
  // End of Navbar

  // Drop down menu
  const dropbox = document.createElement("div");
  const currentUserEl = document.createElement("div");
  const itemsEl = document.createElement("div");
  const actionsEl = document.createElement("div");
  dropbox.id = "menu";
  dropbox.appendChild(currentUserEl);
  dropbox.appendChild(itemsEl);
  itemsEl.appendChild(actionsEl);
  const dropboxItems = new Map<string, HTMLElement>();

  // TODO(qti3e) Render actions. (login with another account / logout)

  const updateDropbox = () => {
    const currentToken = get("currentToken");
    const tokens = get("tokens");
    // Remove menu from document.
    if (!currentToken && dropbox.parentNode) {
      navbar.parentNode.removeChild(navbar);
      return void dropbox.parentNode.removeChild(dropbox);
    } else if (currentToken && !dropbox.parentNode) {
      prepend(div, dropbox);
      div.insertBefore(navbar, dropbox);
    }
    // Update current user.
    currentUserEl.innerText = getUserName(tokens[currentToken]);

    for (const token in tokens) {
      if (!dropboxItems.has(token)) {
        const item = document.createElement("div");
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

  div.appendChild(closeBtn);
  // End of close button.

  wrapper.appendChild(div);
}

function getUserName(u: t.User): string {
  if (u.uid === 1) {
    return local.admin;
  }
  return u.name + " " + u.lastName;
}
