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
import { cacheForUser } from "./util";

const domCache = cacheForUser<HTMLDivElement>();
const active = cacheForUser<boolean>();

export function renderFundDashboard(app: HTMLElement): void {
  const token = get("currentToken");

  active.set(true);

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
  const docs: Array<[t.CharterDoc | t.SystemicDoc, () => void]> = [];

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
      const [doc] = docs[i];
      if (!doc) continue;
      const isCharter = !!doc["providedBy"];
      textRow(0, doc._id.slice(0, 7));
      textRow(1, isCharter ? local.charter : local.systemic);
      textRow(2, doc.payer);
      textRow(3, doc.payerName);
      textRow(4, formatDate(doc.createdAt, true));
      const btn = document.createElement("button");
      btn.innerText = local.show;
      btn.onclick = () => {
        // Uncomment this after dev.
        // docs[i].read();
        // TODO(qti3e) Open payment modal.
        emit("open-modal", {
          page: isCharter ? "fillCharter" : null,
          param: doc
        });
      };
      row(5, btn);
    }
  }

  render();
  const seen = new Map<string, number>();

  on("sse", async ({ read, notification, currentUser }) => {
    if (!active.get()) return;
    // Only process new doc messages.
    if (notification.msg.kind !== t.NotificationMsgKind.newDoc) {
      return;
    }
    if (seen.has(notification._id)) {
      return;
    }
    seen.set(notification._id, 1);
    if (currentUser) {
      docs.push([
        await fetchDoc(
          token,
          notification.msg.id,
          notification.msg.collection === "charter"
        ),
        read
      ]);
      render();
    }
  });
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
