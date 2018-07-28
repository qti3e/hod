/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

// tslint:disable:variable-name

import React from "react";
import ReactDom from "react-dom";

const App = () => <div>Hello World!</div>;

// Render
const rootEl = document.getElementById("root");
ReactDom.render(<App />, rootEl);
