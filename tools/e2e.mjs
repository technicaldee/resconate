import { chromium } from "playwright-core";
import fs from "node:fs";
import assert from "node:assert/strict";
const origin = process.env.E2E_URL || "http://localhost:3000";
const round = process.env.DESIGN_ROUND || "r1";
const out = `design/resconate/shots/${round}`;
fs.mkdirSync(out, { recursive: true });
fs.mkdirSync(`design/resconate/frames/${round}`, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome",
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  reducedMotion: "reduce",
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
let count = 0;
async function check(label) {
  await page.evaluate(() => document.fonts.ready);
  const problems = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > innerWidth + 1,
    images: [...document.images]
      .filter((i) => !i.complete || i.naturalWidth === 0)
      .map((i) => i.src),
  }));
  assert.equal(problems.overflow, false, label + " has horizontal overflow");
  assert.deepEqual(problems.images, [], label + " has broken images");
  count++;
}
async function shoot(name) {
  await check(name);
  await page.screenshot({ path: `${out}/${name}.png` });
  let html = await page.locator("#__next").innerHTML();
  const scroll = await page.evaluate(
    () => document.querySelector(".workspace-body")?.scrollTop || 0,
  );
  html = html
    .replaceAll("/illustrations/", "../../../../frontend/public/illustrations/")
    .replaceAll("/logo.png", "../../../../frontend/public/logo.png");
  const style = fs
    .readFileSync("frontend/styles/resconate.css", "utf8")
    .replaceAll("/fonts/", "../../../../frontend/public/fonts/");
  fs.writeFileSync(
    `design/resconate/frames/${round}/${name}.html`,
    `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>${style}.screen{min-height:100vh}</style></head><body><div class="screen" data-name="${name}" data-scroll>${html}</div><script>document.querySelector('.workspace-body')?.scrollTo(0,${scroll});</script></body></html>`,
  );
}
try {
  await page.goto(origin, { waitUntil: "networkidle" });
  await shoot("01-home");
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await check("home " + width);
    if (width === 1440)
      await page.screenshot({
        path: `${out}/home-desktop.png`,
        fullPage: true,
      });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of [
    "/pricing",
    "/how-it-works",
    "/services",
    "/about",
    "/contact",
    "/help",
    "/privacy",
    "/terms",
    "/login",
    "/forgot-password",
    "/reset-password",
    "/accept-invite",
    "/not-a-page",
  ]) {
    await page.goto(origin + path, { waitUntil: "networkidle" });
    await check(path);
  }
  await page.goto(origin + "/demo", { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "The working day." }).waitFor();
  await shoot("02-demo");
  await page
    .getByRole("button", { name: "Add a record", exact: true })
    .first()
    .click();
  await page.getByRole("spinbutton").fill("2500");
  await page.getByRole("button", { name: "Review record" }).click();
  await shoot("03-record-review");
  await page.getByRole("button", { name: "Confirm record" }).click();
  await page.getByRole("heading", { name: /recorded\./ }).waitFor();
  await shoot("04-record-saved");
  await page.getByRole("button", { name: "Back to the working day" }).click();
  assert.ok(
    await page.getByRole("cell", { name: "₦2,500.00", exact: true }).count(),
  );
  await page.getByRole("button", { name: "Use dark appearance" }).click();
  assert.equal(
    await page
      .locator(".side-nav a.active")
      .evaluate((e) => getComputedStyle(e).color),
    "rgb(238, 242, 238)",
  );
  await shoot("05-dark");
  await page.setViewportSize({ width: 375, height: 667 });
  await page.screenshot({ path: `${out}/dark-small.png` });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Use light appearance" }).click();
  await page.goto(origin + "/signup", { waitUntil: "networkidle" });
  await shoot("06-signup");
  const email = "browser-" + Date.now() + "@example.test";
  await page.getByLabel("Your name").fill("Ada Browser");
  await page.getByLabel("Business name").fill("Uyo Test Kitchen");
  await page.getByLabel("Email address").fill(email);
  await page
    .getByLabel("Password", { exact: true })
    .fill("Browser-test-password-2026");
  await page.getByRole("button", { name: "Create workspace" }).click();
  await page.waitForURL("**/app");
  await page.getByRole("heading", { name: "The working day." }).waitFor();
  await shoot("07-empty");
  await page
    .getByRole("button", { name: "Add your first worker", exact: true })
    .click();
  await page.getByLabel("Worker name").fill("Blessing Browser");
  await page.getByLabel("Job / role").fill("Cook");
  await page.getByLabel("Pay arrangement").selectOption("monthly");
  await page.getByLabel("Agreed rate (₦)").fill("45000");
  await page.getByRole("button", { name: "Save", exact: false }).click();
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  await page
    .getByRole("button", { name: "Add a record", exact: true })
    .first()
    .click();
  await page.getByRole("spinbutton").fill("5000");
  await page.getByRole("button", { name: "Review record" }).click();
  await page.getByRole("button", { name: "Confirm record" }).click();
  await page.getByRole("button", { name: "Back to the working day" }).click();
  await page.goto(origin + "/app/workers", { waitUntil: "networkidle" });
  await page.getByText("Blessing Browser", { exact: true }).waitFor();
  await shoot("08-workers");
  await page.goto(origin + "/app/pay", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Prepare pay", exact: true }).click();
  await page.getByRole("button", { name: "Prepare draft" }).click();
  await page.waitForURL("**/app/pay/*");
  await page.getByRole("heading", { name: "Review the pay." }).waitFor();
  assert.ok(await page.getByText("₦40,000.00", { exact: true }).count());
  await shoot("09-pay-draft");
  await page.getByRole("button", { name: "Approve pay", exact: true }).click();
  await page.getByRole("button", { name: "Approve ₦40,000.00" }).click();
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  await page.getByRole("button", { name: "Record / send" }).click();
  await page.getByRole("button", { name: "Review record" }).click();
  await page.getByRole("button", { name: "Confirm record" }).click();
  await page.getByRole("heading", { name: /recorded\./ }).waitFor();
  await shoot("16-cash-receipt");
  await page.getByRole("button", { name: "Back to the working day" }).click();
  await page.reload({ waitUntil: "networkidle" });
  await page.getByText("Paid · details").waitFor();
  await shoot("10-pay-paid");
  const csv = await context.request.get(origin + "/api/workspace/export");
  assert.equal(csv.status(), 200);
  assert.ok((await csv.text()).includes("Blessing Browser"));
  await page.goto(origin + "/app/support", { waitUntil: "networkidle" });
  await page
    .getByLabel("Tell us what happened")
    .fill("Please help review the next working period.");
  await page.getByRole("button", { name: "Save support request" }).click();
  await page
    .getByText("Your request has been saved.", { exact: true })
    .waitFor();
  await page.goto(origin + "/app/tools", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Vacancies", exact: true }).click();
  await page.getByRole("button", { name: "Add vacancy" }).click();
  await page.getByLabel("Job title").fill("Kitchen assistant");
  await page
    .getByLabel("Job details")
    .fill("Morning kitchen preparation and customer service.");
  await page.getByRole("button", { name: "Save", exact: false }).click();
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  await page.getByRole("heading", { name: "Kitchen assistant" }).waitFor();
  await shoot("12-team-tools");
  await page.goto(origin + "/services", { waitUntil: "networkidle" });
  await shoot("13-services");
  await page.goto(origin + "/app/settings", { waitUntil: "networkidle" });
  await page
    .getByRole("heading", { name: "Your business, connected." })
    .waitFor();
  await shoot("11-settings");
  await page.getByRole("button", { name: "Use dark appearance" }).click();
  assert.equal(
    await page
      .locator(".side-nav a.active")
      .evaluate((e) => getComputedStyle(e).color),
    "rgb(238, 242, 238)",
  );
  await shoot("15-dark-settings");
  await page.getByRole("button", { name: "Use light appearance" }).click();
  await page
    .getByRole("heading", { name: "Plan", exact: true })
    .evaluate((e) => e.scrollIntoView({ block: "start" }));
  await page.waitForTimeout(150);
  await shoot("14-plan-connections");
  await page.evaluate(() => {
    document.querySelector(".workspace-body")?.scrollTo(0, 0);
    scrollTo(0, 0);
  });
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await check("settings " + width);
    await page.goto(origin + "/app", { waitUntil: "networkidle" });
    await check("workspace " + width);
    if (width === 1440)
      await page.screenshot({
        path: `${out}/workspace-desktop.png`,
        fullPage: true,
      });
    await page.goto(origin + "/app/settings", { waitUntil: "networkidle" });
  }
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto(origin + "/app/workers", { waitUntil: "networkidle" });
  await check("workers 375");
  await page.screenshot({ path: `${out}/workers-small.png` });
  await page.goto(origin + "/app/settings", { waitUntil: "networkidle" });
  await page
    .getByRole("button", { name: "Sign out", exact: true })
    .last()
    .click();
  await page.waitForURL("**/login");
  await page.goto(origin + "/app");
  await page.waitForURL("**/login");
  assert.deepEqual(errors, []);
  console.log(
    `PASS: ${count} responsive/asset checks; signup, session, records, pay approval, cash settlement, exports, support, vacancies, reload persistence, logout and auth guard.`,
  );
  console.log("Screenshots: " + out);
  fs.writeFileSync(
    `${out}/verification.json`,
    JSON.stringify({ passed: true, checks: count, errors, email }, null, 2),
  );
} finally {
  await browser.close();
}
