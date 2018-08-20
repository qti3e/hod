/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import EventEmitter from "eventemitter3";
import { PageName } from "./app";
import * as t from "./types";

const EE = new EventEmitter();

export interface EventDataTypeMap {
  goto: PageName;
  "open-modal": PageName;
  notification: string;
  "route-change": PageName;
  login: t.User;
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
declare const module;

module.exports = EE;

window["ipc"] = EE;
