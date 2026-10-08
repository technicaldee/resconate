const crypto = require("node:crypto");
const { promisify } = require("node:util");
const scrypt = promisify(crypto.scrypt);
const plans = {
  basic: { name: "Basic", price: 0, limit: 2 },
  small: { name: "Small Team", price: 350000, limit: 5 },
  growth: { name: "Growing Team", price: 750000, limit: 15 },
  assisted: { name: "Assisted", price: 2500000, limit: 15 },
};
async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = await scrypt(password, salt, 64);
  return `${salt}:${hash.toString("hex")}`;
}
async function checkPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const actual = await scrypt(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return (
    actual.length === expected.length &&
    crypto.timingSafeEqual(actual, expected)
  );
}
const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");
function calculatePay(workers, entries) {
  return workers.map((w) => {
    const e = entries.filter((e) => e.worker_id === w.id && !e.voided_at);
    const units = e
      .filter((e) => e.kind === "work")
      .reduce((s, e) => s + Number(e.units), 0);
    const gross = ["daily", "per_job"].includes(w.pay_type)
      ? Math.round(w.rate * units)
      : w.rate;
    const advance = e
      .filter((e) => e.kind === "advance")
      .reduce((s, e) => s + e.amount, 0);
    const bonus = e
      .filter((e) => e.kind === "bonus")
      .reduce((s, e) => s + e.amount, 0);
    if (!Number.isSafeInteger(gross) || gross + bonus > 2147483647) {
      const e = new Error(
        "This pay amount exceeds the supported limit. Review the rate and units.",
      );
      e.status = 400;
      throw e;
    }
    return {
      worker_id: w.id,
      name: w.name,
      role: w.role,
      pay_type: w.pay_type,
      rate: w.rate,
      units,
      gross,
      advance,
      bonus,
      net: Math.max(0, gross + bonus - advance),
      carried_advance: Math.max(0, advance - gross - bonus),
    };
  });
}
function businessDate(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
function parseMessage(text, workers) {
  const m = text
    .trim()
    .match(
      /^(?:record\s+)?(advance|bonus|payment|work)\s+(?:₦|NGN\s*)?([\d,]+(?:\.\d{1,2})?)\s+(?:for\s+)?(.+)$/i,
    );
  if (!m) return null;
  const kind = m[1].toLowerCase(),
    value = Number(m[2].replaceAll(",", ""));
  if (!Number.isFinite(value) || value <= 0 || value > 100000000) return null;
  const name = m[3].trim().toLowerCase();
  const matches = workers.filter(
    (w) =>
      w.name.toLowerCase() === name ||
      w.name.toLowerCase().split(" ")[0] === name,
  );
  if (matches.length !== 1) return null;
  return {
    worker_id: matches[0].id,
    worker_name: matches[0].name,
    kind,
    units: kind === "work" ? value : null,
    amount: kind === "work" ? 0 : Math.round(value * 100),
    method: kind === "payment" ? "cash" : null,
    note: "Recorded through WhatsApp",
    entry_date: businessDate(),
  };
}
module.exports = {
  plans,
  hashPassword,
  checkPassword,
  hashToken,
  calculatePay,
  parseMessage,
  businessDate,
};
