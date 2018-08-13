/**
 *    ____ _   _ _____
 *   /___ \ |_(_)___ /  ___
 *  //  / / __| | |_ \ / _ \
 * / \_/ /| |_| |___) |  __/
 * \___,_\ \__|_|____/ \___|
 */

import * as d3 from "d3";
import * as geojson from "./assets/countries.geo.json";
import { emit } from "./ipc";
import * as t from "./types";

let canvasCache;
let updateFnCache;

// A global var to pass data data from routeSelector to update().
const data = {
  route: []
};

export interface RouteSelectorElement extends HTMLDivElement {
  route: t.City[];
  show(): void;
}

export function routeSelector(): RouteSelectorElement {
  const block = document.createElement("div");
  block.id = "route-block";
  block.onclick = e => {
    if (e.target === block) {
      data.route = null;
      block.parentElement.removeChild(block);
    }
  };

  const wrapper = document.createElement("div");
  wrapper.id = "route-wrapper";
  block.appendChild(wrapper);

  const mapWrapper = document.createElement("div");
  mapWrapper.id = "map-wrapper";
  wrapper.appendChild(mapWrapper);
  const update = renderMap(mapWrapper);

  // Toggle Button.
  const btn = document.createElement("div") as RouteSelectorElement;
  btn.route = [];
  btn.innerText = "Btn";

  btn.onclick = () => {
    show();
  };

  btn.show = show;

  // Function to show modal.
  function show() {
    const parent = btn.parentElement;
    parent.appendChild(block);
    data.route = btn.route;
    // Start animation loop.
    update();
  }

  // For test
  setTimeout(() => {
    show();
  });

  return btn;
}

function renderMap(wrapper: HTMLElement): () => void {
  if (canvasCache) {
    wrapper.appendChild(canvasCache);
    return updateFnCache;
  }
  const width = 850;
  const height = 400;

  const canvas = document.createElement("canvas");
  wrapper.appendChild(canvas);
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  const projection = d3
    .geoMercator()
    .scale(150)
    .translate([width / 2, height / 2]);

  const geoGenerator = d3
    .geoPath()
    .projection(projection)
    .pointRadius(4)
    .context(context);

  const londonLonLat: [number, number] = [51.42434403, 35.67194277];
  const newYorkLonLat: [number, number] = [-74.0059, 40.7128];
  const geoInterpolator = d3.geoInterpolate(londonLonLat, newYorkLonLat);
  let u = 0;

  function update() {
    if (data.route === null) {
      return;
    }

    context.clearRect(0, 0, width, height);

    context.lineWidth = 0.5;
    context.strokeStyle = "#213747";
    context.beginPath();
    geoGenerator({
      type: "FeatureCollection",
      features: geojson.features
    });
    context.stroke();

    // London - New York
    context.beginPath();
    context.strokeStyle = "#ff9b26";
    context.lineWidth = 3;
    geoGenerator({
      type: "Feature",
      features: undefined,
      geometry: {
        type: "LineString",
        coordinates: [londonLonLat, newYorkLonLat]
      }
    });
    context.stroke();

    // Point
    context.beginPath();
    context.fillStyle = "#ff9b26";
    geoGenerator({
      type: "Feature",
      features: undefined,
      geometry: {
        type: "Point",
        coordinates: geoInterpolator(u)
      }
    });
    context.fill();

    // Point 2
    context.beginPath();
    geoGenerator({
      type: "Feature",
      features: undefined,
      geometry: {
        type: "Point",
        coordinates: londonLonLat
      }
    });
    context.fill();

    u += 0.005;

    if (u > 1) {
      u = 0;
    }

    requestAnimationFrame(update);
  }

  updateFnCache = update;
  canvasCache = canvas;

  return update;
}

setTimeout(() => {
  emit("goto", "newCharter");
});
