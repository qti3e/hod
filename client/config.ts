/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import axios from "axios";
import { get, set, version } from "./context";
import { emit } from "./ipc";
import { config as local } from "./local";

let open = false;

export function renderConfig(
  app: HTMLElement,
  param?: any,
  close?: (e?: boolean) => Promise<void>
): void {
  open = true;

  const wrapper = document.createElement("div");
  wrapper.id = "config-page-wrapper";
  app.appendChild(wrapper);
  wrapper.addEventListener("component-will-unmount", e => e.preventDefault());

  let host = get("host");

  async function setHost() {
    host = host.trim();
    if (host.endsWith("/")) {
      host = host.substr(0, -1);
    }
    try {
      const server = host + "/info";
      const res = await axios.get(server);
      const versions = res.data.versions;
      if (versions.indexOf(version) === -1) {
        emit("notification", local.versionError);
      } else {
        set("host", host);
        emit("notification", local.done);
        open = false;
        close(false);
      }
    } catch (e) {
      emit("notification", local.error);
    }
  }

  const head = document.createElement("h1");
  head.innerText = local.title;
  wrapper.appendChild(head);

  const formWrapper = document.createElement("form");
  formWrapper.className = "form";
  wrapper.appendChild(formWrapper);

  const hostEl = document.createElement("input");
  hostEl.className = "ltr";
  hostEl.placeholder = local.host;
  hostEl.value = host;
  formWrapper.appendChild(hostEl);

  const setBtn = document.createElement("button");
  setBtn.innerText = local.set;
  setBtn.type = "submit";
  formWrapper.appendChild(setBtn);

  // Bind events.
  hostEl.onchange = () => {
    host = hostEl.value;
  };
  formWrapper.onsubmit = () => {
    setHost();
    return false;
  };
}

async function pingServer() {
  if (open) return;
  try {
    const server = get("host") + "/info";
    const res = await axios.get(server);
    const versions = res.data.versions;
    if (versions.indexOf(version) === -1) {
      throw null;
    }
  } catch (e) {
    emit("open-modal", "config");
  }
}

setInterval(pingServer, 3e3);

pingServer();
