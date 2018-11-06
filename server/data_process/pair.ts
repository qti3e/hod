import * as fs from "fs";
import { normalizeText } from "../persian";

function main() {
  const raw = normalizeText(fs.readFileSync("./airliens.txt", "utf-8"));
  const rows = raw.split(/\n/g).map(r => r.split(/\t/g).map(x => x.trim()));
  const data = [];
  for (let i = 1; i < rows.length; ++i) {
    if (rows[i].length < 3) { continue; }
    const e: Record<string, string> = {};
    for (let j = 1; j < rows[0].length; ++j) {
      e[rows[0][j]] = rows[i][j - 1];
    }
    const code = (e[rows[0][2]] || "").split("-")[0].trim();
    e.icon = code;
    data.push(e);
  }
  const code = "export const data = ";
  console.log(code + JSON.stringify(data, null, 4) + ";");
}

main();
