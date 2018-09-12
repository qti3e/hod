/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import * as Electron from "electron";
import { emit } from "./ipc";
import { print as local } from "./local";
import { nodeRequire } from "./util";

const { remote }: typeof Electron = nodeRequire("electron");
const currentWindow = remote.getCurrentWindow();

export interface PrintData {
}

export function requestPrint(data: PrintData) {
  const { BrowserWindow } = remote;

  const win = new BrowserWindow({
    minWidth: 1200,
    minHeight: 800,
    backgroundColor: "#fff",
    icon: __dirname + "/favicon.png",
    show: false,
    modal: true,
    parent: currentWindow
  });

  // Disable default menu bar.
  win.setMenu(null);
  win.setTitle("Report View");
  win.center();

  win.webContents.toggleDevTools();
  win.show();

  const url = new URL(document.location.href);
  const search = new URLSearchParams(url.search);
  search.set("print", "true");
  search.set("data", JSON.stringify(data));
  url.search = search.toString();
  win.loadURL(url.href);
}

export function renderPrintView(root: HTMLElement, data: PrintData): void {
  root.classList.add("print-view");
  root.innerText = JSON.stringify(data, null, 4);

  // Render print header.

  doPrint();
}

function doPrint() {
  // Print document...
  currentWindow.webContents.print({}, printed => {
    if (printed) {
      emit("notification", local.success);
    }
  });

  // Close the window after the next tick.
  setTimeout(() => {
    currentWindow.close();
  });
}

window["doPrint"] = doPrint;
