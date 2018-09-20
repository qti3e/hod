/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

type TableLabel = string;

type TableMapCb<T, P> = (data: T, index: number, e: P) => string;

type TableColObj<T, P> = {
  label: TableLabel;
  map?: TableMapCb<T, P>;
  footer?(): string;
};

type TableCol<T, P> = TableLabel | TableColObj<T, P>;

type TableColsData<T> = { [P in keyof T]?: TableCol<T[P], T> };

type TableColsId<T> = {
  _num_: Required<TableColObj<never, T>>;
};

type TableCols<T> = TableColsData<T> | TableColsId<T>;

export function dataview<T extends {}>(
  data: T[],
  cols: TableCols<T>
): HTMLTableElement {
  const table = document.createElement("table");

  const keys = Object.keys(cols);

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
  for (const key of keys) {
    const label = getLabel(cols[key]);
    th(label);
  }

  // Render body
  for (let i = 0; i < data.length; ++i) {
    tr();
    for (const key of keys) {
      const map = getMap(cols[key]);
      const text = getData(i, data, key, map);
      td(text);
    }
  }

  let footer = false;
  tr();
  currentTr.classList.add("foot");
  for (const key of keys) {
    if (typeof cols[key] === "object" && cols[key].footer) {
      footer = true;
      td(cols[key].footer());
    } else {
      td("", "empty");
    }
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
  const data = e[index][key];
  if (map) {
    return map(data, index, e[index]);
  }
  return data;
}
