/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import axios from "axios";
import EventEmitter from "eventemitter3";
import { PageURL, PageURLWithParam } from "./app";
import { get } from "./context";
import * as t from "./types";

const EE = new EventEmitter();
export interface EventDataTypeMap {
  goto: PageURL;
  "open-modal": PageURL;
  notification: string;
  "route-change": PageURLWithParam;
  login: t.User;
  sse: {
    read: () => Promise<void>;
    notification: t.Notification;
  };
}

export type EventName = keyof EventDataTypeMap;

export type EventCallBack<T extends EventName> = (
  data: EventDataTypeMap[T]
) => void;

export type Emit = <T extends EventName>(
  name: T,
  data: EventDataTypeMap[T]
) => void;

export type On = <T extends EventName>(name: T, cb: EventCallBack<T>) => void;

export declare const emit: Emit;
export declare const on: On;
export declare const once: On;
declare const module;

const seen = new Map<string, 1>();

async function readNotification(token, id) {
  const server = get("server");
  await axios.post(
    server + "/pub/read/" + id,
    {},
    {
      headers: {
        "hod-token": token
      }
    }
  );
}

export async function getNotifications() {
  const token = get("currentToken");
  const server = get("server");
  const { data: res } = await axios.post(
    server + "/pub/get",
    {},
    {
      headers: {
        "hod-token": token
      }
    }
  );

  if (res.code === 200) {
    for (let i = 0; i < res.msgs.length; ++i) {
      const msg = res.msgs[i];
      if (!seen.has(msg._id)) {
        seen.set(msg._id, 1);
        let sentReadReq = false;
        const readCb = async () => {
          if (sentReadReq) return;
          sentReadReq = true;
          await readNotification(token, msg._id);
        };
        // Fire an event.
        emit("sse", {
          read: readCb,
          notification: msg
        });
      }
    }
  } else {
    console.log("/pub/get", res);
    throw null;
  }
}

module.exports = EE;

window["ipc"] = EE;
