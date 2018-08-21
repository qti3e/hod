/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

export const login = {
  username: "نام‌کاربری...",
  password: "رمز‌عبور...",
  login: "ورود",
  error: "نام کاربری یا رمز عبور اشتباه است."
};

export const frame = {
  admin: "مدیریت",
  login: "افزودن حساب",
  logout: "خروج"
};

export const menu = {
  users: "لیست کاربران",
  home: "صفحه اصلی",
  new_user: "کاربر جدید",
  new_charter: "چارتر جدید",
  new_systemic: "سیستمی جدید",
  list_charter: "گزارشات چارتر"
};

export const common = {
  "404": "صفحه مورد نظر یافت نشد."
};

export const newUser = {
  submit: "ارسال",
  name: "نام...",
  lastName: "نام خانوادگی...",
  nationalCode: "کد ملی...",
  password: "رمز عبور...",
  repeatPassword: "تکرار رمز عبور...",
  successful: "کاربر مورد نظر با موفقیت در سیستم درج شد.",
  failed: "عملیات با شکست مواجه شد.",
  passwordCheck: "رمز عبور و تکرار آن میبایست یکی باشند.",
  nationalCodeCheck: "هم اکنون کاربر دیگری در سیستم با این کد ملی وجود دارد."
};

export const usersList = {
  name: "نام",
  lastName: "نام خانوادگی",
  nationalCode: "کد ملی"
};

export const newCharter = {
  title: "چارتر جدید",
  serviceKind: "نوع خدمات:",
  internal: "داخلی",
  international: "خارجی",
  providedBy: "نحوه تهیه",
  pCache: "نقد و اینترنتی",
  pCredit: "اعتباری",
  payer: "طرف حساب...",
  nameOfPayer: "نام طرف حساب...",
  nationalCode: "کد ملی...",
  phoneNumber: "شماره تلفن...",
  submit: "ارسال",
  id: "شماره بلیط...",
  date: "تاریخ",
  route: "مسیر",
  passengerName: "نام مسافر...",
  passengerLastname: "نام خانوادگی مسافر...",
  paid: "پرداخت شده...",
  received: "دریافتی...",
  outline: "ایرلاین رفت...",
  turnline: "ایرلاین بازگشت...",
  newTicket: "افزودن بلیط جدید",
  ICI: "دریافت ICI...",
  cache: "دریافت نقدی...",
  companyCost: "هزینه شرکت...",
  credit: "مابه‌التفاوت نقدی...",
  installmentBase: "مبلغ مبنای اقساط...",
  wage: "مبلغ کارمزد..."
};

export const newSystemic = {
  ...newCharter,
  title: "سیستمی جدید",
  train: "قطار",
  outline: "نام ایرلاین/قطار..."
};

export const route = {
  unknown: "مشخص نشده",
  search: "جست و جو..."
};

export const listCharter = {
  title: "گزارشات چارتر",
  next: "صفحه بعدی",
  prev: "صفحه قبلی",

  id: "شناسه",
  serviceKind: "نوع خدمات",
  dateOfCreation: "تاریخ ایجاد",
  providedBy: "نحوه تهیه",
  payer: "طرف حساب",
  nameOfPayer: "نام طرف حساب",

  internal: "داخلی",
  international: "خارجی",
  cache: "نقد و اینترنتی",
  credit: "اعتباری"
};

export const viewCharter = {
  ...listCharter,
  title: "گزارش چارتر",

  info: "اطلاعات",
  payer: "طرف حساب",
  counter: "کانتر",
  receives: "دریافتی ها",
  tickets: "بلیط ها",

  dateOfCreation: "تاریخ ایجاد",
  dateOfUpdate: "تاریخ بروزرسانی",

  serviceKind: "نوع خدمات",
  phoneNumber: "شماره تلفن",
  nationalCode: "کد ملی",

  name: "نام",
  lastName: "نام خانوادگی",

  ICI: "دریافت ICI",
  cache: "دریافت نقدی",
  companyCost: "هزینه شرکت",
  credit: "مابه‌التفاوت نقدی",
  installmentBase: "مبلغ مبنای اقساط",
  wage: "مبلغ کارمزد",

  date: "تاریخ",
  passengerName: "نام مسافر",
  passengerLastname: "نام خانوادگی مسافر",
  paid: "پرداخت شده",
  received: "دریافتی",
  outline: "ایرلاین رفت",
  turnline: "ایرلاین بازگشت",
};
