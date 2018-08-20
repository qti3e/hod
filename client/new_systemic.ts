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
import { newSystemic as local } from "./local";
import { routeSelector } from "./route";
import * as t from "./types";
import { cacheForUser, checkBox } from "./util";

const domCache = cacheForUser<HTMLElement>();
const forms = cacheForUser<t.SystemicDoc>();

export function renderNewSystemic(app: HTMLElement): void {
  // Check DOM cache for current user.
  if (domCache.has()) {
    return void app.appendChild(domCache.get());
  }

  const form: t.SystemicDoc = {
    kind: "internal",
    payer: "",
    payerName: "",
    nationalCode: "",
    phone: "",
    tickets: [],
    receives: {
      ICI: 0,
      cache: 0,
      companyCost: 0,
      credit: 0,
      installmentBase: 0,
      wage: 0
    }
  };

  forms.set(form);

  // Create wrapper
  const wrapper = document.createElement("div");
  wrapper.id = "new-systemic";
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
  right.appendChild(internalCheckBox.parentElement);
  internalCheckBox.onchange = () => {
    if (internalCheckBox.checked) {
      form.kind = "internal";
    }
    updateCheckbox();
  };

  const internationalCheckBox = checkBox(local.international);
  right.appendChild(internationalCheckBox.parentElement);
  internationalCheckBox.onchange = () => {
    if (internationalCheckBox.checked) {
      form.kind = "international";
    }
    updateCheckbox();
  };

  const trainCheckbox = checkBox(local.train);
  right.appendChild(trainCheckbox.parentElement);
  trainCheckbox.onchange = () => {
    if (trainCheckbox.checked) {
      form.kind = "train";
    }
    updateCheckbox();
  };

  function updateCheckbox() {
    trainCheckbox.checked = form.kind === "train";
    internationalCheckBox.checked = form.kind === "international";
    internalCheckBox.checked = form.kind === "internal";
  }

  updateCheckbox();

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

  const receivesWrapper = document.createElement("div");
  receivesWrapper.className = "receives-wrapper";
  left.appendChild(receivesWrapper);

  for (const name in form.receives) {
    if (local[name]) {
      const tmpInput = document.createElement("input");
      tmpInput.placeholder = local[name];
      receivesWrapper.appendChild(tmpInput);
      tmpInput.onchange = () => (form.receives.ICI = Number(tmpInput.value));
    }
  }

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
  data(): t.SystemicTicket;
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

  const idInput = document.createElement("input");
  idInput.placeholder = local.id;
  g1.appendChild(idInput);

  const dateInput = document.createElement("input");
  dateInput.placeholder = local.date;
  g1.appendChild(dateInput);
  datepicker(dateInput);

  const receivedInput = document.createElement("input");
  receivedInput.placeholder = local.received;
  receivedInput.type = "number";
  g2.appendChild(receivedInput);

  const outlineInput = document.createElement("input");
  outlineInput.placeholder = local.outline;
  g2.appendChild(outlineInput);

  const passengerNameInput = document.createElement("input");
  passengerNameInput.placeholder = local.passengerName;
  g3.appendChild(passengerNameInput);

  const passengerLastnameInput = document.createElement("input");
  passengerLastnameInput.placeholder = local.passengerLastname;
  g3.appendChild(passengerLastnameInput);

  const routeInput = routeSelector();
  wrapper.appendChild(routeInput);

  wrapper.data = () => ({
    id: idInput.value,
    passengerName: passengerNameInput.value,
    passengerLastname: passengerLastnameInput.value,
    received: Number(receivedInput.value),
    outline: outlineInput.value,
    date: Number(dateInput.getAttribute("data-day")),
    route: routeInput.getDBRoute()
  });

  return wrapper;
}

async function submit(doc: t.SystemicDoc): Promise<void> {
  const token = get("currentToken");
  const server = get("server");
  await axios.post(
    server + "/systemic/new",
    { doc },
    {
      headers: {
        "hod-token": token
      }
    }
  );
}
