/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import axios from "axios";
import { autocompleteInput, sendData, resetData } from "./autocomplete";
import { get } from "./context";
import { datepicker } from "./datepicker";
import { inputWithLabel } from "./input";
import { emit } from "./ipc";
import { newSystemic as local } from "./local";
import { numberMask, numberMaskString } from "./mask";
import { routeSelector } from "./route";
import * as t from "./types";
import { cacheForUser, checkBox, fa, sumSystemicTickets } from "./util";

const domCache = cacheForUser<HTMLElement>();
const forms = cacheForUser<t.SystemicDoc>();

export function renderNewSystemic(app: HTMLElement): void {
  resetData();
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
      additionalComments: ""
    }
  };

  forms.set(form);

  // Create wrapper
  const wrapper = document.createElement("div");
  wrapper.id = "new-systemic";
  wrapper.classList.add("full-page");
  domCache.set(wrapper);
  app.appendChild(wrapper);

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

  const totalReceivesLabel = document.createElement("h3");
  totalReceivesLabel.innerText = "مجموع دریافتی:";
  totalReceivesLabel.style.margin = "0";
  right.appendChild(totalReceivesLabel);

  const totalReceives = document.createElement("h2");
  totalReceives.innerText = numberMaskString(0);
  totalReceives.style.textAlign = "center";
  totalReceives.style.margin = "0";
  right.appendChild(totalReceives);

  const updateSums = () => {
    const sum = sumSystemicTickets(tickets.filter(x => !!x).map(t => t.data()));
    totalReceives.innerText = numberMaskString(sum.totalReceived);
  };

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

  const payerInput = inputWithLabel(true);
  payerInput.placeholder = local.payer;
  right.appendChild(payerInput.parentElement);
  payerInput.onchange = () => {
    form.payer = payerInput.value.trim();
  };
  autocompleteInput("payer", payerInput);

  const payerNameInput = inputWithLabel(true);
  payerNameInput.placeholder = local.nameOfPayer;
  right.appendChild(payerNameInput.parentElement);
  payerNameInput.onchange = () => {
    form.payerName = payerNameInput.value.trim();
  };
  autocompleteInput("payer_name", payerNameInput);

  const nationalCodeInput = inputWithLabel(true);
  nationalCodeInput.placeholder = local.nationalCode;
  nationalCodeInput.className = "ltr";
  right.appendChild(nationalCodeInput.parentElement);
  nationalCodeInput.onchange = () => {
    form.nationalCode = nationalCodeInput.value.trim();
  };

  const phoneInput = inputWithLabel(true);
  phoneInput.placeholder = local.phoneNumber;
  phoneInput.className = "ltr";
  right.appendChild(phoneInput.parentElement);
  phoneInput.onchange = () => {
    form.phone = phoneInput.value.trim();
  };

  const payBtn = document.createElement("button");
  payBtn.innerText = local.pay;
  right.appendChild(payBtn);
  // Update payment information of the form.
  const payCb = async (data: t.SystemicPayData, save?: boolean) => {
    // We pass form.data by reference, is this
    // thing even needed? No, but let's be sure
    // about what the heck we're doing.
    form.pay = data;

    if (!save) return;

    form.tickets = tickets.filter(x => !!x).map(t => t.data());
    console.log("sending form", form);
    sendData();
    await submit(form);
    // Reset form.
    // TODO(qti3e) show the saved doc.
    emit("goto", "home");
  };

  payBtn.onclick = () => {
    emit("open-modal", {
      page: "systemicPayCounter",
      param: {
        cb: payCb,
        data: form.pay,
        ...sumSystemicTickets(tickets.filter(x => !!x).map(t => t.data()))
      }
    });
  };

  const left = document.createElement("div");
  left.className = "left-split";
  view.appendChild(left);

  const receivesWrapper = document.createElement("div");
  receivesWrapper.className = "receives-wrapper";
  left.appendChild(receivesWrapper);

  const tickets: TicketElement[] = [];
  const ticketsWrapper = document.createElement("div");
  ticketsWrapper.className = "tickets-wrapper";
  left.appendChild(ticketsWrapper);

  function newTicket() {
    const id = tickets.length;
    tickets.push(
      ticket(() => {
        tickets[id] = undefined;
      }, updateSums)
    );
    for (let prevId = id - 1; prevId >= 0; --prevId) {
      if (!tickets[prevId]) continue;
      const data = tickets[prevId].data();
      tickets[id].data(data);
      break;
    }
    renderTickets();
    updateSums();
    ticketsWrapper.scrollTop = ticketsWrapper.scrollHeight;
  }

  function renderTickets() {
    for (let i = 0; i < tickets.length; ++i) {
      if (tickets[i] && !tickets[i].parentElement) {
        ticketsWrapper.appendChild(tickets[i]);
      }
    }
  }

  newTicket();
}

interface TicketElement extends HTMLDivElement {
  data(data?: Partial<t.SystemicTicket>): t.SystemicTicket;
}

function ticket(removeCB: () => void, updateSums: () => void): TicketElement {
  const wrapper = document.createElement("div") as TicketElement;
  wrapper.className = "ticket-wrapper";

  const removeBtn = document.createElement("button");
  removeBtn.className = "remove-btn";
  removeBtn.appendChild(fa("trash"));
  removeBtn.onclick = () => {
    removeCB();
    if (wrapper.parentElement) {
      wrapper.classList.add("remove");
      setTimeout(() => {
        wrapper.parentElement.removeChild(wrapper);
      }, 500);
    }
  };
  wrapper.appendChild(removeBtn);

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

  const idInput = inputWithLabel(true);
  idInput.placeholder = local.id;
  g1.appendChild(idInput.parentElement);

  const dateInput = inputWithLabel(true);
  dateInput.placeholder = local.date;
  g1.appendChild(dateInput.parentElement);
  datepicker(dateInput);

  const receivedInput = numberMask(inputWithLabel(true));
  receivedInput.placeholder = local.received;
  g2.appendChild(receivedInput.parentElement);
  receivedInput.addEventListener("keydown", () => updateSums());

  const airlineInput = inputWithLabel(true);
  airlineInput.placeholder = local.outline;
  g2.appendChild(airlineInput.parentElement);
  autocompleteInput("airline", airlineInput);

  const passengerNameInput = inputWithLabel(true);
  passengerNameInput.placeholder = local.passengerName;
  g3.appendChild(passengerNameInput.parentElement);
  autocompleteInput("first_name", passengerNameInput);

  const passengerLastnameInput = inputWithLabel(true);
  passengerLastnameInput.placeholder = local.passengerLastname;
  g3.appendChild(passengerLastnameInput.parentElement);
  autocompleteInput("last_name", passengerLastnameInput);

  const routeInput = routeSelector();
  wrapper.appendChild(routeInput);

  const collectData = (): t.SystemicTicket => ({
    id: idInput.value,
    passengerName: passengerNameInput.value,
    passengerLastname: passengerLastnameInput.value,
    received: Number(receivedInput.value),
    airline: airlineInput.value,
    date: Number(dateInput.getAttribute("data-day")),
    route: routeInput.getDBRoute()
  });

  const setData = (t: Partial<t.SystemicTicket>): void => {
    if (t.id) idInput.value = t.id;
    if (t.passengerName) passengerNameInput.value = t.passengerName;
    if (t.passengerLastname) passengerLastnameInput.value = t.passengerLastname;
    if (t.received) receivedInput.value = String(t.received);
    if (t.airline) airlineInput.value = t.airline;
    if (t.date) dateInput.value = String(t.date);
    if (t.route) routeInput.setDBRoute(t.route);
  };

  wrapper.data = (data: Partial<t.SystemicTicket>): t.SystemicTicket => {
    if (data) {
      setData(data);
    }
    return collectData();
  };
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
