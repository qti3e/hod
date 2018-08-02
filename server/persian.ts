import express from "express";

export function normalizeText(text: string): string {
  let tmp = "";
  const len = text.length;
  for (let i = 0; i < len; ++i) {
    switch (text[i]) {
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
      default:
        tmp += text[i];
    }
  }
  return tmp;
}

export function normalizeBody(
  req: express.Request,
  res: express.Response
): void {
  for (const key in req.body) {
    if (typeof req.body[key] === "string") {
      req.body[key] = normalizeText(req.body[key]).trim();
    } else if (typeof req.body[key] === "number") {
      req.body[key] = String(req.body[key]);
    }
  }
  req.next();
}
