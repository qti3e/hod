/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import axios from "axios";
import { get } from "./context";
import { viewCharter as local } from "./local";
import * as t from "./types";

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
    const headWrapper = document.createElement("div");
    headWrapper.id = "head-wrapper";
    wrapper.appendChild(headWrapper);

    const infoWrapper = document.createElement("div");
    infoWrapper.className = "rounded-box";
    headWrapper.appendChild(infoWrapper);
    const infoLabel = document.createElement("label");
    infoLabel.innerText = "Test";
    infoWrapper.appendChild(infoLabel);

    const payerWrapper = document.createElement("div");
    payerWrapper.className = "rounded-box";
    headWrapper.appendChild(payerWrapper);
    const payerLabel = document.createElement("label");
    payerLabel.innerText = "Test";
    payerWrapper.appendChild(payerLabel);

    const counterWrapper = document.createElement("div");
    counterWrapper.className = "rounded-box";
    headWrapper.appendChild(counterWrapper);
    const counterLabel = document.createElement("label");
    counterLabel.innerText = "Test";
    counterWrapper.appendChild(counterLabel);

    const receivesWrapper = document.createElement("div");
    receivesWrapper.className = "rounded-box";
    wrapper.appendChild(receivesWrapper);
    const receivesLabel = document.createElement("label");
    receivesLabel.innerText = "Test";
    receivesWrapper.appendChild(receivesLabel);

    const ticketsWrapper = document.createElement("div");
    ticketsWrapper.id = "tickets-wrapper";
    wrapper.appendChild(ticketsWrapper);
  }

  // Initial fetch.
  fetch();
}
