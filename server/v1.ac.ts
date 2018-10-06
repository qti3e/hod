/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

type ID = string;
type WORD = string;
const filename = path.resolve(".db/words.qdb");
const words = new Array<[ID, WORD, number]>();
const changed: number[] = [];
let cursor = 0;
let stream;
let writing = false;

function writeToDisk(sync = false): void {
  if (writing) return;
  console.log("Writing autocomplete data to file.");
  writing = true;
  // Start an async loop to write data to the disk.
  function loop() {
    const toWriteId = changed[cursor];
    const toWrite = words[toWriteId];
    if (!toWrite) {
      changed.splice(0);
      cursor = 0;
      writing = false;
      return;
    }
    const data = {
      id: toWrite[0],
      word: toWrite[1],
      count: toWrite[2]
    };
    const str = JSON.stringify(data) + "\n\n";
    if (sync) {
      fs.writeSync(stream, str);
    } else {
      stream.write(str);
    }
    cursor++;
    if (cursor === 10) {
      changed.splice(0, 10);
      cursor = 0;
    }
    if (sync) {
      loop();
    } else {
      process.nextTick(loop);
    }
  }
  loop();
}

function loadData(): void {
  // Create the file if it does not exsits.
  fs.closeSync(fs.openSync(filename, "a"));
  const data = fs.readFileSync(filename, "utf-8");
  const jsons = data.split("\n\n");
  for (let i = 0; i < jsons.length; ++i) {
    try {
      if (!jsons[i]) continue;
      const data = JSON.parse(jsons[i]);
      const { id, word, count } = data;
      let insert = true;
      for (let j = 0; j < words.length; ++j) {
        if (words[j][0] === id && words[j][1] === word) {
          words[j][2] = count;
          insert = false;
          break;
        }
      }
      if (insert) {
        changed.push(words.length);
        words.push([id, word, count]);
      }
    } catch (e) {
      // Is it really important that we've lost a bit of data?
      // I don't think so.
      console.log(e);
    }
  }
  normalize();
  console.log("Loaded autocomplete db");
}

function normalize() {
  // Normalize data.
  const oldStream = stream;
  changed.splice(0);
  for (let i = 0; i < words.length; ++i) {
    changed.push(i);
  }
  stream = fs.openSync(filename + ".tmp", "a");
  writeToDisk(true);
  fs.closeSync(stream);
  fs.renameSync(filename + ".tmp", filename);
  if (oldStream) {
    stream = oldStream;
  } else {
    stream = fs.createWriteStream(filename, {
      flags: "a"
    });
  }
}

loadData();

function addWord(id: string, word: string): void {
  word = word.trim();
  if (word.length < 2) return;
  const lower = word.toLowerCase();
  for (let i = 0; i < words.length; ++i) {
    if (words[i][0] === id && words[i][1].toLowerCase() === lower) {
      words[i][2] += 1;
      changed.push(i);
      return;
    }
  }
  words.push([id, word, 1]);
  changed.push(words.length - 1);
}

router.post("/add", function(
  req: express.Request,
  res: express.Response
): void {
  const { id, word } = req.body;
  res.send({ code: 200 });
  addWord(id, word);
  writeToDisk();
});

router.post("/add_array", function(
  req: express.Request,
  res: express.Response
): void {
  const { data } = req.body;
  if (!data) {
    return void res.send({
      code: 403
    });
  }
  try {
    for (let i = 0; i < data.length; ++i) {
      const [id, word] = data[i];
      addWord(id, word);
    }
  } catch (e) {
    console.log(e);
    writeToDisk();
    return void res.send({
      code: 503
    });
  }
  writeToDisk();
  res.send({
    code: 200
  });
});

router.post("/get", function(
  req: express.Request,
  res: express.Response
): void {
  const ret = [];
  const { id, text } = req.body;
  let i = 0;
  function loop() {
    const x = words[i];
    if (!x) {
      ret.sort((a, b) => {
        const aStarts = a[0].startsWith(text);
        const bStarts = b[0].startsWith(text);
        if (!aStarts || !bStarts) {
          if (aStarts) {
            return -1;
          }
          if (bStarts) {
            return 1;
          }
        }
        if (b[1] > a[1]) {
          return 1;
        } else if (b[1] == a[1]) {
          return 0;
        }
        return -1;
      });
      res.send({
        code: 200,
        ret: ret
          .filter(x => !!x[0])
          .slice(0, 15)
          .map(x => x[0])
      });
      return;
    }
    if (x[0] === id && (text.length === 0 || x[1].indexOf(text) > -1)) {
      ret.push([x[1], x[2]]);
    }
    i++;
    if (i % 15 === 0) {
      process.nextTick(loop);
    } else {
      loop();
    }
  }
  loop();
});

export { router };
