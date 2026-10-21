// Builds index.html from tools/template.html, inlining the Hursley House line drawing, the UK map and the
// November calendar as animatable SVG/HTML. Run: node tools/build.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const f = (n) => Math.round(n * 100) / 100;

// ── Hursley House: 316 paths measured from the reference photo (same data as the film) ──
const { box, els } = JSON.parse(readFileSync(join(here, "hursley.json"), "utf8"));
const K = 2.1; // stroke widths are authored in screen px at roughly this scale
const FRAME = 1000 / 30; // the film's frame timings, kept as-is so the site draws at the same pace
const hursley = [
  `<svg class="hursley draw" viewBox="${box.x0} ${box.y0} ${box.x1 - box.x0} ${box.y1 - box.y0 + 1}" role="img" aria-label="Line drawing of Hursley House, IBM Hursley">`,
  ...els.map((e) => {
    const brick = e.w < 0.01;
    const cls = brick ? "brick" : e.fill ? "f" : "";
    return `<path${cls ? ` class="${cls}"` : ""} pathLength="1" d="${e.d}" style="--d:${Math.round(e.at * FRAME)}ms;--t:${Math.round(e.dur * FRAME)}ms;stroke-width:${brick ? 0 : f(e.w / K)}"/>`;
  }),
  `</svg>`,
].join("\n");

// ── UK & Ireland outline with the Hursley pin ──
const uk = JSON.parse(readFileSync(join(here, "uk.json"), "utf8"));
const [px, py] = uk.pin;
const map = [
  `<svg class="uk draw" viewBox="0 0 ${uk.w} ${uk.h}" role="img" aria-label="Map of the UK and Ireland with IBM Hursley marked near Winchester">`,
  ...uk.paths.map((p, i) => `<path pathLength="1" d="${p.d}" style="--d:${Math.min(i, 6) * 60}ms;--t:1600ms"/>`),
  `<g class="pin" style="--x:${f(px)}px;--y:${f(py)}px">`,
  `<circle class="ripple" cx="${f(px)}" cy="${f(py)}" r="16"/>`,
  `<circle class="ripple r2" cx="${f(px)}" cy="${f(py)}" r="16"/>`,
  `<circle class="dot" cx="${f(px)}" cy="${f(py)}" r="13"/>`,
  `</g>`,
  `</svg>`,
].join("\n");

// ── November 2026, Monday first (1 November is a Sunday) ──
const cells = [];
for (let i = 0; i < 6; i++) cells.push(`<span class="d empty"></span>`);
for (let d = 1; d <= 30; d++) {
  const hot = d === 17 || d === 18;
  const idx = d + 5;
  cells.push(`<span class="d${hot ? " hot" : ""}" style="--i:${(idx % 7) + Math.floor(idx / 7)}">${d}${hot ? `<em>${d === 17 ? "Tue" : "Wed"}</em>` : ""}</span>`);
}
const calendar = cells.join("");

const html = readFileSync(join(here, "template.html"), "utf8").replace("<!--HURSLEY-->", hursley).replace("<!--UK-->", map).replace("<!--CALENDAR-->", calendar);
writeFileSync(join(root, "index.html"), html);
console.log(`index.html written (${Math.round(html.length / 1024)} KB, ${els.length} drawing paths)`);
