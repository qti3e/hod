/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

export function normalizeText(text: string): string {
  let tmp = "";
  const len = text.length;
  for (let i = 0; i < len; ++i) {
    switch (text[i]) {
      case "‌":
        tmp += " ";
        break;
      case "۰":
        tmp += "0";
        break;
      case "۱":
        tmp += "1";
        break;
      case "۲":
        tmp += "2";
        break;
      case "۳":
        tmp += "3";
        break;
      case "۴":
        tmp += "4";
        break;
      case "۵":
        tmp += "5";
        break;
      case "۶":
        tmp += "6";
        break;
      case "۷":
        tmp += "7";
        break;
      case "۸":
        tmp += "8";
        break;
      case "۹":
        tmp += "9";
        break;
      case "ي":
      case "ی":
      case "ﯾ":
      case "ﯽ":
      case "ﯿ":
      case "ﻳ":
      case "ى":
      case "ﯾ":
      case "ﯽ":
      case "ﯿ":
      case "ئ":
      case "ﺋ":
      case "ﺊ":
      case "ﺌ":
      case "ي":
      case "ﯾ":
      case "ﯽ":
      case "ﯿ":
      case "ﻴ":
      case "ﻲ":
        tmp += "ی";
        break;
      case "ب":
      case "ﺑ":
      case "ﺐ":
      case "ﺒ":
        tmp += "ب";
        break;
      case "پ":
      case "ﭘ":
      case "ﭗ":
      case "ﭙ":
        tmp += "پ";
        break;
      case "ت":
      case "ﺗ":
      case "ﺖ":
      case "ﺘ":
        tmp += "ت";
        break;
      case "ث":
      case "ﺛ":
      case "ﺚ":
      case "ﺜ":
        tmp += "ث";
        break;
      case "ج":
      case "ﺟ":
      case "ﺞ":
      case "ﺠ":
        tmp += "ج";
        break;
      case "چ":
      case "ﭼ":
      case "ﭻ":
      case "ﭽ":
        tmp += "چ";
        break;
      case "ح":
      case "ﺣ":
      case "ﺢ":
      case "ﺤ":
        tmp += "ح";
        break;
      case "خ":
      case "ﺧ":
      case "ﺦ":
      case "ﺨ":
        tmp += "خ";
        break;
      case "س":
      case "ﺳ":
      case "ﺲ":
      case "ﺴ":
        tmp += "س";
        break;
      case "ش":
      case "ﺷ":
      case "ﺶ":
      case "ﺸ":
        tmp += "ش";
        break;
      case "ص":
      case "ﺻ":
      case "ﺺ":
      case "ﺼ":
        tmp += "ص";
        break;
      case "ض":
      case "ﺿ":
      case "ﺾ":
      case "ﻀ":
        tmp += "ض";
        break;
      case "ط":
      case "ﻃ":
      case "ﻂ":
      case "ﻄ":
        tmp += "ط";
        break;
      case "ظ":
      case "ﻇ":
      case "ﻆ":
      case "ﻈ":
        tmp += "ظ";
        break;
      case "ع":
      case "ﻋ":
      case "ﻊ":
      case "ﻌ":
        tmp += "ع";
        break;
      case "غ":
      case "ﻏ":
      case "ﻎ":
      case "ﻐ":
        tmp += "غ";
        break;
      case "ف":
      case "ﻓ":
      case "ﻒ":
      case "ﻔ":
        tmp += "ف";
        break;
      case "ق":
      case "ﻗ":
      case "ﻖ":
      case "ﻘ":
        tmp += "ق";
        break;
      case "ک":
      case "ﮐ":
      case "ﮏ":
      case "ﮑ":
      case "ﻛ":
      case "ﻜ":
      case "ك":
      case "ﮐ":
      case "ﮏ":
      case "ﮑ":
      case "ﻚ":
        tmp += "ک";
        break;
      case "گ":
      case "ﮔ":
      case "ﮓ":
      case "ﮕ":
        tmp += "گ";
        break;
      case "ل":
      case "ﻟ":
      case "ﻞ":
      case "ﻠ":
        tmp += "ل";
        break;
      case "م":
      case "ﻣ":
      case "ﻢ":
      case "ﻤ":
        tmp += "م";
        break;
      case "ن":
      case "ﻧ":
      case "ﻦ":
      case "ﻨ":
        tmp += "ن";
        break;
      case "ﻻ":
      case "ﻼ":
      case "ﺎ":
        tmp += "لا";
        break;
      case "أ":
      case "إ":
      case "ا":
      case "ﺄ":
        tmp += "ا";
        break;
      case "ﺆ":
      case "ﻮ":
      case "و":
      case "ؤ":
        tmp += "و";
        break;
      case "ﺪ":
      case "د":
        tmp += "د";
        break;
      case "ذ":
      case "ﺬ":
        tmp += "ذ";
        break;
      case "ر":
      case "ﺮ":
        tmp += "ر";
        break;
      case "ز":
      case "ﺰ":
        tmp += "ز";
        break;
      case "ﮋ":
      case "ژ":
        tmp += "ژ";
        break;
      case "ة":
      case "ﮥ":
      case "ه":
      case "ه":
      case "ﻪ":
      case "ﻬ":
      case "ﻩ":
      case "ﻬ":
      case "ﻫ":
      case "ﻪ":
      case "ﻬ":
        tmp += "ه";
        break;
      case "ﷲ":
        tmp += "الله";
        break;
      default:
        tmp += text[i];
    }
  }
  return tmp;
}

export function normalizeBody(req, res): void {
  for (const key in req.body) {
    if (typeof req.body[key] === "string") {
      req.body[key] = normalizeText(req.body[key]).trim();
    } else if (typeof req.body[key] === "number") {
      req.body[key] = String(req.body[key]);
    }
  }
  req.next();
}

export function toPersianDigits(n: number | string): string {
  const str: string = String(n);
  let txt = "";
  for (let i = 0; i < str.length; ++i) {
    const ch = str[i];
    switch (ch) {
      case "1":
        txt += "۱";
        break;
      case "2":
        txt += "۲";
        break;
      case "3":
        txt += "۳";
        break;
      case "4":
        txt += "۴";
        break;
      case "5":
        txt += "۵";
        break;
      case "6":
        txt += "۶";
        break;
      case "7":
        txt += "۷";
        break;
      case "8":
        txt += "۸";
        break;
      case "9":
        txt += "۹";
        break;
      case "0":
        txt += "۰";
        break;
      default:
        txt += ch;
        break;
    }
  }
  return txt;
}

export function isPersian(text: string): boolean {
  const len = text.length;
  for (let i = 0; i < len; ++i) {
    switch (text[i]) {
      case "۰":
      case "۱":
      case "۲":
      case "۳":
      case "۴":
      case "۵":
      case "۶":
      case "۷":
      case "۸":
      case "۹":
      case "ي":
      case "ی":
      case "ﯾ":
      case "ﯽ":
      case "ﯿ":
      case "ﻳ":
      case "ى":
      case "ﯾ":
      case "ﯽ":
      case "ﯿ":
      case "ئ":
      case "ﺋ":
      case "ﺊ":
      case "ﺌ":
      case "ي":
      case "ﯾ":
      case "ﯽ":
      case "ﯿ":
      case "ﻴ":
      case "ﻲ":
      case "ب":
      case "ﺑ":
      case "ﺐ":
      case "ﺒ":
      case "پ":
      case "ﭘ":
      case "ﭗ":
      case "ﭙ":
      case "ت":
      case "ﺗ":
      case "ﺖ":
      case "ﺘ":
      case "ث":
      case "ﺛ":
      case "ﺚ":
      case "ﺜ":
      case "ج":
      case "ﺟ":
      case "ﺞ":
      case "ﺠ":
      case "چ":
      case "ﭼ":
      case "ﭻ":
      case "ﭽ":
      case "ح":
      case "ﺣ":
      case "ﺢ":
      case "ﺤ":
      case "خ":
      case "ﺧ":
      case "ﺦ":
      case "ﺨ":
      case "س":
      case "ﺳ":
      case "ﺲ":
      case "ﺴ":
      case "ش":
      case "ﺷ":
      case "ﺶ":
      case "ﺸ":
      case "ص":
      case "ﺻ":
      case "ﺺ":
      case "ﺼ":
      case "ض":
      case "ﺿ":
      case "ﺾ":
      case "ﻀ":
      case "ط":
      case "ﻃ":
      case "ﻂ":
      case "ﻄ":
      case "ظ":
      case "ﻇ":
      case "ﻆ":
      case "ﻈ":
      case "ع":
      case "ﻋ":
      case "ﻊ":
      case "ﻌ":
      case "غ":
      case "ﻏ":
      case "ﻎ":
      case "ﻐ":
      case "ف":
      case "ﻓ":
      case "ﻒ":
      case "ﻔ":
      case "ق":
      case "ﻗ":
      case "ﻖ":
      case "ﻘ":
      case "ک":
      case "ﮐ":
      case "ﮏ":
      case "ﮑ":
      case "ﻛ":
      case "ﻜ":
      case "ك":
      case "ﮐ":
      case "ﮏ":
      case "ﮑ":
      case "ﻚ":
      case "گ":
      case "ﮔ":
      case "ﮓ":
      case "ﮕ":
      case "ل":
      case "ﻟ":
      case "ﻞ":
      case "ﻠ":
      case "م":
      case "ﻣ":
      case "ﻢ":
      case "ﻤ":
      case "ن":
      case "ﻧ":
      case "ﻦ":
      case "ﻨ":
      case "ﻻ":
      case "ﻼ":
      case "ﺎ":
      case "أ":
      case "إ":
      case "ا":
      case "ﺄ":
      case "ﺆ":
      case "ﻮ":
      case "و":
      case "ؤ":
      case "ﺪ":
      case "د":
      case "ذ":
      case "ﺬ":
      case "ر":
      case "ﺮ":
      case "ز":
      case "ﺰ":
      case "ﮋ":
      case "ژ":
      case "ة":
      case "ﮥ":
      case "ه":
      case "ه":
      case "ﻪ":
      case "ﻬ":
      case "ﻩ":
      case "ﻬ":
      case "ﻫ":
      case "ﻪ":
      case "ﻬ":
      case "ﷲ":
        return true;
    }
  }
  return false;
}
