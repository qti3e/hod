/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import { app, BrowserWindow } from "electron";

function main() {
  // Create a new window.
  const win = new BrowserWindow({
    minWidth: 1200,
    minHeight: 800,
    frame: false,
    backgroundColor: "#111c24",
    show: false
  });
  // Disable default menu bar.
  win.setMenu(null);

  // TODO(qti3e) Load production build in production.
  win.loadURL("http://localhost:8080");

  // Open devtools.
  win.webContents.toggleDevTools();

  win.once("ready-to-show", () => {
    win.show();
  });
}

app.on("ready", main);
