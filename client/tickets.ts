/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import axios from "axios";
import { autocompleteInput, resetData } from "./autocomplete";
import { get } from "./context";
import { datepicker } from "./datepicker";
import { inputWithLabel } from "./input";
import { emit } from "./ipc";
import * as t from "./types";
import { tickets as local } from "./local";
import { cacheForUser, checkBox, fa } from "./util";

const domCache = cacheForUser<HTMLElement>();
const stacks = [];

const interval = setInterval(() => {
  for (const stack of stacks) {
    for (const search of stack) {
      search.ping();
    }
  }
}, 60e3);

export async function renderTickets(app: HTMLElement): void {
  if (domCache.has()) {
    return void app.appendChild(domCache.get());
  }

  const wrapper = document.createElement("div");
  wrapper.id = "tickets-page";
  wrapper.className = "full-page";
  wrapper.style.maxWidth = "1200px";
  app.appendChild(wrapper);

  wrapper.addEventListener("component-will-unmount", e => {
    resetData();
  });

  const title = document.createElement("h1");
  title.innerText = local.title;
  wrapper.appendChild(title);

  const searchBox = document.createElement("div");
  searchBox.id = "search-box";
  wrapper.appendChild(searchBox);

  wrapper.appendChild(document.createElement("hr"));

  const dataWrapper = document.createElement("div");
  dataWrapper.id = "dataview";
  wrapper.appendChild(dataWrapper);
  dataWrapper.style.overflowY = "auto";
  dataWrapper.style.height = "calc(100vh - 400px)";

  const inputFilter = (inputEl, key, target: QueryKeys) => {
    inputEl.addEventListener("change", () => {
      addFilter(
        {
          [key]: inputEl.value.trim() || undefined
        },
        target
      );
    });
  };

  // --start
  const g1 = document.createElement("div");
  g1.className = "group";
  g1.style.height = "40px";
  // searchBox.appendChild(g1);

  const clear1 = document.createElement("button");
  clear1.appendChild(fa("times"));
  g1.appendChild(clear1);

  const dateFromInput = inputWithLabel(true);
  dateFromInput.placeholder = local.dateFrom;
  g1.appendChild(dateFromInput.parentElement);
  datepicker(dateFromInput);

  for (let i = 0; i < 3; ++i) {
    const dot = document.createElement("div");
    dot.className = "dot";
    g1.appendChild(dot);
  }

  const dateToInput = inputWithLabel(true);
  dateToInput.placeholder = local.dateTo;
  g1.appendChild(dateToInput.parentElement);
  datepicker(dateToInput);

  const clear2 = document.createElement("button");
  clear2.appendChild(fa("times"));
  g1.appendChild(clear2);
  // -- end

  // --start
  const g2 = document.createElement("div");
  g2.className = "group";
  g2.style.padding = "5px";
  searchBox.appendChild(g2);

  const charterInternalCheckbox = checkBox(local.charterInternal);
  charterInternalCheckbox.checked = true;
  g2.appendChild(charterInternalCheckbox.parentElement);

  const charterInternationalCheckbox = checkBox(local.charterInternational);
  charterInternationalCheckbox.checked = true;
  g2.appendChild(charterInternationalCheckbox.parentElement);

  const systemicInternalCheckbox = checkBox(local.systemicInternal);
  systemicInternalCheckbox.checked = true;
  g2.appendChild(systemicInternalCheckbox.parentElement);

  const systemicInternationalCheckbox = checkBox(local.systemicInternational);
  systemicInternationalCheckbox.checked = true;
  g2.appendChild(systemicInternationalCheckbox.parentElement);

  const trainCheckbox = checkBox(local.train);
  trainCheckbox.checked = true;
  g2.appendChild(trainCheckbox.parentElement);
  // --end

  // --start
  const g3 = document.createElement("div");
  g3.className = "group";
  g3.style.padding = "5px";
  searchBox.appendChild(g3);

  const agencyInput = inputWithLabel(true);
  agencyInput.style.border = "none";
  agencyInput.style.borderLeft = "1px solid var(--primary)";
  agencyInput.placeholder = local.agency;
  g3.appendChild(agencyInput.parentElement);
  autocompleteInput("agency", agencyInput);
  inputFilter(agencyInput, "providerAgency", "charter");

  const airlineInput = inputWithLabel(true);
  airlineInput.placeholder = local.airline;
  g3.appendChild(airlineInput.parentElement);
  autocompleteInput("airline", airlineInput);
  inputFilter(airlineInput, "airline", "ticket");

  const cacheCheckbox = checkBox(local.cache);
  cacheCheckbox.checked = true;
  g3.appendChild(cacheCheckbox.parentElement);

  const creditCheckbox = checkBox(local.credit);
  creditCheckbox.checked = true;
  g3.appendChild(creditCheckbox.parentElement);
  // --end

  // --start
  const g4 = document.createElement("div");
  g4.className = "group";
  g4.style.padding = "5px";
  searchBox.appendChild(g4);

  const payerInput = inputWithLabel(true);
  payerInput.placeholder = local.payer;
  g4.appendChild(payerInput.parentElement);
  autocompleteInput("payer", payerInput);
  inputFilter(payerInput, "payer", "doc");

  const payerNameInput = inputWithLabel(true);
  payerNameInput.placeholder = local.nameOfPayer;
  g4.appendChild(payerNameInput.parentElement);
  autocompleteInput("payer_name", payerNameInput);
  inputFilter(payerNameInput, "payerName", "doc");

  const passengerNameInput = inputWithLabel(true);
  passengerNameInput.placeholder = local.passengerName;
  g4.appendChild(passengerNameInput.parentElement);
  autocompleteInput("first_name", passengerNameInput);
  inputFilter(passengerNameInput, "passengerName", "ticket");

  const passengerLastnameInput = inputWithLabel(true);
  passengerLastnameInput.placeholder = local.passengerLastname;
  g4.appendChild(passengerLastnameInput.parentElement);
  autocompleteInput("last_name", passengerLastnameInput);
  inputFilter(passengerLastnameInput, "passengerLastname", "ticket");
  // --end

  const stack = [];
  stacks.push(stack);
  let head = -1;

  function pushToStack(s) {
    for (let i = head + 1; i < stack.length; ++i) {
      search.destroy();
    }
    stack.splice(head + 1);
    stack.push(s);
    head++;
    render();
  }

  function undo() {
    if (head > 0) {
      head--;
      render();
    }
  }

  function redo() {
    if (head < stack.length - 1) {
      head++;
      render();
    }
  }

  type QueryKeys = "charter" | "systemic" | "ticket" | "doc";
  async function addFilter(query, q: QueryKeys) {
    const search = stack[head];
    if (q === "doc") {
      pushToStack(
        await Search.query({
          ...search.query,
          charter: {
            ...search.query.charter,
            ...query
          },
          systemic: {
            ...search.query.systemic,
            ...query
          }
        })
      );
    } else {
      pushToStack(
        await Search.query({
          ...search.query,
          [q]: {
            ...search.query[q],
            ...query
          }
        })
      );
    }
  }

  async function render() {
    const search = stack[head];
    const query = search.query;

    const tabel = document.createElement("div");
    tabel.style.display = "flex";
    const col1 = document.createElement("div");
    tabel.appendChild(col1);
    const col7 = document.createElement("div");
    tabel.appendChild(col7);
    const col2 = document.createElement("div");
    tabel.appendChild(col2);
    const col3 = document.createElement("div");
    tabel.appendChild(col3);
    const col4 = document.createElement("div");
    tabel.appendChild(col4);
    const col5 = document.createElement("div");
    tabel.appendChild(col5);
    const col6 = document.createElement("div");
    tabel.appendChild(col6);

    [col1, col2, col3, col4, col5, col6, col7].map(e => {
      Object.assign(e.style, {
        flex: "1",
        textAlign: "center"
      });
    });

    // Render headers
    const header = text => {
      const tmp = document.createElement("div");
      tmp.className = "head";
      tmp.innerText = text;
      tmp.style.color = "var(--primary)";
      tmp.style.background = "var(--background)";
      tmp.style.borderBottom = "1px solid var(--primary)";
      tmp.style.position = "sticky";
      tmp.style.top = "0";
      return tmp;
    };
    col1.appendChild(header("نوع خدمات"));
    col2.appendChild(header("آژانس عامل"));
    col3.appendChild(header("طرف حساب"));
    col4.appendChild(header("نام طرف حساب"));
    col5.appendChild(header("مسافر"));
    col6.appendChild(header("گردش کار"));
    col7.appendChild(header("نام ایرلاین / قطار"));

    const rows = [];

    function renderTickets(tickets: t.TicketBase[]) {
      for (const row of rows) {
        row.parentElement.removeChild(row);
        rows.splice(0);
      }

      const row = (text, cb?) => {
        const tmp = document.createElement("div");
        tmp.innerText = text || "-";
        tmp.style.height = "30px";
        tmp.style.color = "var(--primary)";
        rows.push(tmp);
        if (cb) {
          tmp.style.cursor = "pointer";
          tmp.style.color = "var(--secondry)";
          tmp.style.textDecoration = "underscore";
          tmp.onclick = () => cb();
        }
        return tmp;
      };

      for (const ticket of tickets) {
        const isCharter = ticket.doc.providerAgency !== undefined;
        col1.appendChild(
          row(
            local[
              {
                charter: {
                  internal: "charterInternal",
                  international: "charterInternational"
                },
                systemic: {
                  internal: "systemicInternal",
                  international: "systemicInternational",
                  train: "train"
                }
              }[isCharter ? "charter" : "systemic"][ticket.doc.kind]
            ]
          )
        );
        col2.appendChild(row(ticket.doc.providerAgency));
        col3.appendChild(row(ticket.doc.payer));
        col4.appendChild(row(ticket.doc.payerName));
        col5.appendChild(
          row(ticket.passengerName + " " + ticket.passengerLastname)
        );
        col6.appendChild(
          row(ticket.doc._id.slice(0, 7), () => {
            emit("open-modal", {
              page: isCharter ? "viewCharter" : "viewSystemic",
              param: ticket.doc._id
            });
          })
        );
        col7.appendChild(row(ticket.airline));
      }
    }

    renderTickets(await search.results());
    dataWrapper.innerHTML = "";
    dataWrapper.appendChild(tabel);
  }

  // { never: true }:
  // If there is nothing else in the $or array it will
  // cause all the tickets from that type to be hidden.
  const initalQuery = {
    charter: {
      $or: [{ never: true }]
    },
    systemic: {
      $or: [{ never: true }]
    },
    ticket: {}
  };

  const kindCheckbox = (el, type: "charter" | "systemic", kind) => {
    initalQuery[type].$or.push({ kind });
    el.checked = true;
    el.addEventListener("change", () => {
      const search = stack[head];
      let $or = search.query[type].$or.filter(x => x.kind !== kind);
      if (el.checked) {
        $or = [...search.query[type].$or, { kind }];
      }
      addFilter(
        {
          $or
        },
        type
      );
    });
  };

  kindCheckbox(charterInternalCheckbox, "charter", "internal");
  kindCheckbox(charterInternationalCheckbox, "charter", "international");
  kindCheckbox(systemicInternalCheckbox, "systemic", "internal");
  kindCheckbox(systemicInternationalCheckbox, "systemic", "international");
  kindCheckbox(trainCheckbox, "systemic", "train");

  const providedByChange = () => {
    const cache = cacheCheckbox.checked;
    const credit = creditCheckbox.checked;
    let providedBy;
    if (cache && credit) {
      providedBy = undefined;
    } else if (cache) {
      providedBy = "cache";
    } else if (credit) {
      providedBy = "credit";
    } else {
      providedBy = "never";
    }
    addFilter(
      {
        providedBy
      },
      "charter"
    );
  };

  cacheCheckbox.addEventListener("change", providedByChange);
  creditCheckbox.addEventListener("change", providedByChange);

  pushToStack(await Search.query(initalQuery));
}

class Search {
  private cache = new Map();
  private id;
  private token;
  readonly query;
  count: number;

  static async query(query) {
    const search = new Search(query);
    await search.init();
    return search;
  }

  constructor(query) {
    this.query = JSON.parse(JSON.stringify(query));
    this.token = get("currentToken");
  }

  async init() {
    const server = get("server");
    const { data } = await axios.post(
      server + "/tickets/search",
      { query: this.query },
      {
        headers: {
          "hod-token": this.token
        }
      }
    );
    this.count = data.count;
    this.id = data.id;
  }

  async ping() {
    const server = get("server");
    await axios.post(
      server + "/tickets/ping",
      { id: this.id },
      {
        headers: {
          "hod-token": this.token
        }
      }
    );
  }

  async destroy() {
    const server = get("server");
    await axios.post(
      server + "/tickets/destroy",
      { id: this.id },
      {
        headers: {
          "hod-token": this.token
        }
      }
    );
  }

  async results(page = 0): Promise<t.TicketBase[]> {
    if (!this.id) {
      throw new Error("init() must be called first");
    }
    if (this.cache.has(page)) {
      this.ping();
      return this.cache.get(page);
    }
    const server = get("server");
    const { data } = await axios.post(
      server + "/tickets/results",
      { id: this.id, page },
      {
        headers: {
          "hod-token": this.token
        }
      }
    );
    this.cache.set(page, data.data);
    return data.data;
  }
}
