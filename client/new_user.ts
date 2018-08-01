/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import { newUser as local } from "./local";
import { onEnter } from "./util";

let newUserCache: HTMLElement;

export function renderNewUser(app: HTMLElement): void {
  if (newUserCache) {
    return void app.appendChild(newUserCache);
  }
  const wrapper = document.createElement("div");
  newUserCache = wrapper;
  wrapper.id = "new-user";

  const doSubmit = () => {
    submit(
      nameEl.value,
      lastNameEl.value,
      nationalCodeEl.value
    );
  };

  const box = document.createElement("div");
  box.id = "form-box";

  const nameEl = document.createElement("input");
  onEnter(nameEl, doSubmit);
  nameEl.placeholder = local.name;

  const lastNameEl = document.createElement("input");
  onEnter(lastNameEl, doSubmit);
  lastNameEl.placeholder = local.lastName;

  const nationalCodeEl = document.createElement("input");
  onEnter(nationalCodeEl, doSubmit);
  nationalCodeEl.placeholder = local.nationalCode;

  const passwordEl = document.createElement("input");
  passwordEl.type = "password";
  onEnter(passwordEl, doSubmit);
  passwordEl.placeholder = local.password;

  const repeatPasswordEl = document.createElement("input");
  repeatPasswordEl.type = "password";
  onEnter(repeatPasswordEl, doSubmit);
  repeatPasswordEl.placeholder = local.repeatPassword;

  const submitBtn = document.createElement("button");
  submitBtn.innerText = local.submit;
  submitBtn.onclick = doSubmit;

  box.appendChild(nameEl);
  box.appendChild(lastNameEl);
  box.appendChild(nationalCodeEl);
  box.appendChild(passwordEl);
  box.appendChild(repeatPasswordEl);
  box.appendChild(submitBtn);
  wrapper.appendChild(box);

  app.appendChild(wrapper);
}

export function submit(
  name: string,
  lastName: string,
  nationalCode: string
): void {
  console.log(
    name,
    lastName,
    nationalCode
  );
}
