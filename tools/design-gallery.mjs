import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";
const round = process.argv[2] || "r3",
  root = path.resolve("design/resconate"),
  shots = path.join(root, "shots", round);
const names = fs.readdirSync(shots).filter((n) => /^\d+.*\.png$/.test(n));
const style =
  "body{margin:0;background:#e7edef;color:#00263e;font:16px Arial,sans-serif;padding:36px}h1{font-size:28px;margin:0 0 24px}main{display:grid;grid-template-columns:repeat(4,300px);gap:28px}figure{margin:0}img{width:300px;display:block}figcaption{font-size:12px;margin-top:8px}";
const html = `<!doctype html><html><head><meta charset="utf-8"><title>Resconate rendered design</title><style>${style}</style></head><body><h1>Resconate · neighbourhood shop counter</h1><main>${names.map((n) => `<figure><img src="shots/${round}/${n}" alt="${n.replace(".png", "")}"><figcaption>${n.replace(".png", "")}</figcaption></figure>`).join("")}<figure class="app-icon"><img src="../../frontend/public/logo.png" alt="Resconate app icon"><figcaption>Original brand mark</figcaption></figure></main></body></html>`;
fs.writeFileSync(root + "/mockup.html", html);
const b = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
});
const p = await b.newPage({ viewport: { width: 1340, height: 1000 } });
await p.goto("file://" + root + "/mockup.html");
await p.screenshot({ path: shots + "/sheet.png", fullPage: true });
const before = `<!doctype html><html><head><meta charset="utf-8"><title>Resconate before and after</title><style>${style}main{grid-template-columns:600px 600px}img{width:600px}h2{font-size:20px}</style></head><body><h1>Resconate · before / after</h1><main><figure><h2>Previous homepage</h2><img src="shots/before-desktop.png" alt="Previous homepage"></figure><figure><h2>Redesigned homepage</h2><img src="shots/${round}/home-desktop.png" alt="New homepage"></figure></main></body></html>`;
fs.writeFileSync(root + "/before-after.html", before);
await p.goto("file://" + root + "/before-after.html");
await p.screenshot({ path: shots + "/before-after.png", fullPage: true });
await b.close();
console.log("Gallery, sheet and before/after saved for " + round);
