/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

// Common types.

export type UID = string;

export interface User {
  readonly _id?: string;
  uid: UID;
  name: string;
  lastName?: string;
  isRoot?: boolean;
}
