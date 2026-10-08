// Adapt app-designer's supplied scanner to real responsive web viewport sizes.
// The scan logic is unchanged. The original iOS safe-area warnings are reviewed
// separately because these snapshots are websites, without simulated system chrome.
import fs from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
const round = process.argv[2] || "r1",
  width = process.argv[3] || "375",
  height = process.argv[4] || "667";
const skill =
  process.env.APP_DESIGNER_SKILL ||
  "/home/inimfon-udoh/.codex/skills/app-designer";
const original = fs.readFileSync(path.join(skill, "scripts/shoot.mjs"), "utf8");
fs.mkdirSync(".local", { recursive: true });
const script = path.resolve(".local/web-shoot.mjs");
fs.writeFileSync(
  script,
  original.replace(
    "viewport: { width: 1400, height: 1000 }",
    "viewport: { width: Number(W||390), height: Number(H||844) }",
  ),
);
let fails = 0;
for (const name of fs
  .readdirSync(`design/resconate/frames/${round}`)
  .filter((n) => n.endsWith(".html"))) {
  const out = `design/resconate/scans/${round}-${width}/${name.replace(".html", "")}`;
  const r = spawnSync(
    process.execPath,
    [
      script,
      `design/resconate/frames/${round}/${name}`,
      "--out",
      out,
      "--width",
      width,
      "--height",
      height,
    ],
    { encoding: "utf8" },
  );
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(out + "/scan.txt", r.stdout + r.stderr);
  if (r.status) fails++;
  console.log(name + ": " + (r.status ? "needs review" : "no FAILs"));
}
console.log(
  `${fails} frame(s) require review. Details: design/resconate/scans/${round}-${width}`,
);
process.exitCode = fails ? 1 : 0;
