/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import { decrypt, encrypt } from "./enc";
import { machineIdSync } from "./mid";
import * as t from "./types";
import { nodeRequire } from "./util";

// This file has two APIs, `set()` and `get()`.
// They can be used to manage a global context.
// It's better (cleaner) than using a global
// variable.
// And also type safer.

const home = nodeRequire("os").homedir();
const file = nodeRequire("path").join(home, ".hod");
const version = "v1";

let context: ContextTypesMap;
const defaultContext: ContextTypesMap = {
  tokens: {},
  currentToken: undefined,
  // Note: There must be no "/" at the end.
  server: "http://localhost:10234/v1"
};

export interface ContextTypesMap {
  tokens: {
    [token: string]: t.User;
  };
  currentToken: string;
  server: string;
}

export function get<T extends keyof ContextTypesMap>(
  key: T
): ContextTypesMap[T] {
  return context[key];
}

export function set<T extends keyof ContextTypesMap>(
  key: T,
  value: ContextTypesMap[T]
): void {
  context[key] = value;
  requestSave();
}

// Save function.
let numRequests = 0;

// Wait for an idle time to save DB.
// So we have no flush or hang on browser window.
function requestSave(): void {
  numRequests++;
  // What if there is no idle time for a long time?
  // In this case just block the window.
  if (numRequests > 5) {
    numRequests = 0;
    return save();
  }
  setTimeout(() => {
    if (numRequests > 0) {
      save();
    }
    numRequests = 0;
  });
}

export function save() {
  const fs = nodeRequire("fs");
  context["__hod"] = version;
  const str = JSON.stringify(context);
  const data = encrypt(str, encKey());
  fs.writeFileSync(file, data);
  console.log("Saved context");
}

function load() {
  const fs = nodeRequire("fs");
  try {
    fs.statSync(file);
    const data = fs.readFileSync(file).toString();
    const str = decrypt(data, encKey());
    const json = JSON.parse(str);
    if (json["__hod"] !== version) throw null;
    context = json;
    console.log("Loaded context", context);
  } catch (e) {
    context = defaultContext;
  }
}

let encKeyCache;
function encKey(): Uint8Array {
  if (encKeyCache) return encKeyCache;
  const key = machineIdSync();
  const ui8 = new Uint8Array(key.length);
  for (let i = 0; i < key.length; ++i) {
    ui8[i] = key.charCodeAt(i);
  }
  encKeyCache = ui8;
  return ui8;
}

load();
