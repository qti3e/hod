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
  list_charter: "گزارشات چارتر",
  list_systemic: "گزارشات سیستمی",
  fund_dashboard: "داشبورد صندوق",
  cancel: "استرداد بلیط",
  tickets: "بلیط ها"
};

export const common = {
  "404": "صفحه مورد نظر یافت نشد.",
  hodhod: "هد هد"
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
  pCredit: "مبلغ اعتباری",
  payer: "طرف حساب...",
  nameOfPayer: "نام طرف حساب...",
  nationalCode: "کد ملی...",
  phoneNumber: "شماره تلفن...",
  pay: "اطلاعات پرداخت",
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
  agency: "آژانس عامل..."
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
  providerAgency: "آژانس عامل",
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
  credit: "اعتباری",
  differ: "مابه‌التفاوت نقدی",
  installmentBase: "مبلغ مبنای اقساط",
  wage: "مبلغ کارمزد",

  date: "تاریخ",
  passengerName: "نام مسافر",
  passengerLastname: "نام خانوادگی مسافر",
  paid: "پرداخت شده",
  received: "دریافتی",
  outline: "ایرلاین رفت",
  turnline: "ایرلاین بازگشت"
};

export const listSystemic = {
  ...listCharter,
  title: "گزارشات سیستمی",
  train: "قطار"
};

export const viewSystemic = {
  ...viewCharter,
  ...listSystemic,
  title: "گزارش سیستمی"
};

export const fundDashboard = {
  title: "داشبورد صندوق",
  id: "شناسه",
  docKind: "نوع سند",
  docPayer: "طرف حساب",
  docPayerName: "نام طرف حساب",
  dateOfCreation: "تاریخ ایجاد",
  show: "اقدام",
  charter: "چارتر",
  systemic: "سیستمی"
};

export const config = {
  done: "اتصال به سرور با موفقیت انجام شد.",
  versionError: "نسخه سرور با این نرم افزار همگام نمیباشد.",
  error: "امکان اتصال به سرور مورد نظر وجود ندارد.",
  title: "تنظیم سرور",
  host: "آدرس سرور...",
  set: "تلاش برای اتصال"
};

export const fillCharter = {
  title: "اطلاعت مالی چارتر"
};

export const payCharterCounter = {
  title: "اطلاعات پرداخت چارتر",
  ICI: "دریافت ICI...",
  cache: "دریافت نقدی...",
  companyCost: "هزینه شرکت...",
  credit: "مبلغ اعتباری...",
  differ: "مابه‌التفاوت نقدی...",
  installmentBase: "مبلغ مبنای اقساط...",
  wage: "مبلغ کارمزد...",
  receives: "دریافت ها",
  newCacheRec: "نقدی",
  newBankRec: "واریز به حساب",
  newHekmatRec: "حکمت کارت",
  newNotificationRec: "اطلاعیه",
  amount: "مبلغ...",
  receiverName: "نام دریافت کننده...",
  date: "تاریخ...",
  account: "حساب...",
  number: "شماره...",
  cacheReceive: "دریافت نقدی",
  bankReceive: "واریز به حساب",
  hekmatCardReceive: "حکمت کارت",
  notificationReceive: "اطلاعیه",
  newPayment: "پرداخت جدید",
  paymentsTitle: "پرداخت ها",
  submit: "ارسال",
  cancel: "لغو",
  note:
    "توجه: اطلاعات مالی وارد شده در این مرحله نهایی نبوده " +
    "و توسط صندوق بازبینی میشوند."
};

export const paySystemicCounter = {
  ...payCharterCounter,
  title: "اطلاعات پرداخت سیستمی"
};

export const cancel = {
  title: "استرداد بلیط"
};

export const tickets = {
  title: "بلیط ها"
};

export const print = {
  success: "گزارش مورد نظر با موفقیت چاپ شد"
};
