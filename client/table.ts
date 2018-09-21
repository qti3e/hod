/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import { toPersianDigits } from "./persian";

type TableLabel = string;

type TableMapCb<T, P> = (data: T, index: number, e: P) => string;

type TableColObj<T, P> = {
  label: TableLabel;
  map?: TableMapCb<T, P>;
  footer?(): string;
};

type TableCol<T, P> = TableLabel | TableColObj<T, P>;

type TableColsData<T> = { [P in keyof T]?: TableCol<T[P], T> };

type TableColsId = {
  _num_?: boolean;
};

type TableCols<T> = TableColsData<T> & TableColsId;

export function dataview<T extends {}>(
  count: number,
  page: number,
  addToNum: number,
  data: T[],
  cols: TableCols<T>
): HTMLTableElement | false {
  // count: 5
  // len: 15
  // 00 01 02 03 04
  // 05 06 07 08 09
  // 10 11 12 13 14
  // page:
  //  0 => [00, 05)
  //  1 => [05, 10)
  //  2 => [10, 15)
  //  p => [pc, pc + c)

  const skipDataCheck = page < 0;
  page = Math.max(0, page);
  const start = page * count;
  const end = start + count
  // Check if there is any data to render
  // Always render the first page.
  if (!skipDataCheck && !data[start]) {
    return false;
  }

  const table = document.createElement("table");

  const keys = Object.keys(cols).filter(x => x !== "_num_");

  let currentTr: HTMLTableRowElement;

  const tr = () => {
    currentTr = document.createElement("tr");
    table.appendChild(currentTr);
  };

  const th = (label: string) => {
    const tmp = document.createElement("th");
    tmp.innerText = label;
    currentTr.appendChild(tmp);
  };

  const td = (data: string, className?: string) => {
    const tmp = document.createElement("td");
    if (className) {
      tmp.className = className;
    }
    tmp.innerText = data;
    currentTr.appendChild(tmp);
  };

  // Render header
  tr();
  if (cols._num_) {
    td("*");
  }
  for (const key of keys) {
    const label = getLabel(cols[key]);
    th(label);
  }

  // Render body
  for (let i = start; i < end; ++i) {
    tr();
    if (cols._num_) {
      td(toPersianDigits(`${i + 1 + addToNum}`));
    }
    for (const key of keys) {
      const map = getMap(cols[key]);
      const text = getData(i, data, key, map);
      td(text);
    }
  }

  let footer = false;
  tr();
  currentTr.classList.add("foot");
  if (cols._num_) {
    td("", "empty");
  }
  for (const key of keys) {
    if (typeof cols[key] === "object" && cols[key].footer) {
      const tmp = cols[key].footer();
      if (tmp) {
        footer = true;
        td(tmp);
        continue;
      }
    }
    td("", "empty");
  }
  if (!footer) {
    currentTr.parentElement.removeChild(currentTr);
  }

  return table;
}

function getLabel(col: TableCol<any, any>): string {
  if (typeof col === "string") {
    return col;
  }
  return col.label;
}

function getMap(col: TableCol<any, any>): TableMapCb<any, any> {
  if (typeof col === "string") {
    return null;
  }
  return col.map;
}

function getData(
  index: number,
  e: any,
  key: string,
  map: TableMapCb<any, any>
): string {
  if (!e[index]) {
    return "";
  }
  const data = e[index][key];
  if (map) {
    return toPersianDigits(map(data, index, e[index]) || "-");
  }
  return toPersianDigits(data || "-");
}
