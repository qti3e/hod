/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import { newCharter as local } from "./local";
import { routeSelector } from "./route";
import { cacheForUser, checkBox } from "./util";

const domCache = cacheForUser<HTMLElement>();
const forms = cacheForUser<NewCharterFormType>();

interface NewCharterFormType {
  kind: "internal" | "international";
  payer: string;
  payerName: string;
  nationalCode: string;
  phone: string;
}

export function renderNewCharter(app: HTMLElement): void {
  // Check DOM cache for current user.
  if (domCache.has()) {
    return void app.appendChild(domCache.get());
  }

  const form: NewCharterFormType = {
    kind: "internal",
    payer: "",
    payerName: "",
    nationalCode: "",
    phone: ""
  };
  // Debug.
  window["charterForm"] = form;

  forms.set(form);

  // Create wrapper
  const wrapper = document.createElement("div");
  wrapper.id = "new-charter";
  wrapper.classList.add("full-page");
  domCache.set(wrapper);
  app.appendChild(wrapper);

  const title = document.createElement("h1");
  title.innerText = local.title;
  wrapper.appendChild(title);

  const view = document.createElement("div");
  view.className = "view";
  wrapper.appendChild(view);

  const right = document.createElement("div");
  right.className = "right-split";
  view.appendChild(right);

  const serviceKindText = document.createElement("h3");
  serviceKindText.innerText = local.serviceKind;
  right.appendChild(serviceKindText);

  const internalCheckBox = checkBox(local.internal);
  internalCheckBox.checked = form.kind === "internal";
  right.appendChild(internalCheckBox.parentElement);
  internalCheckBox.onchange = () => {
    internationalCheckBox.checked = !internationalCheckBox.checked;
    form.kind = internalCheckBox.checked ? "internal" : "international";
  };

  const internationalCheckBox = checkBox(local.international);
  internationalCheckBox.checked = form.kind === "international";
  right.appendChild(internationalCheckBox.parentElement);
  internationalCheckBox.onchange = () => {
    internalCheckBox.checked = !internalCheckBox.checked;
    form.kind = internalCheckBox.checked ? "internal" : "international";
  };

  const payerInput = document.createElement("input");
  payerInput.placeholder = local.payer;
  right.appendChild(payerInput);
  payerInput.onchange = () => {
    form.payer = payerInput.value.trim();
  };

  const payerNameInput = document.createElement("input");
  payerNameInput.placeholder = local.nameOfPayer;
  right.appendChild(payerNameInput);
  payerNameInput.onchange = () => {
    form.payerName = payerNameInput.value.trim();
  };

  const nationalCodeInput = document.createElement("input");
  nationalCodeInput.placeholder = local.nationalCode;
  right.appendChild(nationalCodeInput);
  nationalCodeInput.onchange = () => {
    form.nationalCode = nationalCodeInput.value.trim();
  };

  const phoneInput = document.createElement("input");
  phoneInput.placeholder = local.phoneNumber;
  right.appendChild(phoneInput);
  phoneInput.onchange = () => {
    form.phone = phoneInput.value.trim();
  };

  const left = document.createElement("div");
  left.className = "left-split";
  view.appendChild(left);

  left.appendChild(routeSelector());
  left.appendChild(routeSelector());
}
