const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  calculatePay,
  parseMessage,
  hashPassword,
  checkPassword,
} = require("../src/domain");
test("daily and piecework use decimal units while agreed monthly pay is not prorated", () => {
  const workers = [
    { id: "a", name: "Ada", rate: 350000, pay_type: "daily" },
    { id: "b", name: "B", rate: 4500000, pay_type: "monthly" },
  ];
  const r = calculatePay(workers, [
    { worker_id: "a", kind: "work", units: "1.5" },
    { worker_id: "a", kind: "advance", amount: 100000 },
    { worker_id: "b", kind: "bonus", amount: 50000 },
    { worker_id: "b", kind: "advance", amount: 500000 },
  ]);
  assert.equal(r[0].net, 425000);
  assert.equal(r[1].net, 4050000);
});
test("excess advances remain visible and voided records are excluded", () => {
  const [r] = calculatePay(
    [{ id: "a", rate: 100, pay_type: "weekly" }],
    [
      { worker_id: "a", kind: "advance", amount: 150 },
      { worker_id: "a", kind: "bonus", amount: 1000, voided_at: "now" },
    ],
  );
  assert.equal(r.net, 0);
  assert.equal(r.carried_advance, 50);
});
test("WhatsApp parser refuses ambiguous names and unknown or malformed commands", () => {
  const w = [
    { id: "a", name: "Ada Okon" },
    { id: "b", name: "Ada Udo" },
  ];
  assert.equal(parseMessage("ADVANCE 5000 for Ada", w), null);
  assert.equal(parseMessage("ADVANCE 5,000 for Ada Okon", w).amount, 500000);
  assert.equal(parseMessage("WORK 1.5 for Ada Okon", w).units, 1.5);
  assert.equal(parseMessage("PAYMENT 300 for Ada Okon", w).method, "cash");
  assert.equal(parseMessage("SEND ALL for Ada", w), null);
  assert.equal(parseMessage("ADVANCE 0 for Ada Okon", w), null);
});
test("passwords use fresh salted hashes and reject incorrect inputs", async () => {
  const a = await hashPassword("a long password"),
    b = await hashPassword("a long password");
  assert.notEqual(a, b);
  assert.ok(await checkPassword("a long password", a));
  assert.equal(await checkPassword("wrong", a), false);
});

test("WhatsApp work dates use Lagos midnight regardless of the server timezone", () => {
  const { businessDate } = require("../src/domain");
  assert.equal(businessDate(new Date("2026-10-08T22:59:59Z")), "2026-10-08");
  assert.equal(businessDate(new Date("2026-10-08T23:00:00Z")), "2026-10-09");
});
