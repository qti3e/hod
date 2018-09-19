/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import { config } from "dotenv";
import { app, BrowserWindow } from "electron";

const TITLE = "Hod Hod";

config({
  path: __dirname + "/.env"
});

function main() {
  // Create a new window.
  const win = new BrowserWindow({
    minWidth: 1200,
    minHeight: 800,
    frame: false,
    backgroundColor: "#111c24",
    show: false,
    icon: __dirname + "/favicon.png",
    title: TITLE
  });
  // Disable default menu bar.
  win.setMenu(null);
  win.setTitle(TITLE);
  win.center();

  if (process.env.NODE_ENV === "production") {
    console.log("Production");
    win.loadURL("file://" + __dirname + "/index.html");

    win.webContents.toggleDevTools();
  } else {
    console.log("Development");
    win.loadURL("http://localhost:8080");

    // Open devtools.
    win.webContents.toggleDevTools();
  }

  win.once("ready-to-show", () => {
    win.show();
  });

  win.on("closed", () => app.quit());
}

app.on("ready", main);
