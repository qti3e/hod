/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

const rootEl = document.getElementById("root");

function renderDiv() {
  const div = document.createElement("div");
  div.innerHTML = "Hello World";
  rootEl.appendChild(div);
}

renderDiv();
