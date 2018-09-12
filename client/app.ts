/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import "@fortawesome/fontawesome-free/css/all.css";

import { get } from "./context";
import { emit, on, once } from "./ipc";
import { common as local } from "./local";
import { renderPrintView, requestPrint } from "./print";
import { delay } from "./util";

// Import views.
import { renderCancel } from "./cancel";
import { renderCharterPayCounter } from "./charter_pay_counter";
import { renderConfig } from "./config";
import { renderFrame } from "./frame";
import { renderFundDashboard } from "./fund_dashboard";
import { renderHome } from "./home";
import { renderListCharter } from "./list_charter";
import { renderListSystemic } from "./list_systemic";
import { renderLogin } from "./login";
import { renderMenu } from "./menu";
import { renderNewCharter } from "./new_charter";
import { renderNewSystemic } from "./new_systemic";
import { renderNewUser } from "./new_user";
import { renderSystemicPayCounter } from "./systemic_pay_counter";
import { renderTickets } from "./tickets";
import { renderUsersList } from "./users";
import { renderViewCharter } from "./view_charter";
import { renderViewSystemic } from "./view_systemic";

export type PageName =
  | "login"
  | "home"
  | "menu"
  | "usersList"
  | "newUser"
  | "newCharter"
  | "newSystemic"
  | "listCharter"
  | "viewCharter"
  | "listSystemic"
  | "viewSystemic"
  | "fundDashboard"
  | "config"
  | "charterPayCounter"
  | "systemicPayCounter"
  | "cancel"
  | "tickets";

export type PageURLWithParam = {
  page: PageName;
  param: any;
};

export type PageURL = PageName | PageURLWithParam;

export type Page = (
  app: HTMLElement,
  param?: any,
  closeCb?: (emitEvent?: boolean) => Promise<void>
) => void;
export type Pages = { [key in PageName]: Page };

export const pages: Pages = {
  login: renderLogin,
  home: renderHome,
  menu: renderMenu,
  usersList: renderUsersList,
  newUser: renderNewUser,
  newCharter: renderNewCharter,
  newSystemic: renderNewSystemic,
  listCharter: renderListCharter,
  viewCharter: renderViewCharter,
  listSystemic: renderListSystemic,
  viewSystemic: renderViewSystemic,
  fundDashboard: renderFundDashboard,
  config: renderConfig,
  charterPayCounter: renderCharterPayCounter,
  systemicPayCounter: renderSystemicPayCounter,
  cancel: renderCancel,
  tickets: renderTickets
};

function renderApp(wrapper: HTMLElement) {
  // Remove all children.
  wrapper.innerHTML = "";
  // Set default direction to RTL.
  wrapper.dir = "rtl";
  // Render electron's window frame.
  renderFrame(wrapper);

  const app = document.createElement("div");
  app.id = "app";
  wrapper.appendChild(app);

  const render = async (url: PageURL) => {
    const parsedURL = parseURL(url);
    let page = parsedURL.page;
    const param = parsedURL.param;
    // Hide current content with a fade effect.
    app.classList.add("hide");
    await delay(200);
    // First try to remove the first node very nicely.
    if (app.childNodes.length > 0) {
      const child = app.childNodes[0];
      // Let current component know we're going to unmount it.
      const e = new Event("component-will-unmount", {
        cancelable: true
      });
      const cancelled = !child.dispatchEvent(e);
      // We might want to call `e.preventDefault()`.
      if (cancelled) {
        return;
      }
      app.removeChild(child);
    }
    // Hard-remove all other contents inside the element.
    app.innerHTML = "";
    // First render page, then show it to the user.
    try {
      const currentToken = get("currentToken");
      const shouldLogin = !currentToken || !get("tokens")[currentToken];
      if (page === "login" || shouldLogin) {
        page = "login";
        return renderLogin(app);
      }

      if (pages[page]) {
        return pages[page](app, param);
      } else {
        console.log("404", page);
        emit("notification", local["404"]);
        if (page !== "home") {
          emit("goto", "home");
        } else {
          emit("notification", "Home page is lost!");
        }
      }
    } finally {
      emit("route-change", parsedURL);
      // To prevent a flush.
      await delay(50);
      // Remove the hide class.
      app.classList.remove("hide");
    }
  };

  // We can emit this event from anywhere to move
  // user to another page.
  on("goto", render);

  const renderModal = async (url: PageURL) => {
    const { page, param } = parseURL(url);
    let finishedLoading = false;
    const modalWrapper = document.createElement("div");
    modalWrapper.className = "modal-wrapper";
    wrapper.appendChild(modalWrapper);

    const innerWrapper = document.createElement("div");
    innerWrapper.className = "modal-inner-wrapper";
    modalWrapper.appendChild(innerWrapper);

    async function close(emitEvent = true) {
      if (emitEvent && innerWrapper.childNodes.length > 0) {
        const child = innerWrapper.childNodes[0];
        // Let current component know we're going to unmount it.
        const e = new Event("component-will-unmount", {
          cancelable: true
        });
        const cancelled = !child.dispatchEvent(e);
        // We might want to call `e.preventDefault()`.
        if (cancelled) {
          return;
        }
      }
      modalWrapper.classList.remove("show");
      // Wait till animation finishes.
      await delay(800);
      if (modalWrapper.parentElement) {
        modalWrapper.parentElement.removeChild(modalWrapper);
      }
    }

    modalWrapper.onclick = e => {
      if (!finishedLoading || e.target !== modalWrapper) return;
      close();
    };

    if (pages[page]) {
      pages[page](innerWrapper, param, close);
    }

    once("goto", () => {
      finishedLoading = false;
      close();
    });

    await delay(50);
    modalWrapper.classList.add("show");
    await delay(800);
    finishedLoading = true;
  };

  // Open a modal.
  on("open-modal", renderModal);

  // Initial rendering.
  // Try to open home page, it might render login page in
  // case user is not signed-in.
  render("home");
}

const params = new URLSearchParams(location.search);
const isPrint = params.get("print") === "true";
document.styleSheets[isPrint ? 0 : 1].disabled = true;

if (!isPrint) {
  on("print", (data) => {
    requestPrint(data);
  });
}

window.addEventListener("load", async () => {
  const root = document.getElementById("root");
  if (!isPrint) {
    renderApp(root);
  } else {
    const data = JSON.parse(params.get("data"));
    renderPrintView(root, data);
  }
});

on("notification", (text: string) => {
  return new Notification(local.hodhod, {
    body: text
  });
});

function parseURL(url: PageURL): PageURLWithParam {
  if (typeof url === "string") {
    return {
      page: url,
      param: undefined
    };
  }
  return url;
}
