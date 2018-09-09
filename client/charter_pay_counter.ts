/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import { emit } from "./ipc";
import { payCharterCounter as local } from "./local";
import * as t from "./types";
import { fa } from "./util";

export interface Props {
  cb: (data: t.CharterPayData) => void;
  data: t.CharterPayData;
  total: number;
}

export function renderCharterPayCounter(
  app: HTMLElement,
  { cb, data, total }: Props
): void {
  // Default to nop.
  cb = cb || (() => null);

  // Use this function to send data back to the parent.
  function send() {
    cb(data);
  }

  // We should append everything to this container.
  const wrapper = document.createElement("div");
  wrapper.id = "charter-pay-counter";
  app.appendChild(wrapper);
  wrapper.addEventListener("component-will-unmount", () => {
    send();
  });

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
      const tmpInput = document.createElement("input");
      tmpInput.placeholder = local[name];
      // Set the value from props.
      tmpInput.value = data.base[name] ? data.base[name] : "";
      baseWrapper.appendChild(tmpInput);
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
  receivesWrapper.appendChild(receivesDataWrapper);

  // Render a recive data row, appends to receivesDataWrapper.
  function renderReceive(i: number) {
    const receive = data.receives[i];
    switch (receive.kind) {
      case t.CharterReceiveKind.cacheReceive:
        console.log("cache");
        break;
      case t.CharterReceiveKind.bankReceive:
        console.log("bank");
        break;
      case t.CharterReceiveKind.hekmatCardReceive:
        console.log("hekmat");
        break;
      case t.CharterReceiveKind.notificationReceive:
        console.log("notification");
        break;
    }
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
}

setTimeout(() => emit("goto", "newCharter"));
