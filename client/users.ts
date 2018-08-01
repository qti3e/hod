/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

let elCache: HTMLElement;

export function renderUsersList(app: HTMLElement): void {
  if (elCache) {
    return void app.appendChild(elCache);
  }
  const wrapper = document.createElement("div");
  elCache = wrapper;
  wrapper.id = "users-list";

  // TODO

  app.appendChild(wrapper);
}
