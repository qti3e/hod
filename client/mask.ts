/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import { normalizeText, toPersianDigits } from "./persian";

export function numberMask(input?: HTMLInputElement): HTMLInputElement {
  if (!input) {
    input = document.createElement("input");
  }

  // Using selectionStart is not allowed with an input whose type
  // is number.
  input.type = "text";
  input.classList.add("ltr");

  let value = [...input.value];
  let prevLen = value.length;
  updateInputValue();

  function updateInputValue() {
    value = value.filter(x => x !== null);

    value = value.reverse();
    const numSpaces = Math.floor((value.length - 1) / 3);
    for (let i = 0; i < numSpaces; ++i) {
      value.splice((i + 1) * 3 + i, 0, null);
    }
    value = value.reverse();

    const cursor = input.selectionStart;

    const str = value
      .map(x => (x === null ? "," : toPersianDigits(x)))
      .join("");
    input.setAttribute("value", str);

    input.selectionStart = cursor + (value.length - prevLen);
    prevLen = value.length;
  }

  input.addEventListener(
    "keydown",
    (e: KeyboardEvent): void => {
      // Tab key.
      if (e.keyCode === 9) {
        return;
      }

      const cursor = input.selectionStart;

      // Backspace
      if (e.keyCode === 8) {
        value.splice(cursor - 1, 1);
      }

      // Delete
      if (e.keyCode === 46) {
        value.splice(cursor, 1);
      }

      // Arrow left
      if (e.keyCode === 37 && cursor > 0) {
        input.selectionStart = cursor - 1;
        input.selectionEnd = input.selectionStart;
      }

      // Arrow right
      if (e.keyCode === 39) {
        input.selectionStart = cursor + 1;
        input.selectionEnd = input.selectionStart;
      }

      const key = normalizeText(e.key);

      if (/^\d$/.test(key)) {
        value.splice(cursor, 0, key);
      }

      e.preventDefault();
      updateInputValue();
    }
  );

  Object.defineProperty(input, "value", {
    get() {
      return value.filter(x => x !== null).join("");
    },
    set(val: string): void {
      value = [...val];
      prevLen = value.length;
      updateInputValue();
    }
  });

  Object.defineProperty(input, "type", {
    get() {
      return "text";
    },
    set() {}
  });

  return input;
}

export function numberMaskString(a: string | number): string {
  if (a === undefined || a === null) {
    return "";
  }
  let value = [...String(a)];
  value = value.reverse();
  const numSpaces = Math.floor((value.length - 1) / 3);
  for (let i = 0; i < numSpaces; ++i) {
    value.splice((i + 1) * 3 + i, 0, null);
  }
  value = value.reverse();

  return value.map(x => (x === null ? "," : toPersianDigits(x))).join("");
}
