const config = require("./config");
async function paystack(path, body) {
  if (!config.paystackSecret) {
    const e = new Error(
      "Online payments are not configured. You can still keep payment records.",
    );
    e.status = 503;
    throw e;
  }
  const response = await fetch(`https://api.paystack.co${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${config.paystackSecret}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(20000),
  });
  const data = await response.json();
  if (!response.ok || !data.status) {
    const e = new Error(
      data.message || "Payment provider could not complete this request",
    );
    e.status = 502;
    throw e;
  }
  return data.data;
}
async function sendWhatsApp(phone, text) {
  if (!config.whatsappToken || !config.whatsappPhone)
    throw new Error("WhatsApp is not configured");
  const r = await fetch(
    `https://graph.facebook.com/${config.graphVersion}/${config.whatsappPhone}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.whatsappToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: { body: text },
      }),
      signal: AbortSignal.timeout(20000),
    },
  );
  if (!r.ok) throw new Error("WhatsApp delivery failed");
}
let transporter;
async function sendEmail(to, subject, text) {
  if (!process.env.SMTP_HOST) throw new Error("Email is not configured");
  if (!transporter)
    transporter = require("nodemailer").createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        : undefined,
      connectionTimeout: 10000,
    });
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
  });
}
module.exports = { paystack, sendWhatsApp, sendEmail };
