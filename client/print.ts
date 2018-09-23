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
import * as handlers from "./print_handlers";
import { delay, fa, nodeRequire } from "./util";

const { remote }: typeof Electron = nodeRequire("electron");
const currentWindow = remote.getCurrentWindow();

export interface PrintData {
  kind: string;
  data: any;
}

export function requestPrint(data: PrintData) {
  const { BrowserWindow } = remote;

  const win = new BrowserWindow({
    width: 1200,
    height: 1000,
    backgroundColor: "#e0e0e0",
    icon: __dirname + "/favicon.png",
    show: true
  });

  // Disable default menu bar.
  win.setMenu(null);
  win.setTitle(local.title);
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

export async function renderPrintView(
  root: HTMLElement,
  data: PrintData
): Promise<void> {
  document.title = local.title;
  root.classList.add("print-view");
  document.body.classList.add("A4");

  const pagesWrapper = document.createElement("div");
  pagesWrapper.className = "pages-wrapper";
  root.appendChild(pagesWrapper);

  switch (data.kind) {
    case "charter":
      handlers.charter(data.data, pagesWrapper);
      break;
    case "systemic":
      handlers.systemic(data.data, pagesWrapper);
      break;
  }

  // Print button
  const printBtn = document.createElement("button");
  printBtn.onclick = () => doPrint();
  printBtn.appendChild(fa("print"));
  root.appendChild(printBtn);
}

function doPrint(): void {
  // Print document...
  currentWindow.webContents.print({}, async printed => {
    if (printed) {
      emit("notification", local.success);
      await delay();
      currentWindow.close();
    }
  });
}
