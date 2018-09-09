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
    providedBy: "credit",
    payer: "",
    payerName: "",
    nationalCode: "",
    phone: "",
    tickets: [],
    pay: {
      base: {
        ICI: 0,
        cache: 0,
        companyCost: 0,
        credit: 0,
        installmentBase: 0,
        wage: 0
      },
      receives: [],
      payments: [],
      additionalComments: ""
    }
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

  const providedByText = document.createElement("h3");
  providedByText.innerText = local.providedBy;
  right.appendChild(providedByText);

  const cacheCheckBox = checkBox(local.pCache);
  cacheCheckBox.checked = form.providedBy === "cache";
  right.appendChild(cacheCheckBox.parentElement);
  cacheCheckBox.onchange = () => {
    creditCheckBox.checked = !creditCheckBox.checked;
    form.providedBy = creditCheckBox.checked ? "credit" : "cache";
  };

  const creditCheckBox = checkBox(local.pCredit);
  creditCheckBox.checked = form.providedBy === "credit";
  right.appendChild(creditCheckBox.parentElement);
  creditCheckBox.onchange = () => {
    cacheCheckBox.checked = !cacheCheckBox.checked;
    form.providedBy = creditCheckBox.checked ? "credit" : "cache";
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

  const payBtn = document.createElement("button");
  payBtn.innerText = local.pay;
  right.appendChild(payBtn);
  // Update payment information of the form.
  const payCb = (data: t.CharterPayData) => {
    // We pass form.data by reference, is this
    // thing even needed? No, but let's be sure
    // about what the heck we're doing.
    form.pay = data;
  };
  payBtn.onclick = () => {
    emit("open-modal", {
      page: "charterPayCounter",
      param: {
        cb: payCb,
        // TODO(qti3e) Sum tickets.
        total: 0,
        data: form.pay
      }
    });
  };
  // TODO(qti3e) Remove after dev time.
  payBtn.onclick(null);

  const submitBtn = document.createElement("button");
  submitBtn.innerText = local.submit;
  right.appendChild(submitBtn);
  submitBtn.onclick = async () => {
    form.tickets = tickets.map(t => t.data());
    console.log("sending form", form);
    await submit(form);
    // Reset form.
    domCache.delete();
    // TODO(qti3e) show the saved doc.
    emit("goto", "home");
  };

  const left = document.createElement("div");
  left.className = "left-split";
  view.appendChild(left);

  const tickets: TicketElement[] = [];
  const ticketsWrapper = document.createElement("div");
  ticketsWrapper.className = "tickets-wrapper";
  left.appendChild(ticketsWrapper);

  function newTicket() {
    tickets.push(ticket());
    renderTickets();
    ticketsWrapper.scrollTop = ticketsWrapper.scrollHeight;
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

  // Create input groups.
  const g1 = document.createElement("div");
  g1.className = "group g1";
  wrapper.appendChild(g1);
  const g2 = document.createElement("div");
  g2.className = "group g2";
  wrapper.appendChild(g2);
  const g3 = document.createElement("div");
  g3.className = "group g3";
  wrapper.appendChild(g3);
  const g4 = document.createElement("div");
  g4.className = "group g4";
  wrapper.appendChild(g4);

  const idInput = document.createElement("input");
  idInput.placeholder = local.id;
  g1.appendChild(idInput);

  const dateInput = document.createElement("input");
  dateInput.placeholder = local.date;
  g1.appendChild(dateInput);
  datepicker(dateInput);

  const paidInput = document.createElement("input");
  paidInput.placeholder = local.paid;
  paidInput.type = "number";
  g2.appendChild(paidInput);

  const receivedInput = document.createElement("input");
  receivedInput.placeholder = local.received;
  receivedInput.type = "number";
  g2.appendChild(receivedInput);

  const passengerNameInput = document.createElement("input");
  passengerNameInput.placeholder = local.passengerName;
  g3.appendChild(passengerNameInput);

  const passengerLastnameInput = document.createElement("input");
  passengerLastnameInput.placeholder = local.passengerLastname;
  g3.appendChild(passengerLastnameInput);

  const outlineInput = document.createElement("input");
  outlineInput.placeholder = local.outline;
  g4.appendChild(outlineInput);

  const turnlineInput = document.createElement("input");
  turnlineInput.placeholder = local.turnline;
  g4.appendChild(turnlineInput);

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
    date: Number(dateInput.getAttribute("data-day")),
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
