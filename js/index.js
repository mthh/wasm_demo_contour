import wasmModule from '../crate/Cargo.toml'
import { range as d3range } from 'd3-array';
import { geoPath as d3geoPath } from 'd3-geo';
import { timer as d3timer } from 'd3-timer';

const container = document.querySelector('.canvas-container');
const canvas = document.createElement('canvas');
canvas.setAttribute('width', 600);
canvas.setAttribute('height', 500);
container.appendChild(canvas);

const context = canvas.getContext("2d");
const path = d3geoPath(null, context);

const n = 140;
const m = 140;
const _values = new Float64Array((n + 2) * (m + 2));

const value = (x, y) => Math.sin(x + y) * Math.sin(x - y);
for (var j = -0.5, k = 0; j < m + 1; ++j) {
  for (var i = -0.5; i < n + 1; ++i, ++k) {
    _values[k] = value(i / n * 19.2 - 9.6, 5 - j / m * 15);
  }
}
const thresholds = d3range(-1.2, 1.2, 0.22);
const _dv = (t) => (t % 1200) / 1200 * 0.22

// const value = (x, y) => 0.26 * (x ** 2 + y ** 2) - 0.48 * x * y;
// for (var j = 0; j < m + 2; ++j) {
//   for (var i = 0; i < n + 2; ++i) {
//     _values[j * (n + 2) + i] = value(i / 7 - 10.5, m / 7 - j / 7 - 10.5);
//   }
// }
// const thresholds = d3range(-1, 10, 1);
// const _dv = (t) => (t % 1000) / 1000 * 2;


context.scale(canvas.width / (n + 2), canvas.width / (n + 2));
context.translate(-0.5, -0.5);

d3timer((t) => {
  const dv = _dv(t);
  const n_thresholds = new Float64Array(thresholds.map(v => v + dv));
  const result = JSON.parse(wasmModule.make_contours(_values, n_thresholds, n + 2, m + 2));
  result.features.forEach(fill);
});

function fill(ft) {
  context.beginPath();
  path(ft.geometry);
  context.fillStyle = ft.properties.color
  context.fill();
}

