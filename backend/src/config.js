const path = require("node:path");
require("dotenv").config({
  path: path.join(__dirname, "../../.env"),
  quiet: true,
});
const production = process.env.NODE_ENV === "production";
const required = ["DATABASE_URL", "APP_URL"];
if (production)
  for (const key of required)
    if (!process.env[key]) throw new Error(`${key} is required in production`);
module.exports = {
  production,
  port: Number(process.env.API_PORT || 3001),
  appUrl: process.env.APP_URL || "http://localhost:3000",
  databaseUrl:
    process.env.DATABASE_URL ||
    "postgresql://resconate:resconate_local@127.0.0.1:55439/resconate",
  dbSsl: process.env.DATABASE_SSL === "true",
  paystackSecret: process.env.PAYSTACK_SECRET_KEY,
  whatsappToken: process.env.WHATSAPP_ACCESS_TOKEN,
  whatsappPhone: process.env.WHATSAPP_PHONE_NUMBER_ID,
  whatsappAppSecret: process.env.WHATSAPP_APP_SECRET,
  whatsappVerify: process.env.WHATSAPP_VERIFY_TOKEN,
  graphVersion: process.env.WHATSAPP_API_VERSION || "v23.0",
  supportEmail: process.env.SUPPORT_EMAIL,
  cronSecret: process.env.CRON_SECRET,
};
