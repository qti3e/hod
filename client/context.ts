/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

// This file has two APIs, `set()` and `get()`.
// They can be used to manage a global context.
// It's better (cleaner) than using a global
// variable.
// And also type safer.

const context: ContextTypesMap = {};

export interface ContextTypesMap {
  isLoggedIn?: boolean;
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
  save();
}

function save() {
  // TODO(qti3e) Save context somewhere like localStorage or maybe
  // a file as we use electron :D
}
