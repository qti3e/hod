/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import Color from "color";
import { get, set } from "./context";
import { emit, on } from "./ipc";

const styleNode: HTMLStyleElement = document.createElement("style");

type Color = "light" | "dark";

namespace styles {
  export namespace light {
    export const background = Color("#e3e1e1");
    export const primary = Color("#64af88");
    export const secondry = Color("#78a85d");
    export const fg = Color("#001a1c");

    export const lightBackground10 = background.darken(10 / 100);
    export const alphaBackground5 = background.alpha(0.5);
    export const alphaBackground7 = background.alpha(0.7);
    export const darkPrimary25 = primary.lighten(25 / 100);
  }

  export namespace dark {
    export const background = Color("#111c24");
    export const primary = Color("#ff9b26");
    export const secondry = Color("#87cefa");
    export const fg = Color("#fff");

    export const lightBackground10 = background.lighten(10 / 100);
    export const alphaBackground5 = background.alpha(0.5);
    export const alphaBackground7 = background.alpha(0.7);
    export const darkPrimary25 = primary.darken(25 / 100);
  }
}

function change(name: Color): void {
  console.log(name);
  const style = styles[name];
  const newStyle = { name };
  const styleStr = [":root {"];
  for (const key in style) {
    const color = style[key].rgb().string();
    newStyle[key] = color;
    styleStr.push("--" + changeCamelToUnderscore(key) + ":" + color + ";");
  }
  styleStr.push("}");
  const css = styleStr.join("\n");
  styleNode.innerHTML = css;
  if (styleNode.parentElement) {
    styleNode.parentElement.removeChild(styleNode);
  }
  document.body.style.background = style.background.rgb().string();
  document.head.appendChild(styleNode);
  emit("color-changed", newStyle);
}

function changeCamelToUnderscore(str: string): string {
  const tmp = [];
  let skip = false;
  for (const char of str) {
    if (char !== char.toLowerCase() || char === char.toUpperCase()) {
      if (!skip) {
        tmp.push("-");
      }
      skip = true;
    } else {
      skip = false;
    }
    tmp.push(char.toLowerCase());
  }
  return tmp.join("");
}

on("color", newColor => {
  change(newColor || "light");
  set("color", newColor || "light");
});

setTimeout(() => {
  change(get("color") || "light");
});
