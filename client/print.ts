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
import { delay, nodeRequire } from "./util";

const { remote }: typeof Electron = nodeRequire("electron");
const currentWindow = remote.getCurrentWindow();

export interface PrintData {}

export function requestPrint(data: PrintData) {
  const { BrowserWindow } = remote;

  const win = new BrowserWindow({
    width: 1200,
    height: 1000,
    backgroundColor: "#e0e0e0",
    icon: __dirname + "/favicon.png",
    show: true,
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

  // Render print header.
  const pageContent = await newPage();
  pagesWrapper.appendChild(pageContent.parentElement);

  pageContent.appendChild(document.createElement("h1")).innerText = "تست";

  const pageContent2 = await newPage();
  pagesWrapper.appendChild(pageContent2.parentElement);

  pageContent2.appendChild(document.createElement("h1")).innerText = "تست";

  // Wait till it loads fonts and then request print.
  await delay(50);
  doPrint();
}

function newPage(): Promise<HTMLElement> {
  let resolve;
  const promise = new Promise<HTMLElement>(r => (resolve = r));

  const page = document.createElement("div");
  page.className = "sheet padding-5mm";

  const pageHead = document.createElement("div");
  pageHead.className = "header";
  page.appendChild(pageHead);

  const logo = document.createElement("img");
  logo.src = require("./assets/logo.png");
  pageHead.appendChild(logo);

  const contentWrapper = document.createElement("div");
  contentWrapper.className = "content";
  page.appendChild(contentWrapper);

  logo.onload = () => resolve(contentWrapper);

  return promise;
}

async function doPrint(): Promise<void> {
  // Print document...
  currentWindow.webContents.print({}, printed => {
    if (printed) {
      emit("notification", local.success);
    }
  });

  await delay();
  // currentWindow.close();
}

window["doPrint"] = doPrint;
