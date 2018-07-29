/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

export function delay(t: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, t));
}

export function len(o: {}): number {
  return Object.keys(o).length;
}
