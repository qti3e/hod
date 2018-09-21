/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import { formatDate } from "./datepicker";
import { print as local } from "./local";
import * as lng from "./local";
import { numberMaskString } from "./mask";
import { toPersianDigits } from "./persian";
import { dataview } from "./table";
import * as t from "./types";
import { sumCharterTickets } from "./util";

interface Page extends HTMLElement {
  title: string;
  subtitle: string;
  date: string;
  number: string;
  setPage(page: number, totalPages: number): void;
  content: HTMLElement;
}

function newPage(): Promise<Page> {
  let resolve;
  const promise = new Promise<Page>(r => (resolve = r));

  const page = document.createElement("div");
  page.className = "sheet padding-5mm";

  const pageHead = document.createElement("div");
  pageHead.className = "header";
  page.appendChild(pageHead);

  // Metadata (right)
  const metadataWrapper = document.createElement("div");
  metadataWrapper.className = "metadata-container";
  pageHead.appendChild(metadataWrapper);

  const numberWrapper = document.createElement("div");
  numberWrapper.className = "field-wrapper";
  const numberLabel = document.createElement("label");
  numberLabel.innerText = local.number;
  const num = document.createElement("span");
  numberWrapper.appendChild(numberLabel);
  numberWrapper.appendChild(num);
  metadataWrapper.appendChild(numberWrapper);

  const dateWrapper = document.createElement("div");
  dateWrapper.className = "field-wrapper";
  const dateLabel = document.createElement("label");
  dateLabel.innerText = local.date;
  const date = document.createElement("span");
  dateWrapper.appendChild(dateLabel);
  dateWrapper.appendChild(date);
  metadataWrapper.appendChild(dateWrapper);

  // Middle section
  const titleContainer = document.createElement("div");
  titleContainer.className = "title-container";
  pageHead.appendChild(titleContainer);

  const title = document.createElement("h1");
  titleContainer.appendChild(title);

  const subtitle = document.createElement("h3");
  titleContainer.appendChild(subtitle);

  // Logo section
  const logoContainer = document.createElement("div");
  logoContainer.className = "logo-container";
  pageHead.appendChild(logoContainer);

  const logo = document.createElement("img");
  logo.src = require("./assets/logo-black.png");
  logoContainer.appendChild(logo);

  const contentWrapper = document.createElement("div");
  contentWrapper.className = "content";
  page.appendChild(contentWrapper);

  const defineGetterSetter = (name: string, element: HTMLElement) => {
    Object.defineProperty(page, name, {
      get(): string {
        return element.innerText;
      },
      set(value: string): void {
        value = toPersianDigits(value);
        if (name === "title") {
          document.title = local.title + " - " + value;
        }
        element.innerText = value;
      }
    });
  };

  defineGetterSetter("title", title);
  defineGetterSetter("subtitle", subtitle);
  defineGetterSetter("date", date);
  defineGetterSetter("number", num);
  Object.defineProperty(page, "content", { value: contentWrapper });

  const pageNumWrapper = document.createElement("div");
  pageNumWrapper.className = "field-wrapper";
  const pageNumLabel = document.createElement("label");
  pageNumLabel.innerText = local.page;
  const pageNum = document.createElement("span");
  pageNumWrapper.appendChild(pageNumLabel);
  pageNumWrapper.appendChild(pageNum);

  Object.defineProperty(page, "setPage", {
    value(page: number, totalPages: number): void {
      const p = toPersianDigits(page);
      const t = toPersianDigits(totalPages);
      pageNum.innerText = p + " " + local.from + " " + t;
      metadataWrapper.appendChild(pageNumWrapper);
    }
  });

  logo.onload = () => resolve(page);

  return promise;
}

function row(
  wrapper: HTMLElement,
  childs: HTMLElement[],
  className?: string
): void {
  const tmp = document.createElement("div");
  tmp.className = className || "";
  tmp.classList.add("simple-row");
  for (const child of childs) {
    if (child) {
      tmp.appendChild(child);
    }
  }
  wrapper.appendChild(tmp);
}

function text(labelText: string, value: string, size?: number): HTMLElement {
  const tmp = document.createElement("div");
  if (size !== undefined) {
    tmp.style.width = `${size * 100}%`;
  }
  labelText = labelText.replace(/\.+$/g, "");
  if (!labelText.endsWith(":")) {
    labelText += ":";
  }
  tmp.className = "text-wrapper";
  const label = document.createElement("label");
  label.innerText = labelText;
  const span = document.createElement("span");
  span.innerText = toPersianDigits(value || "-");
  if (value.length > 20) {
    span.style.fontSize = "12px";
  }
  tmp.appendChild(label);
  tmp.appendChild(span);
  return tmp;
}

export async function charter(doc: t.CharterDoc, wrapper: HTMLElement) {
  console.log(doc);

  const tmp = JSON.stringify(doc.tickets[0]);
  doc.tickets.length = 0;
  for (let i = 0; i < 54; ++i) {
    const x = JSON.parse(tmp);
    x.id = i + 1;
    doc.tickets.push(x);
  }

  // --- the real code

  const { totalReceived, totalPaid } = sumCharterTickets(doc.tickets);

  const pages = [];
  const numTicketsOnFirstPage = 10;
  let renderingFirstPage;

  const charterTableHandler = {
    _num_: true,
    id: "شماره بلیط",
    date: {
      label: "تاریخ",
      map(date: number) {
        return formatDate(date, true);
      }
    },
    route: {
      label: "مسیر",
      map(route: t.DBCity[]) {
        const src = route[0];
        const dest = route[route.length - 1];
        if (route.length === 0) {
          return "-";
        }
        if (route.length === 1) {
          return src.displayName + " - نامعلوم";
        }
        return src.displayName + " - " + dest.displayName;
      }
    },
    passengerName: {
      label: "مسافر",
      map(name: string, _, data: t.CharterTicket) {
        return name + " " + data.passengerLastname;
      },
      footer() {
        return renderingFirstPage && "جمع کل - ریال";
      }
    },
    paid: {
      label: "بهاء پرداخت",
      map: numberMaskString,
      footer() {
        return renderingFirstPage && numberMaskString(totalPaid);
      }
    },
    received: {
      label: "بهاء دریافت",
      map: numberMaskString,
      footer() {
        return renderingFirstPage && numberMaskString(totalReceived);
      }
    },
    airline: "ایرلاین"
  };

  async function renderPage(num: number): Promise<boolean> {
    renderingFirstPage = num === 0;

    const tabel = dataview(
      renderingFirstPage ? numTicketsOnFirstPage : 30,
      num - 1,
      renderingFirstPage ? 0 : numTicketsOnFirstPage,
      doc.tickets,
      charterTableHandler
    );
    if (renderingFirstPage) {
      doc.tickets.splice(0, numTicketsOnFirstPage);
    }
    if (!tabel) {
      return false;
    }

    const page = await newPage();
    page.title = "گردش کار ارائه خدمات مسافرتی";
    page.subtitle = `صدور بلیط "چارتر"`;
    page.date = formatDate(doc.createdAt, true);
    page.number = doc._id.substr(7);

    const { content } = page;

    if (num === 0) {
      row(content, [
        text(lng.newCharter.serviceKind, lng.newCharter[doc.kind]),
        text(lng.newCharter.providedBy, lng.listCharter[doc.providedBy]),
        text(lng.listCharter.providerAgency, doc.providerAgency, 2)
      ]);

      row(content, [
        text(lng.newCharter.payer, doc.payer),
        text(lng.newCharter.nameOfPayer, doc.payerName),
        text(lng.newCharter.nationalCode, doc.nationalCode)
      ]);
    }

    content.appendChild(tabel);

    if (num === 0) {
    }

    pages.push(page);
    console.log(num);
    wrapper.appendChild(page);
    return true;
  }

  let page = 0;
  while (await renderPage(page++)) {}

  if (pages.length > 1) {
    for (let i = 0; i < pages.length; ++i) {
      pages[i].setPage(i + 1, pages.length);
    }
  }
}
