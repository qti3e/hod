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
import * as t from "./types";
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

class PageIterator {
  constructor(private pagesWrapper) {}

  private newPage() {
    return new Promise(resolve => {
      newPage().then(content => {
        this.pagesWrapper.appendChild(content.parentElement);
        resolve(content);
      });
    });
  }

  [Symbol.iterator]() {
    return {
      next: () => {
        return {
          value: this.newPage(),
          done: false
        };
      }
    };
  }
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

  const pageIterator = new PageIterator(pagesWrapper);

  switch (data.kind) {
    case "charter":
      handlers.charter(data.data, pageIterator);
      break;
  }

  // Print button
  const printBtn = document.createElement("button");
  printBtn.onclick = () => doPrint();
  printBtn.appendChild(fa("print"));
  root.appendChild(printBtn);
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

const handlers = {
  async charter(doc: t.CharterDoc, pages: PageIterator) {
    for (const p of pages) {
      const page = await p;
      console.log(page);
      break;
    }
  }
};
