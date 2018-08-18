/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import jalaali from "jalaali-js";
import { toPersianDigits } from "./persian";

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
  opts: Partial<Options> = {}
): void {
  const options: Options = {
    ...defaultOptions,
    ...opts
  };

  let changed = false;
  const daysWrappers: HTMLDivElement[] = [];

  const wrapper = document.createElement("div");
  wrapper.className = "qti3e-datepicker is-hidden";
  wrapper.style.position = "fixed";
  wrapper.onclick = () => (changed = true);

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

  // Render actions.
  const nextMonthBtn = document.createElement("button");
  nextMonthBtn.className = "next-month-btn";
  const prevMonthBtn = document.createElement("button");
  prevMonthBtn.className = "prev-month-btn";

  // Render Information Nodes.
  const monthName = document.createElement("div");
  monthName.className = "month-name";
  const yearName = document.createElement("div");
  yearName.className = "year-name";

  // Add elements to DOM with respect to our designed layout.
  head.appendChild(prevMonthBtn);
  head.appendChild(monthName);
  head.appendChild(nextMonthBtn);
  head.appendChild(yearName);

  // Bind events.
  nextMonthBtn.onclick = () => nextMonth();
  prevMonthBtn.onclick = () => prevMonth();

  // End of view.

  // TODO(qti3e) Maybe use input.value instead?
  let year = options.startYear;
  let month = 0;
  let day = 0;

  function prevMonth(): void {
    month--;
    if (month < 0) {
      month = 11;
      year--;
    }
    // Re-render month;
    render();
    updateValue();
  }

  function nextMonth(): void {
    month++;
    if (month > 11) {
      month = 0;
      year++;
    }
    // Re-render month;
    render();
    updateValue();
  }

  function selectDay(d: number): void {
    day = d;
    updateValue();
    // Auto close data picker on selection.
    changed = false;
    hide();
    input.blur();
    // Note: No need to re-render body.
    // renderMonth already handles changes of .is-selected class.
  }

  function updateValue() {
    input.value = toPersianDigits(`${year}/${month + 1}/${day + 1}`);
    monthName.innerText = i18n.months[month];
    yearName.innerText = toPersianDigits(year);
    changed = true;
    input.focus();
  }

  function render() {
    renderMonth(year, month, day, daysWrappers, selectDay);
  }

  function show() {
    wrapper.classList.remove("is-hidden");
    const top = input.offsetTop + input.offsetHeight;
    const left = input.offsetLeft;
    wrapper.style.top = top + "px";
    wrapper.style.left = left + "px";
  }

  function hide() {
    wrapper.classList.add("is-hidden");
  }

  // Initial rendering step.
  render();
  updateValue();

  // Bind date picker with the input element.
  document.body.appendChild(wrapper);
  input.onfocus = () => {
    show();
  };

  input.onblur = () => {
    changed = false;
    setTimeout(() => {
      if (!changed) {
        hide();
      }
    }, 200);
  };
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
  // Selected day.
  day: number,
  daysWrappers: HTMLDivElement[],
  selectDayCb: (d: number) => void
): void {
  // Remove all of contents in days wrappers.
  for (let i = 0; i < 7; ++i) {
    daysWrappers[i].innerHTML = "";
  }

  // Insert empty div elements.
  const firstDay = getWeekDay(year, month, 0);
  for (let i = 0; i < firstDay; ++i) {
    const tmp = document.createElement("div");
    tmp.className = "day is-empty";
    daysWrappers[i].appendChild(tmp);
  }

  // Now let's insert days.
  const isLeap: boolean = jalaali.isLeapJalaaliYear(year);
  const numberOfDaysInMonth = getNumberOfDaysInMonth(isLeap, month);
  let dayIndex = firstDay;
  let selected = null;
  for (let i = 0; i < numberOfDaysInMonth; ++i) {
    const dayElement = document.createElement("div");
    dayElement.className = "day";
    if (day === i) {
      dayElement.classList.add("is-selected");
      selected = dayElement;
    }
    // TODO(qti3e) Support is-today.
    dayElement.innerText = toPersianDigits(i + 1);
    dayElement.onclick = () => {
      selectDayCb(i);
      if (selected) {
        selected.classList.remove("is-selected");
      }
      dayElement.classList.add("is-selected");
      selected = dayElement;
    };
    daysWrappers[dayIndex].appendChild(dayElement);
    dayIndex++;
    if (dayIndex > 6) {
      dayIndex = 0;
    }
  }
}

function getWeekDay(y: number, m: number, d: number): number {
  const { gy, gm, gd } = jalaali.toGregorian(y, m + 1, d + 1);
  const date = new Date(gy, gm - 1, gd);
  const day = date.getDay();
  // Iran starts from Saturday but when `day` is zero,
  // it means it's Sunday.
  return (day + 1) % 7;
}

function getNumberOfDaysInMonth(isLeap: boolean, m: number): number {
  if (m < 6) {
    return 31;
  }
  if (m === 11 && isLeap) {
    return 29;
  }
  return 30;
}
