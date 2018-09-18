/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import axios from "axios";
import { get } from "./context";
import { formatDate } from "./datepicker";
import { emit } from "./ipc";
import { viewCharter as local } from "./local";
import { toPersianDigits } from "./persian";
import { routeView } from "./route";
import * as t from "./types";
import { fa } from "./util";

export function renderViewCharter(app: HTMLElement, param: string): void {
  const wrapper = document.createElement("div");
  wrapper.id = "view-charter";
  app.appendChild(wrapper);

  const head = document.createElement("h1");
  head.innerText = local.title;
  wrapper.appendChild(head);

  async function fetch() {
    const token = get("currentToken");
    const server = get("server");
    const { data: res } = await axios.post(
      server + "/charter/view/" + param,
      {},
      {
        headers: {
          "hod-token": token
        }
      }
    );

    if (res.doc) {
      render(res.doc);
    } else {
      // TODO(qti3e) Emit notification.
    }
  }

  function render(doc: t.CharterDoc): void {
    const printBtn = document.createElement("button");
    printBtn.className = "print-btn";
    printBtn.onclick = () =>
      emit("print", {
        kind: "charter",
        data: doc
      });
    printBtn.appendChild(fa("print"));
    wrapper.appendChild(printBtn);

    // Render layout.
    const headWrapper = document.createElement("div");
    headWrapper.id = "head-wrapper";
    wrapper.appendChild(headWrapper);

    const infoWrapper = document.createElement("div");
    infoWrapper.className = "rounded-box";
    headWrapper.appendChild(infoWrapper);
    const infoLabel = document.createElement("label");
    infoLabel.innerText = local.info;
    infoWrapper.appendChild(infoLabel);

    const payerWrapper = document.createElement("div");
    payerWrapper.className = "rounded-box";
    headWrapper.appendChild(payerWrapper);
    const payerLabel = document.createElement("label");
    payerLabel.innerText = local.payer;
    payerWrapper.appendChild(payerLabel);

    const counterWrapper = document.createElement("div");
    counterWrapper.className = "rounded-box";
    headWrapper.appendChild(counterWrapper);
    const counterLabel = document.createElement("label");
    counterLabel.innerText = local.counter;
    counterWrapper.appendChild(counterLabel);

    const receivesWrapper = document.createElement("div");
    receivesWrapper.className = "rounded-box";
    wrapper.appendChild(receivesWrapper);
    const receivesLabel = document.createElement("label");
    receivesLabel.innerText = local.receives;
    receivesWrapper.appendChild(receivesLabel);

    const receivesInner = document.createElement("div");
    receivesInner.id = "receives-inner";
    receivesWrapper.appendChild(receivesInner);

    const ticketsWrapper = document.createElement("div");
    ticketsWrapper.className = "rounded-box";
    wrapper.appendChild(ticketsWrapper);
    const ticketsLabel = document.createElement("label");
    ticketsLabel.innerText = local.tickets;
    ticketsWrapper.appendChild(ticketsLabel);

    const ticketsInner = document.createElement("div");
    ticketsInner.id = "tickets-inner";
    ticketsWrapper.appendChild(ticketsInner);

    // End of rendering layout.

    // Render info box.
    infoWrapper.appendChild(row(local.id, doc._id.slice(0, 7)));

    infoWrapper.appendChild(row(local.serviceKind, local[doc.kind]));

    infoWrapper.appendChild(row(local.providedBy, local[doc.providedBy]));

    infoWrapper.appendChild(row(local.providerAgency, doc.providerAgency));

    infoWrapper.appendChild(
      row(local.dateOfCreation, formatDate(doc.createdAt))
    );

    infoWrapper.appendChild(row(local.dateOfUpdate, formatDate(doc.updatedAt)));

    // Render payer box.
    payerWrapper.appendChild(row(local.payer, doc.payer));

    payerWrapper.appendChild(row(local.nameOfPayer, doc.payerName));

    payerWrapper.appendChild(
      row(local.nationalCode, toPersianDigits(doc.nationalCode))
    );

    payerWrapper.appendChild(
      row(local.phoneNumber, toPersianDigits(doc.phone))
    );

    // Render counter box.
    counterWrapper.appendChild(row(local.name, doc.owner.name));

    counterWrapper.appendChild(row(local.lastName, doc.owner.lastName));

    counterWrapper.appendChild(
      row(local.nationalCode, toPersianDigits(doc.owner.nationalCode))
    );

    // Render receives box.
    for (const key in doc.pay.base) {
      if (local[key]) {
        receivesInner.appendChild(
          row(local[key], toPersianDigits(doc.pay.base[key] || 0))
        );
      }
    }

    // Render tickets.
    for (let i = 0; i < doc.tickets.length; ++i) {
      ticketsInner.appendChild(renderTicket(doc.tickets[i]));
    }
  }

  // Initial fetch.
  fetch();
}

function row(label: string, value: string): HTMLDivElement {
  const tmp = document.createElement("div");
  tmp.className = "data-row";

  const labelEl = document.createElement("label");
  labelEl.innerText = label;
  tmp.appendChild(labelEl);

  const valueEl = document.createElement("div");
  valueEl.innerText = value;
  tmp.appendChild(valueEl);

  return tmp;
}

function renderTicket(ticket: t.CharterTicket): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.className = "ticket-wrapper";

  const gwrapper = document.createElement("div");
  gwrapper.className = "g-wrapper";
  wrapper.appendChild(gwrapper);

  // Create data groups.
  const g1 = document.createElement("div");
  g1.className = "group g1";
  gwrapper.appendChild(g1);
  const g2 = document.createElement("div");
  g2.className = "group g2";
  gwrapper.appendChild(g2);
  const g3 = document.createElement("div");
  g3.className = "group g3";
  gwrapper.appendChild(g3);
  const g4 = document.createElement("div");
  g4.className = "group g4";
  gwrapper.appendChild(g4);

  g1.appendChild(row(local.id, ticket.id));
  g1.appendChild(row(local.date, formatDate(ticket.date)));

  g2.appendChild(row(local.paid, String(ticket.paid || 0)));
  g2.appendChild(row(local.received, String(ticket.received || 0)));

  g3.appendChild(row(local.passengerName, ticket.passengerName));
  g3.appendChild(row(local.passengerLastname, ticket.passengerLastname));

  g4.appendChild(row(local.airline, ticket.airline));

  wrapper.appendChild(routeView(ticket.route, wrapper));

  return wrapper;
}
