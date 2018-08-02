/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import { readFileSync } from "fs";
import { get } from "./context";

let homeElCache: HTMLElement;

let text: HTMLElement;
let author: HTMLElement;
let time = 0;
let lastToken: string;

const quotes = [];

export function renderHome(app: HTMLElement): void {
  if (homeElCache) {
    if (Date.now() - time >= 2e3 * 60 || lastToken !== get("currentToken")) {
      update();
    }
    return void app.appendChild(homeElCache);
  }
  const wrapper = document.createElement("div");
  wrapper.id = "home";
  homeElCache = wrapper;
  text = document.createElement("p");
  author = document.createElement("h1");

  update();

  wrapper.appendChild(text);
  wrapper.appendChild(author);

  app.appendChild(wrapper);
}

function update(): void {
  load();
  time = Date.now();
  lastToken = get("currentToken");
  const id = Math.floor(Math.random() * quotes.length);
  const quote = quotes[id];
  text.innerText = quote.text;
  author.innerText = quote.author;
}

function load(): void {
  if (quotes.length > 0) return;
  const data = readFileSync("./quotes.txt").toString().split(/\r?\n\r?\n/g);
  for (const e of data) {
    const q = e.split(/\r?\n/g).filter(a => a.trim().length > 0);
    const quote = {
      text: undefined,
      author: ""
    };
    if (q.length > 2) {
      console.error(q);
      throw new Error("quotes.txt is corrupted.");
    }
    quote.text = q[0].trim();
    if (q[1]) {
      quote.author = "- " + q[1].trim();
    }
    quotes.push(quote);
  }
  console.log(`loaded %d quotes`, quotes.length);
}
