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
import { listCharter as local } from "./local";
import * as t from "./types";
import { cacheForUser } from "./util";

// Renders list of charter documentations.
const domCache = cacheForUser<HTMLElement>();

export function renderListCharter(app: HTMLElement): void {
  if (domCache.has()) {
    fetchData();
    return void app.appendChild(domCache.get());
  }

  const wrapper = document.createElement("div");
  domCache.set(wrapper);
  wrapper.id = "list-charter";
  app.appendChild(wrapper);

  let page = 0;
  let data: t.CharterDoc[];

  async function fetchData(): Promise<void> {
    const token = get("currentToken");
    const server = get("server");
    const currentPage = page;
    const { data: res } = await axios.post(
      server + "/charter/list/" + currentPage,
      {},
      {
        headers: {
          "hod-token": token
        }
      }
    );
    if (res.docs) {
      data = res.docs;
    } else {
      data = [];
      // TODO(qti3e) Emit a notification.
    }
    render();
  }

  function nextPage() {
    if (data && data.length < 20) {
      fetchData();
      return;
    }
    page++;
    fetchData();
  }

  function prevPage() {
    if (page === 0) {
      return;
    }
    page--;
    fetchData();
  }

  // End of data fetch.

  const titleText = document.createElement("h1");
  titleText.innerText = local.title;
  wrapper.appendChild(titleText);

  // Create action buttons.
  const prevBtn = document.createElement("button");
  prevBtn.innerText = local.prev;
  wrapper.appendChild(prevBtn);

  const nextBtn = document.createElement("button");
  nextBtn.innerText = local.next;
  wrapper.appendChild(nextBtn);

  // Bind events.
  nextBtn.onclick = () => nextPage();
  prevBtn.onclick = () => prevPage();

  // Create the table.
  const dataWrapper = document.createElement("div");
  dataWrapper.className = "data-wrapper";
  wrapper.appendChild(dataWrapper);

  const cols = [];
  const numCols = 6;

  for (let i = 0; i < numCols; ++i) {
    const tmp = document.createElement("div");
    tmp.className = "col col-" + (i + 1);
    cols.push(tmp);
    dataWrapper.appendChild(tmp);
  }

  function render() {
    const currentData = data;

    if (!currentData) return;
    for (let i = 0; i < numCols; ++i) {
      cols[i].innerHTML = "";
    }

    // Render headers
    cols[0].appendChild(row()).innerText = local.id;
    cols[1].appendChild(row()).innerText = local.serviceKind;
    cols[2].appendChild(row()).innerText = local.dateOfCreation;
    cols[3].appendChild(row()).innerText = local.providedBy;
    cols[4].appendChild(row()).innerText = local.payer;
    cols[5].appendChild(row()).innerText = local.nameOfPayer;

    for (let i = 0; i < currentData.length; ++i) {
      const doc = currentData[i];
      // Create a new row.
      cols[0].appendChild(row(doc._id)).innerText = doc._id.slice(0, 7);
      cols[1].appendChild(row(doc._id)).innerText = local[doc.kind];
      cols[2].appendChild(row(doc._id)).innerText = formatDate(
        doc.createdAt,
        true
      );
      cols[3].appendChild(row(doc._id)).innerText = local[doc.providedBy];
      cols[4].appendChild(row(doc._id)).innerText = doc.payer;
      cols[5].appendChild(row(doc._id)).innerText = doc.payerName;
    }
  }

  function row(openModal?: string) {
    const tmp = document.createElement("div");
    tmp.className = "row";
    if (openModal) {
      tmp.onclick = () => {
        emit("open-modal", {
          page: "viewCharter",
          param: openModal
        });
      };
    }
    return tmp;
  }

  // Initial fetch.
  fetchData();
}
