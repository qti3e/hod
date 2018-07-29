/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import * as t from "./types";

// This file has two APIs, `set()` and `get()`.
// They can be used to manage a global context.
// It's better (cleaner) than using a global
// variable.
// And also type safer.

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
// So we have no flush or hang on browser.
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

function save() {
  // TODO(qti3e) Save context somewhere like localStorage or maybe
  // a file as we use electron :D
}

function load() {
  // TODO(qti3e) Load context from where we saved in `save()`.
  context = defaultContext;
}

load();
