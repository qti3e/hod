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
import { emit, on } from "./ipc";
import { fundDashboard as local } from "./local";
import * as t from "./types";
import { cacheForUser, sumCharterTickets, sumSystemicTickets } from "./util";

const domCache = cacheForUser<HTMLDivElement>();
const active = cacheForUser<boolean>();
const docsU = cacheForUser<Array<[t.CharterDoc | t.SystemicDoc, () => void]>>();
const seenU = cacheForUser<Map<string, number>>();
const renderU = cacheForUser<() => void>();

// If they ever ask me again about adding a new document type, I'll need to
// refactor this code

export function renderFundDashboard(app: HTMLElement): void {
  active.set(true);

  if (!docsU.has()) {
    docsU.set([]);
  }

  if (!seenU.has()) {
    seenU.set(new Map());
  }

  if (domCache.has()) {
    return void app.appendChild(domCache.get());
  }

  const wrapper = document.createElement("div");

  wrapper.addEventListener("component-will-unmount", () => active.set(false));

  wrapper.id = "fund-dashboard-wrapper";
  app.appendChild(wrapper);
  domCache.set(wrapper);

  const title = document.createElement("h1");
  title.innerText = local.title;
  wrapper.appendChild(title);

  const table = document.createElement("div");
  table.className = "table";
  wrapper.appendChild(table);

  const NUM_COL = 6;
  const cols: HTMLDivElement[] = [];
  const docs = docsU.get();

  for (let i = 0; i < NUM_COL; ++i) {
    const tmp = document.createElement("div");
    tmp.className = "col";
    cols.push(tmp);
    table.appendChild(tmp);
  }

  function row(col: number, e: HTMLElement): void {
    e.classList.add("row");
    cols[col].appendChild(e);
  }

  function head(col: number, t: string): void {
    const tmp = document.createElement("div");
    tmp.className = "row-head";
    tmp.innerText = t;
    row(col, tmp);
  }

  function textRow(col: number, t: string): void {
    const tmp = document.createElement("div");
    tmp.innerText = t;
    row(col, tmp);
  }

  function render(): void {
    // Remove everything inside cols.
    for (let i = 0; i < NUM_COL; ++i) {
      cols[i].innerHTML = "";
    }

    head(0, local.id);
    head(1, local.docKind);
    head(2, local.docPayer);
    head(3, local.docPayerName);
    head(4, local.dateOfCreation);
    textRow(5, "");

    for (let i = 0; i < docs.length; ++i) {
      const [doc, read] = docs[i];
      if (!doc) continue;
      const isCharter = checkIsCharter(doc);
      textRow(0, doc._id.slice(0, 7));
      textRow(1, isCharter ? local.charter : local.systemic);
      textRow(2, doc.payer);
      textRow(3, doc.payerName);
      textRow(4, formatDate(doc.createdAt, true));
      const btn = document.createElement("button");
      btn.innerText = local.show;
      btn.onclick = () => {
        const payCb = (data, save) => {
          if (!save) {
            return;
          }

          const token = get("currentToken");

          if (checkIsCharter(doc)) {
            payCharter(token, doc._id, data);
          } else {
            paySystemic(token, doc._id, data);
          }

          docs[i][0] = undefined;
          docs[i][1]();
          render();
          // Remove this notification from the server side.
          read();
        };

        let totalResult;
        if (checkIsCharter(doc)) {
          totalResult = sumCharterTickets(doc.tickets);
        } else {
          totalResult = sumSystemicTickets(doc.tickets);
        }

        emit("open-modal", {
          page: isCharter ? "charterPayCounter" : "systemicPayCounter",
          param: {
            cb: payCb,
            fund: true,
            // Depp clone :D
            data: JSON.parse(JSON.stringify(doc.pay)),
            ...totalResult
          }
        });
      };
      row(5, btn);
    }
  }

  if (!renderU.has()) {
    renderU.set(render);
  }

  render();
}

async function fetchDoc(
  token: string,
  id: string,
  charter: boolean
): Promise<t.CharterDoc | t.SystemicDoc> {
  const server = get("server");
  const url = charter ? "/charter/view/" : "/systemic/view/";
  const { data: res } = await axios.post(
    server + url + id,
    {},
    {
      headers: {
        "hod-token": token
      }
    }
  );
  return res.doc;
}

async function payCharter(
  token: string,
  id: string,
  data: t.CharterPayData
): Promise<void> {
  const server = get("server");
  const url = "/charter/payment/";
  const { data: res } = await axios.post(
    server + url + id,
    {
      pay: data
    },
    {
      headers: {
        "hod-token": token
      }
    }
  );
  return res.doc;
}

async function paySystemic(
  token: string,
  id: string,
  data: t.CharterPayData
): Promise<void> {
  const server = get("server");
  const url = "/systemic/payment/";
  const { data: res } = await axios.post(
    server + url + id,
    {
      pay: data
    },
    {
      headers: {
        "hod-token": token
      }
    }
  );
  return res.doc;
}

on("sse", async ({ read, notification, currentUser }) => {
  // Only process new doc messages.
  if (notification.msg.kind !== t.NotificationMsgKind.newDoc) {
    return;
  }

  const seen = seenU.get();
  const docs = docsU.get();
  const render = renderU.get();

  if (seen.has(notification._id)) {
    return;
  }

  const token = get("currentToken");

  seen.set(notification._id, 1);
  if (currentUser) {
    docs.push([
      await fetchDoc(
        token,
        notification.msg.id,
        notification.msg.collection === "charters"
      ),
      read
    ]);
    render();
  }
});

on("login", () => {
  renderFundDashboard(document.createElement("div"));
});

renderFundDashboard(document.createElement("div"));

function checkIsCharter(doc: any): doc is t.CharterDoc {
  return !!doc["providedBy"];
}
