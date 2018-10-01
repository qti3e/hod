/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

export function inputWithLabel(small = false): HTMLElement {
  const wrapper = document.createElement("div");
  const label = document.createElement("label");
  const input = document.createElement("input");
  wrapper.appendChild(input);
  wrapper.appendChild(label);
  wrapper.classList.add("placeholder-input");
  if (small) {
    wrapper.classList.add("small");
  }

  function handlePossibleChanges() {
    const val = input.value;
    if (val.trim() === "") {
      wrapper.classList.remove("show-label");
    } else {
      wrapper.classList.add("show-label");
    }
    label.style.bottom = input.offsetHeight + label.offsetHeight + "px";
  }

  input.addEventListener("change", handlePossibleChanges);
  input.addEventListener("keyup", handlePossibleChanges);
  input.addEventListener("keydown", handlePossibleChanges);
  // To handle date component!
  setTimeout(handlePossibleChanges);

  Object.defineProperty(input, "placeholder", {
    get() {
      return input.getAttribute("placeholder");
    },
    set(value) {
      let tmp = value.replace(/[\.:]+$/g, "");
      if (small) {
        tmp += ":";
      }
      label.innerText = tmp;
      input.setAttribute("placeholder", value);
    }
  });

  return input;
}
