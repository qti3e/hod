/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import { datepicker } from "./datepicker";
import { inputWithLabel } from "./input";
import { payCharterCounter as local } from "./local";
import { numberMask } from "./mask";
import * as t from "./types";
import { fa } from "./util";

export interface Props {
  cb: (data: t.CharterPayData, save: boolean) => void;
  data: t.CharterPayData;
  fund?: boolean;
  totalReceived: number;
  totalPaid: number;
}

export function renderCharterPayCounter(
  app: HTMLElement,
  { cb, data, fund, totalReceived, totalPaid }: Props,
  close?: (e?: boolean) => Promise<void>
): void {
  // Default to nop.
  cb = cb || (() => null);

  console.log(totalReceived, totalPaid);

  // Use this function to send data back to the parent.
  function send(save = false) {
    data.receives = data.receives.filter(x => !!x);
    data.payments = data.payments.filter(x => !!x);
    cb(data, save);
  }

  // We should append everything to this container.
  const wrapper = document.createElement("div");
  wrapper.id = "charter-pay-counter";
  app.appendChild(wrapper);

  // Start the DOM manipulation
  const title = document.createElement("h1");
  title.innerText = local.title;
  wrapper.appendChild(title);

  // Just a container for input elements.
  const baseWrapper = document.createElement("div");
  baseWrapper.className = "base-wrapper";
  wrapper.appendChild(baseWrapper);

  // Render base inputs at the top,
  // As there is nothing too much special about this items
  // we render all of them without putting any difference
  // between them in a loop.
  for (const name in data.base) {
    if (local[name]) {
      const tmpInput = numberMask(inputWithLabel());
      tmpInput.placeholder = local[name];
      // Set the value from props.
      tmpInput.value = data.base[name] ? data.base[name] : "";
      baseWrapper.appendChild(tmpInput.parentElement);
      tmpInput.onchange = () => (data.base[name] = Number(tmpInput.value));
    } else {
      // It would not going to happen in production.
      // And is just a dev-time hint.
      throw new Error(
        "Localization string for `" + name + "` does not exsits."
      );
    }
  }

  // Now let's render other payment sections including `data.receives`
  // and `data.payments` and also `data.additionalComments`

  // Render data.receives section.
  const receivesWrapper = document.createElement("div");
  receivesWrapper.className = "receives-wrapper";
  wrapper.appendChild(receivesWrapper);

  const receivesTitle = document.createElement("h1");
  receivesTitle.innerText = local.receives;
  receivesWrapper.appendChild(receivesTitle);

  // This will contain each data row.
  const receivesDataWrapper = document.createElement("div");
  receivesDataWrapper.className = "receives-data";
  receivesWrapper.appendChild(receivesDataWrapper);

  // Render a recive data row, appends to receivesDataWrapper.
  function renderReceive(i: number) {
    const receive = data.receives[i];
    const rowEl = document.createElement("div");
    rowEl.className = "row";
    const delBtn = document.createElement("button");
    delBtn.appendChild(fa("trash"));
    delBtn.className = "remove";
    delBtn.onclick = () => {
      data.receives[i] = undefined;
      rowEl.parentElement.removeChild(rowEl);
    };
    rowEl.appendChild(delBtn);
    let icon: HTMLSpanElement;
    let i1: HTMLInputElement, i2: HTMLInputElement, i3: HTMLInputElement;
    switch (receive.kind) {
      case t.CharterReceiveKind.cacheReceive:
        icon = fa("money-bill-alt");
        icon.title = local.cacheReceive;

        i1 = numberMask();
        i1.value = receive.amount > 0 ? String(receive.amount) : "";
        i1.placeholder = local.amount;
        i1.onchange = () => {
          receive.amount = Number(i1.value);
        };
        rowEl.appendChild(i1);

        i2 = document.createElement("input");
        i2.value = receive.receiverName;
        i2.placeholder = local.receiverName;
        i2.onchange = () => {
          receive.receiverName = i2.value;
        };
        rowEl.appendChild(i2);

        i3 = document.createElement("input");
        i3.placeholder = local.date;
        i3.value = String(receive.date);
        datepicker(i3, {
          onchange(day: number): void {
            receive.date = day;
          }
        });
        rowEl.appendChild(i3);
        break;
      case t.CharterReceiveKind.bankReceive:
        icon = fa("money-check");
        icon.title = local.bankReceive;

        i1 = numberMask();
        i1.value = receive.amount > 0 ? String(receive.amount) : "";
        i1.placeholder = local.amount;
        i1.onchange = () => {
          receive.amount = Number(i1.value);
        };
        rowEl.appendChild(i1);

        i2 = document.createElement("input");
        i2.className = "ltr";
        i2.value = receive.account;
        i2.placeholder = local.account;
        i2.onchange = () => {
          receive.account = i2.value;
        };
        rowEl.appendChild(i2);

        i3 = document.createElement("input");
        i3.placeholder = local.date;
        i3.value = String(receive.date);
        datepicker(i3, {
          onchange(day: number): void {
            receive.date = day;
          }
        });
        rowEl.appendChild(i3);
        break;
      case t.CharterReceiveKind.hekmatCardReceive:
        icon = fa("credit-card");
        icon.title = local.hekmatCardReceive;

        i1 = numberMask();
        i1.value = receive.amount > 0 ? String(receive.amount) : "";
        i1.placeholder = local.amount;
        i1.onchange = () => {
          receive.amount = Number(i1.value);
        };

        rowEl.appendChild(i1);
        i3 = document.createElement("input");
        i3.placeholder = local.date;
        i3.value = String(receive.date);
        datepicker(i3, {
          onchange(day: number): void {
            receive.date = day;
          }
        });
        rowEl.appendChild(i3);
        break;
      case t.CharterReceiveKind.notificationReceive:
        icon = fa("file-invoice");
        icon.title = local.notificationReceive;

        i1 = numberMask();
        i1.value = receive.amount > 0 ? String(receive.amount) : "";
        i1.placeholder = local.amount;
        i1.onchange = () => {
          receive.amount = Number(i1.value);
        };
        rowEl.appendChild(i1);

        i2 = document.createElement("input");
        i2.value = receive.number;
        i2.placeholder = local.number;
        i2.onchange = () => {
          receive.number = i2.value;
        };
        rowEl.appendChild(i2);

        i3 = document.createElement("input");
        i3.placeholder = local.date;
        i3.value = String(receive.date);
        datepicker(i3, {
          onchange(day: number): void {
            receive.date = day;
          }
        });
        rowEl.appendChild(i3);
        break;
    }
    if (icon) {
      icon.classList.add("row-icon");
      // Maybe enable it later on?
      rowEl.appendChild(icon);
    }
    receivesDataWrapper.appendChild(rowEl);
  }

  // Initial rendering.
  for (let i = 0; i < data.receives.length; ++i) {
    renderReceive(i);
  }

  // Render new row buttons, so users can add new receives.
  const receivesButtonsWrapper = document.createElement("div");
  receivesButtonsWrapper.className = "buttons";
  receivesWrapper.appendChild(receivesButtonsWrapper);

  // Create a button and appends it to the receivesButtonsWrapper.
  function renderRecBtn(text: string, template: t.CharterReceive) {
    const btn = document.createElement("button");
    btn.appendChild(fa("plus-square"));
    btn.appendChild(document.createTextNode(text));
    btn.onclick = () => {
      data.receives.push({
        ...template
      });
      renderReceive(data.receives.length - 1);
      receivesDataWrapper.scrollTop = receivesDataWrapper.scrollHeight;
    };
    receivesButtonsWrapper.appendChild(btn);
  }

  renderRecBtn(local.newCacheRec, {
    kind: t.CharterReceiveKind.cacheReceive,
    amount: 0,
    date: null,
    receiverName: ""
  });

  renderRecBtn(local.newBankRec, {
    kind: t.CharterReceiveKind.bankReceive,
    amount: 0,
    account: "",
    date: null
  });

  renderRecBtn(local.newHekmatRec, {
    kind: t.CharterReceiveKind.hekmatCardReceive,
    amount: 0,
    date: null
  });

  renderRecBtn(local.newNotificationRec, {
    kind: t.CharterReceiveKind.notificationReceive,
    amount: 0,
    number: "",
    date: null
  });

  // End of rendering receives section.

  // Now let's move on and render payments section.
  const paymentsWrapper = document.createElement("div");
  paymentsWrapper.className = "payments-wrapper";
  wrapper.appendChild(paymentsWrapper);

  // Render title.
  const paymentsTitle = document.createElement("h1");
  paymentsTitle.innerText = local.paymentsTitle;
  paymentsWrapper.appendChild(paymentsTitle);

  const paymentsDataWrapper = document.createElement("div");
  paymentsDataWrapper.className = "payments-data";
  paymentsWrapper.appendChild(paymentsDataWrapper);

  function renderPaymentsRow(i: number) {
    const payment = data.payments[i];
    const rowEl = document.createElement("div");
    rowEl.className = "row";
    paymentsDataWrapper.appendChild(rowEl);

    const delBtn = document.createElement("button");
    delBtn.appendChild(fa("trash"));
    delBtn.className = "remove";
    delBtn.onclick = () => {
      data.payments[i] = undefined;
      rowEl.parentElement.removeChild(rowEl);
    };
    rowEl.appendChild(delBtn);

    const i1 = numberMask();
    i1.value = payment.amount > 0 ? String(payment.amount) : "";
    i1.placeholder = local.amount;
    i1.onchange = () => {
      payment.amount = Number(i1.value);
    };
    rowEl.appendChild(i1);

    const i2 = document.createElement("input");
    i2.className = "ltr";
    i2.value = payment.account;
    i2.placeholder = local.account;
    i2.onchange = () => {
      payment.account = i2.value;
    };
    rowEl.appendChild(i2);

    const i3 = document.createElement("input");
    i3.value = String(payment.date);
    i3.placeholder = local.date;
    datepicker(i3, {
      onchange(day: number): void {
        payment.date = day;
      }
    });
    rowEl.appendChild(i3);
  }

  const paymentBtnsWrapper = document.createElement("div");
  paymentBtnsWrapper.className = "buttons";
  paymentsWrapper.appendChild(paymentBtnsWrapper);

  const newPaymentBtn = document.createElement("button");
  newPaymentBtn.appendChild(fa("plus-square"));
  newPaymentBtn.appendChild(document.createTextNode(local.newPayment));
  newPaymentBtn.onclick = () => {
    const payment: t.CharterPayment = {
      amount: 0,
      account: "",
      date: null
    };
    data.payments.push(payment);
    renderPaymentsRow(data.payments.length - 1);
  };
  paymentBtnsWrapper.appendChild(newPaymentBtn);

  // Initial rendering
  for (let i = 0; i < data.payments.length; ++i) {
    renderPaymentsRow(i);
  }

  wrapper.addEventListener("component-will-unmount", e => e.preventDefault());

  const buttonsWrapper = document.createElement("div");
  buttonsWrapper.className = "buttons-wrapper";
  wrapper.appendChild(buttonsWrapper);

  const submitBtn = document.createElement("button");
  submitBtn.className = "submit";
  submitBtn.innerText = local.submit;
  submitBtn.onclick = () => {
    send(true);
    // Fore Close
    close(false);
  };
  buttonsWrapper.appendChild(submitBtn);

  const cancelBtn = document.createElement("button");
  cancelBtn.className = "cancel";
  cancelBtn.innerText = local.cancel;
  cancelBtn.onclick = () => {
    send(false);
    close(false);
  };
  buttonsWrapper.appendChild(cancelBtn);
}
