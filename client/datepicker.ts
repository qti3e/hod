/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

const i18n = {
  previousMonth: "ماه قبلی",
  nextMonth: "ماه بعدی",
  months: [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند"
  ],
  weekdays: [
    "شنبه",
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهار‌شنبه",
    "پنج‌شنبه",
    "جمعه"
  ],
  weekdaysShort: ["ش", "ی", "د", "س", "چ", "پ", "ج"]
};

export interface Options {
  startYear: number;
}

const defaultOptions: Options = {
  startYear: 1397
};

export function datepicker(
  input: HTMLInputElement,
  opts: Partial<Options>
): void {
  const options: Options = {
    ...defaultOptions,
    ...opts
  };

  const daysWrappers: HTMLDivElement[] = [];

  const wrapper = document.createElement("div");
  wrapper.className = "qti3e-datepicker";

  const head = document.createElement("div");
  head.className = "head";
  wrapper.appendChild(head);

  const body = document.createElement("div");
  body.className = "body";
  wrapper.appendChild(body);

  for (let i = 0; i < 7; ++i) {
    const col = document.createElement("div");
    col.className = "col";
    body.appendChild(col);

    const day = renderDayName(i);
    const daysWrapper = document.createElement("div");
    col.appendChild(day);
    col.appendChild(daysWrapper);
    daysWrappers.push(daysWrapper);
  }

  // End of view.

  // TODO(qti3e) Maybe use input.value instead?
  let year = options.startYear;
  let month = 0;
  let day = 0;

  function updateValue() {
    // TODO(qti3e) set input.value.
  }

  function nextMonth() {
    month++;
    if (month > 11) {
      month = 0;
      year++;
    }
    updateValue();
  }

  function prevMonth() {
    month--;
    if (month < 0) {
      month = 11;
      year--;
    }
    updateValue();
  }

  const nextMonthBtn = document.createElement("button");
  nextMonthBtn.className = "next-month-btn";
  const prevMonthBtn = document.createElement("button");
  prevMonthBtn.className = "prevMonthBtn";
}

function renderDayName(i: number): HTMLElement {
  const tmp = document.createElement("div");
  tmp.className = "day-name";
  tmp.innerText = i18n.weekdaysShort[i];
  return tmp;
}

function renderMonth(
  year: number,
  month: number,
  daysWrappers: HTMLDivElement[]
): void {
}
