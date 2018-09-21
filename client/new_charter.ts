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
import { numberMask } from "./mask";
import { routeSelector } from "./route";
import * as t from "./types";
import { cacheForUser, checkBox, fa, sumCharterTickets } from "./util";

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
        differ: 0,
        installmentBase: 0,
        wage: 0
      },
      receives: [],
      payments: [],
      additionalComments: ""
    },
    providerAgency: ""
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

  const agencyInput = document.createElement("input");
  agencyInput.placeholder = local.agency;
  right.appendChild(agencyInput);
  agencyInput.onchange = () => {
    form.providerAgency = agencyInput.value.trim();
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
  const payCb = async (data: t.CharterPayData, save: boolean) => {
    // We pass form.data by reference, is this
    // thing even needed? No, but let's be sure
    // about what the heck we're doing.
    form.pay = data;

    if (!save) return;

    form.tickets = tickets.filter(x => !!x).map(t => t.data());
    console.log("sending form", form);
    await submit(form);
    // Reset form.
    domCache.delete();
    // TODO(qti3e) show the saved doc.
    emit("goto", "home");
  };

  payBtn.onclick = () => {
    emit("open-modal", {
      page: "charterPayCounter",
      param: {
        cb: payCb,
        data: form.pay,
        ...sumCharterTickets(tickets.filter(x => !!x).map(t => t.data()))
      }
    });
  };

  const left = document.createElement("div");
  left.className = "left-split";
  view.appendChild(left);

  const tickets: TicketElement[] = [];
  const ticketsWrapper = document.createElement("div");
  ticketsWrapper.className = "tickets-wrapper";
  left.appendChild(ticketsWrapper);

  function newTicket() {
    const id = tickets.length;
    tickets.push(
      ticket(() => {
        tickets[id] = undefined;
      })
    );
    for (let prevId = id - 1; prevId >= 0; --prevId) {
      if (!tickets[prevId]) continue;
      const data = tickets[prevId].data();
      tickets[id].data(data);
      break;
    }
    renderTickets();
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
  data(ticket?: Partial<t.CharterTicket>): t.CharterTicket;
}

function ticket(removeCB: () => void): TicketElement {
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

  const paidInput = numberMask();
  paidInput.placeholder = local.paid;
  g2.appendChild(paidInput);

  const receivedInput = numberMask();
  receivedInput.placeholder = local.received;
  g2.appendChild(receivedInput);

  const passengerNameInput = document.createElement("input");
  passengerNameInput.placeholder = local.passengerName;
  g3.appendChild(passengerNameInput);

  const passengerLastnameInput = document.createElement("input");
  passengerLastnameInput.placeholder = local.passengerLastname;
  g3.appendChild(passengerLastnameInput);

  const airlineInput = document.createElement("input");
  airlineInput.placeholder = local.airline;
  g4.appendChild(airlineInput);

  const routeInput = routeSelector();
  wrapper.appendChild(routeInput);

  const collectData = (): t.CharterTicket => ({
    id: idInput.value,
    passengerName: passengerNameInput.value,
    passengerLastname: passengerLastnameInput.value,
    paid: Number(paidInput.value),
    received: Number(receivedInput.value),
    airline: airlineInput.value,
    date: Number(dateInput.getAttribute("data-day")),
    route: routeInput.getDBRoute()
  });

  const setData = (t: Partial<t.CharterTicket>) => {
    if (t.id) idInput.value = t.id;
    if (t.passengerName) passengerNameInput.value = t.passengerName;
    if (t.passengerLastname) passengerLastnameInput.value = t.passengerLastname;
    if (t.paid) paidInput.value = String(t.paid);
    if (t.received) receivedInput.value = String(t.received);
    if (t.airline) airlineInput.value = t.airline;
    if (t.date) dateInput.value = String(t.date);
    if (t.route) routeInput.setDBRoute(t.route);
  };

  wrapper.data = (data?: Partial<t.CharterTicket>) => {
    if (data) {
      setData(data);
    }
    return collectData();
  };

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
