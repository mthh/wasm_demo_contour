import module from '../crate/Cargo.toml'
import * as d3 from 'd3';

const value = (x, y) => Math.sin(x + y) * Math.sin(x - y);

const canvas = d3.select(document.body)
.append('canvas')
.attr('width', 600)
.attr('height', 600)
.node();
const context = canvas.getContext("2d");
const color = d3.scaleSequential(d3.interpolateYlGnBu).domain([-1, 1]);
const path = d3.geoPath(null, context);
const thresholds = d3.range(-1.2, 1, 0.2);

const n = 120;
const m = 120;
const _values = new Float64Array((n + 2) * (m + 2));

for (var j = -0.5, k = 0; j < m + 1; ++j) {
for (var i = -0.5; i < n + 1; ++i, ++k) {
_values[k] = value(i / n * 19.2 - 9.6, 5 - j / m * 10);
}
}

context.scale(canvas.width / (n + 1), canvas.width / (n + 1));
context.translate(-0.5, -0.5);

d3.timer((t) => {
const dv = (t % 1000) / 1000 * 0.2;
const n_thresholds = new Float64Array(thresholds.map(v => v + dv));
const result = JSON.parse(module.make_contours(_values, n_thresholds, n + 2, m + 2));
result.features.forEach(fill);
});

function fill(ft) {
context.beginPath();
path(ft.geometry);
context.fillStyle = color(ft.properties.value);
context.fill();
}

