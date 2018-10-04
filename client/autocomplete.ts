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
const itemsWrapper = document.createElement("div");
wrapper.appendChild(itemsWrapper);
wrapper.id = "autocomplete";
itemsWrapper.className = "items";

function show(input: HTMLInputElement) {
  wrapper.style = "";
  // Ensure that opacity is zero.
  // (It's supposed to be zero.)
  wrapper.style.opacity = "0";
  // Set the position.
  wrapper.style.position = "fixed";
  const rect = input.getBoundingClientRect();
  const left = rect.left;
  const top = rect.top + input.offsetHeight;
  wrapper.style.width = input.offsetWidth + "px";
  wrapper.style.left = left + "px";
  wrapper.style.top = top + "px";
  wrapper.style.borderRadius = "0 0 25px 25px";
  wrapper.style.borderTop = "none";
  // Hide items.
  itemsWrapper.style.opacity = "0";
  // Add the element to the document.
  const parent = input.parentElement;
  if (!parent) {
    return;
  }
  parent.insertBefore(wrapper, input.nextSibling);
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
    parent.removeChild(wrapper);
  }
  // Remove items.
  itemsWrapper.innerHTML = "";
}

function renderItems(items: string[], cb) {
  itemsWrapper.innerHTML = "";
  itemsWrapper.style.opacity = "1";
  for (const item of items) {
    const btn = document.createElement("button");
    btn.innerHTML = item;
    btn.onclick = () => {
      cb(item);
    };
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
  const token = get("currentToken");
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
  items.push(...data.ret);
  renderItems(items, cb);
  cache.set(text, data.ret);
}

const values = [];
const caches = new Map();
let last_id = 0;
let current_id;

// Public functions.

export function autocompleteInput(id: string, input: HTMLInputElement) {
  if (!caches.has(id)) {
    caches.set(id, new Map());
  }
  const cache = caches.get(id);
  const items = [];
  let selected = false;
  const fid = last_id++;
  const arr = [id, ""];
  values.push(arr);

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
    arr[1] = input.value.trim();
  };

  fetchData(id, input.value, items, cache, cb);

  // Attach the event listeners.
  input.addEventListener("change", () => {
    arr[1] = input.value.trim();
    fetchData(id, input.value, items, cache, cb);
  });
  input.addEventListener("keyup", () => {
    selected = false;
    css();
    arr[1] = input.value.trim();
    fetchData(id, input.value, items, cache, cb);
  });
  input.addEventListener("focus", () => {
    current_id = fid;
    show(input);
    renderItems(items, cb);
  });
  input.addEventListener("blur", () => {
    setTimeout(() => {
      if (current_id === fid) {
        current_id = null;
        hide();
      }
    }, 300);
  });
}

export function sendData(): void {
  const data = [];
  for (const [k, v] of values) {
    data.push([k, v]);
  }
  resetData();
  if (data.length < 1) return;
  const server = get("server");
  const token = get("currentToken");
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
  values.splice(0);
}

window["sampleData"] = () => {
  const data = [
    ["first_name", "test"],
    ["first_name", "test"],
    ["first_name", "test"],
    ["first_name", "test"],
    ["first_name", "test"],
    ["first_name", "test"],
    ["first_name", "testal"],
    ["first_name", "testol"],
    ["first_name", "abc"],
    ["first_name", "abcd"],
    ["first_name", "abce"],
    ["first_name", "abce"],
  ];
  const server = get("server");
  const token = get("currentToken");
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
