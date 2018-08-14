/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import { datepicker } from "./datepicker";
import { emit } from "./ipc";
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
  nationalCodeInput.className = "ltr";
  right.appendChild(nationalCodeInput);
  nationalCodeInput.onchange = () => {
    form.nationalCode = nationalCodeInput.value.trim();
  };

  const phoneInput = document.createElement("input");
  phoneInput.placeholder = local.phoneNumber;
  phoneInput.className = "ltr";
  right.appendChild(phoneInput);
  phoneInput.onchange = () => {
    form.phone = phoneInput.value.trim();
  };

  const submitBtn = document.createElement("button");
  submitBtn.innerText = local.submit;
  right.appendChild(submitBtn);
  submitBtn.onclick = () => {
    console.log(form);
  };

  const left = document.createElement("div");
  left.className = "left-split";
  view.appendChild(left);

  // left.appendChild(ticket());
  left.appendChild(ticket());
}

interface Ticket {}

interface TicketElement extends HTMLDivElement {
  data(): Ticket;
}

function ticket(): TicketElement {
  const data: Ticket = {};

  const wrapper = document.createElement("div") as TicketElement;
  wrapper.className = "ticket-wrapper";

  const idInput = document.createElement("input");
  idInput.placeholder = local.id;
  wrapper.appendChild(idInput);

  const passengerNameInput = document.createElement("input");
  passengerNameInput.placeholder = local.passengerName;
  wrapper.appendChild(passengerNameInput);

  const passengerLastnameInput = document.createElement("input");
  passengerLastnameInput.placeholder = local.passengerLastname;
  wrapper.appendChild(passengerLastnameInput);

  const paidInput = document.createElement("input");
  paidInput.placeholder = local.paid;
  paidInput.type = "number";
  wrapper.appendChild(paidInput);

  const receivedInput = document.createElement("input");
  receivedInput.placeholder = local.received;
  receivedInput.type = "number";
  wrapper.appendChild(receivedInput);

  const outlineInput = document.createElement("input");
  outlineInput.placeholder = local.outline;
  wrapper.appendChild(outlineInput);

  const turnlineInput = document.createElement("input");
  turnlineInput.placeholder = local.turnline;
  wrapper.appendChild(turnlineInput);

  const dateInput = document.createElement("input");
  dateInput.placeholder = local.date;
  wrapper.appendChild(dateInput);
  datepicker(dateInput);

  const routeInput = routeSelector();
  wrapper.appendChild(routeInput);

  // TODO(qti3e) Collect data from routeSelector.
  wrapper.data = () => data;

  return wrapper;
}

setTimeout(() => {
  emit("goto", "newCharter");
});
