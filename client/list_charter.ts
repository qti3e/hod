/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import axios from "axios";
import { get } from "./context";
import { emit } from "./ipc";
import * as t from "./types";
import { cacheForUser } from "./util";

// Renders list of charter documentations.
const domCache = cacheForUser<HTMLElement>();

export function renderListCharter(app: HTMLElement): void {
  if (domCache.has()) {
    return void app.appendChild(domCache.get());
  }

  const wrapper = document.createElement("div");
  domCache.set(wrapper);
  wrapper.id = "list-charter";
  app.appendChild(wrapper);

  let page = 0;
  let dataTime = Date.now();
  const data = new Map<number, t.CharterDoc[]>();

  async function fetchData(): Promise<void> {
    if (Date.now() - dataTime > 10 * 1000) {
      dataTime = Date.now();
      data.clear();
    }
    if (!data.has(page)) {
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
        data.set(currentPage, res.docs);
      } else {
        // TODO(qti3e) Emit a notification.
      }
    }
    render();
  }

  function nextPage() {
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

  let rowCacheTime = Date.now();
  const rowCache = new Map<string, HTMLElement>();

  const dataWrapper = document.createElement("div");
  dataWrapper.className = "data-wrapper";
  wrapper.appendChild(dataWrapper);

  // Create action buttons.
  const nextBtn = document.createElement("button");
  nextBtn.innerText = "Next";
  wrapper.appendChild(nextBtn);

  const prevBtn = document.createElement("button");
  prevBtn.innerText = "Prev";
  wrapper.appendChild(prevBtn);

  // Bind events.
  nextBtn.onclick = () => nextPage();
  prevBtn.onclick = () => prevPage();

  function render() {
    if (Date.now() - rowCacheTime > 20 * 1000) {
      rowCacheTime = Date.now();
      rowCache.clear();
    }

    const currentData = data.get(page);
    if (!currentData) return;
    dataWrapper.innerHTML = "";

    for (let i = 0; i < currentData.length; ++i) {
      const doc = currentData[i];
      if (rowCache.has(doc._id)) {
        dataWrapper.appendChild(rowCache.get(doc._id));
        continue;
      }
      // Create a new element.
      const tmp = document.createElement("div");
      rowCache.set(doc._id, tmp);
      tmp.className = "list-entity";

      // TODO(qti3e) Design row.

      dataWrapper.appendChild(tmp);
    }
  }

  // Initial fetch.
  fetchData();
}

setTimeout(() => {
  emit("goto", "listCharter");
});
