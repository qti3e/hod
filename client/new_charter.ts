/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import axios from "axios";
import { get } from "./context";
import { datepicker } from "./datepicker";
import { emit } from "./ipc";
import { newCharter as local } from "./local";
import { routeSelector } from "./route";
import * as t from "./types";
import { cacheForUser, checkBox } from "./util";

const domCache = cacheForUser<HTMLElement>();
const forms = cacheForUser<t.CharterDoc>();
export function renderNewCharter(app: HTMLElement): void {
  // Check DOM cache for current user.
  if (domCache.has()) {
    return void app.appendChild(domCache.get());
  }

  const form: t.CharterDoc = {
    kind: "internal",
    payer: "",
    payerName: "",
    nationalCode: "",
    phone: "",
    tickets: []
  };

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

  const newTicketBtn = document.createElement("button");
  newTicketBtn.innerText = local.newTicket;
  right.appendChild(newTicketBtn);
  newTicketBtn.onclick = () => newTicket();

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
  submitBtn.onclick = async () => {
    form.tickets = tickets.map(t => t.data());
    console.log("sending form", form);
    await submit(form);
    // Reset form.
    form.payer = "";
    form.payerName = "";
    form.nationalCode = "";
    form.phone = "";
    form.tickets = [];
    // TODO(qti3e) show the saved doc.
    emit("goto", "home");
  };

  const left = document.createElement("div");
  left.className = "left-split";
  view.appendChild(left);

  const tickets: TicketElement[] = [];
  const ticketsWrapper = document.createElement("div");
  left.appendChild(ticketsWrapper);

  function newTicket() {
    tickets.push(ticket());
    renderTickets();
    left.scrollTop = left.scrollHeight;
  }

  function renderTickets() {
    for (let i = 0; i < tickets.length; ++i) {
      if (!tickets[i].parentElement) {
        ticketsWrapper.appendChild(tickets[i]);
      }
    }
  }

  newTicket();
}
interface TicketElement extends HTMLDivElement {
  data(): t.CharterTicket;
}

function ticket(): TicketElement {
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

  wrapper.data = () => ({
    id: idInput.value,
    passengerName: passengerNameInput.value,
    passengerLastname: passengerLastnameInput.value,
    paid: Number(paidInput.value),
    received: Number(receivedInput.value),
    outline: outlineInput.value,
    turnline: turnlineInput.value,
    date: dateInput.value,
    route: routeInput.getDBRoute()
  });

  return wrapper;
}

async function submit(doc: t.CharterDoc): Promise<void> {
  const token = get("currentToken");
  const server = get("server");
  await axios.post(
    server + "/charter/new",
    { doc },
    {
      headers: {
        "hod-token": token
      }
    }
  );
}

// TODO(qti3e) Remove this when we're done.
setTimeout(() => {
  emit("goto", "newCharter");
});
