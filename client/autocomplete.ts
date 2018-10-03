/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import axios from "axios";
import { get } from "./context";
import { delay } from "./util";

const wrapper = document.createElement("div");
const titleWrapper = document.createElement("div");
const itemsWrapper = document.createElement("div");
wrapper.appendChild(titleWrapper);
wrapper.appendChild(itemsWrapper);
wrapper.id = "autocomplete";
titleWrapper.className = "title";
itemsWrapper.className = "items";

function show(input: HTMLInputElement) {
  // Ensure that opacity is zero.
  // (It's supposed to be zero.)
  wrapper.style.opacity = "0";
  // Set the position.
  wrapper.style.position = "fixed";
  const top = input.offsetTop + input.offsetHeight;
  const left = input.offsetLeft;
  wrapper.style.top = top + "px";
  wrapper.style.left = left + "px";
  // Hide items.
  itemsWrapper.style.opacity = "0";
  // Add the element to the document.
  const parent = input.parentElement;
  if (!parent) {
    return;
  }
  parent.insertBefore(input.nextSibling);
  // Now show the wrapper.
  wrapper.style.opacity = "1";
}

async function hide() {
  // Start a animation.
  // The tweak is implemented using CSS.
  wrapper.style.opacity = "0";
  // Wait until animation ends.
  await delay(150);
  // Remove the element from the document.
  const parent = wrapper.parentElement;
  if (parent) {
    parent.removeElement(wrapper);
  }
}

function renderItems(items: string[], cb) {
  itemsWrapper.innerHTML = "";
  itemsWrapper.style.opacity = "1";
  for (const item of items) {
    const btn = document.createElement("button");
    btn.innerHTML = item;
    btn.onclick = () => cb(item);
    itemsWrapper.appendChild(btn);
  }
}

async function fetchData(
  id: string,
  text: string,
  items: string[],
  cache: Map,
  cb
) {
  text = text.trim();
  const server = get("server");
  const tokens = get("tokens");
  if (text.length < 2) return;
  items.splice(0);
  if (cache.has(text)) {
    items.push(...cache.get(text));
    renderItems(items, cb);
  }
  const { data } = await axios.post(
    server + "/autocomplete/get",
    {
      id,
      text
    },
    {
      headers: {
        "hod-token": token
      }
    }
  );
  items.splice(0);
  data.ret.sort((a, b) => a[1] - b[1]);
  data.ret = data.ret.map(x => x[0]);
  items.push(...data.ret);
  renderItems(items, cb);
  cache.set(text, data.ret);
}

const values = {};
const caches = new Map();

// Public functions.

export function autocompleteInput(id: string, input: HTMLInputElement) {
  if (!caches.has(id)) {
    caches.set(id, new Map());
  }
  const cache = caches.get(id);
  const items = [];
  let selected = false;

  const css = () => {
    if (selected) {
      input.classList.add("ac-sel");
    } else {
      input.classList.remove("ac-sel");
    }
  };

  const cb = (value: string) => {
    selected = true;
    css();
    input.value = value;
    values[id] = input.value.trim();
  };

  fetchData(id, input.value, items, cb, cache);

  // Attach the event listeners.
  input.addEventListener("change", () => {
    values[id] = input.value.trim();
  });
  input.addEventListener("keydown", () => {
    selected = false;
    css();
    values[id] = input.value.trim();
    fetchData(id, input.value, items, cb, cache);
  });
  input.addEventListener("focus", () => {
    show(input);
    renderItems(items);
  });
  input.addEventListener("blur", () => {
    hide();
  });
}

export function sendData(): void {
  const data = [];
  for (const key in values) {
    data.push([key, values]);
  }
  if (data.length < 1) return;
  const server = get("server");
  const tokens = get("tokens");
  axios.post(
    server + "/autocomplete/add_array",
    {
      data
    },
    {
      headers: {
        "hod-token": token
      }
    }
  );
}

export function resetData(): void {
  for (const key in values) {
    delete values[key];
  }
}
