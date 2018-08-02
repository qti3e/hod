/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

export function delay(t: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, t));
}

export function len(o: {}): number {
  return Object.keys(o).length;
}

export function onEnter(el: HTMLElement, cb): void {
  el.addEventListener("keyup", e => {
    if (e.keyCode === 13) {
      cb();
    }
  });
}

export function prepend(parent: HTMLElement, el: HTMLElement): void {
  parent.insertBefore(el, parent.childNodes[0]);
}

export function nodeRequire(module: string): any {
  return require(module);
}

export function fa(icon: string): HTMLElement {
  const span = document.createElement("span");
  span.classList.add("fa");
  span.classList.add("fa-" + icon);
  return span;
}

export function resetValue(...elements: HTMLInputElement[]) {
  for (const element of elements) {
    element.value = "";
  }
}
