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
    currentUser: boolean;
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

async function getNotificationsForUser(token) {
  const currentToken = get("currentToken");
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
          currentUser: currentToken === token,
          notification: msg
        });
      }
    }
  } else {
    console.log("/pub/get", res);
    throw null;
  }
}

EE["getNotifications"] = async () => {
  await Promise.all(
    Object.keys(get("tokens")).map(x => getNotificationsForUser(x))
  );
};

module.exports = EE;

window["ipc"] = EE;

export declare const emit: Emit;
export declare const on: On;
export declare const once: On;
export declare function getNotifications(): Promise<void>;
declare const module;
