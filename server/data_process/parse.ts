import * as fs from "fs";
import { normalizeText } from "../persian";

class CountrMap<Key> {
  private map = new Map<Key, number>();

  get(key: Key): number {
    return this.map.get(key) || 0;
  }

  incr(key: Key, by = 1): void {
    if (!key) return;
    this.map.set(key, this.get(key) + by);
  }

  getArrayMap<Prefix>(prefix: Prefix): Array<[Prefix, Key, number]> {
    const ret: Array<[Prefix, Key, number]> = [];
    for (const key of this.map.keys()) {
      ret.push([prefix, key, this.get(key)]);
    }
    return ret;
  }
}

const data: Array<[string, string, number]> = [];

function parseDataTXT() {
  const raw = normalizeText(fs.readFileSync("./data.txt", "utf-8"));
  const rows = raw.split(/\n/g).map(r => r.split(/\t/g).map(x => x.trim()));
  const companies = new CountrMap<string>();
  const names = new CountrMap<string>();
  for (const row of rows) {
    let num_names = 1;
    if (row[1]) {
      num_names = row[1].split("-")
        .map(n => n.trim())
        .filter(x => !!x).map(d => {
          const name = d.replace(/(آقای|جناب|خانم)/g, "").trim();
          names.incr(name);
        }).length;
    }
    companies.incr(row[0], num_names);
  }
  data.push(...names.getArrayMap("payer_name"));
  data.push(...companies.getArrayMap("payer"));
}

function parseAgencies() {
  const raw = normalizeText(fs.readFileSync("./agencies", "utf-8"));
  const rows = raw.split(/\n/g).map(r => r.split(/\t/g).map(x => x.trim()));
  const agencies = new CountrMap<string>();
  for (const row of rows) {
    agencies.incr(row[0], 10);
  }
  data.push(...agencies.getArrayMap("agency"));
}

function parseAirlines() {
  const raw = normalizeText(fs.readFileSync("./airliens.txt", "utf-8"));
  const rows = raw.split(/\n/g).map(r => r.split(/\t/g).map(x => x.trim()));
  const airlines = new CountrMap<string>();
  for (let i = 1; i < rows.length; ++i) {
    airlines.incr(rows[i][0], 10);
  }
  data.push(...airlines.getArrayMap("airline"));
}

function main() {
  parseDataTXT();
  parseAgencies();
  parseAirlines();
  const code = "export const data = ";
  console.log(code + JSON.stringify(data, null, 4) + ";");
}

main();
