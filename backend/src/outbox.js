const crypto = require("node:crypto");
const { transaction } = require("./db");
const { sendEmail, sendWhatsApp } = require("./providers");
async function enqueue(db, channel, recipient, payload) {
  if (recipient)
    await db.query(
      "INSERT INTO outbox(id,channel,recipient,payload)VALUES($1,$2,$3,$4)",
      [crypto.randomUUID(), channel, recipient, payload],
    );
}
let running = false;
async function processOutbox() {
  if (running) return;
  running = true;
  try {
    await transaction(async (db) => {
      const { rows } = await db.query(
        "SELECT * FROM outbox WHERE status='pending' AND next_attempt_at<=now() AND attempts<6 ORDER BY created_at LIMIT 10 FOR UPDATE SKIP LOCKED",
      );
      for (const job of rows) {
        try {
          if (job.channel === "email")
            await sendEmail(
              job.recipient,
              job.payload.subject,
              job.payload.text,
            );
          else await sendWhatsApp(job.recipient, job.payload.text);
          await db.query(
            "UPDATE outbox SET status='sent',attempts=attempts+1,last_error=NULL WHERE id=$1",
            [job.id],
          );
        } catch (e) {
          await db.query(
            "UPDATE outbox SET attempts=attempts+1,next_attempt_at=now()+interval '5 minutes'*(attempts+1),last_error=$2,status=CASE WHEN attempts>=5 THEN 'failed' ELSE 'pending' END WHERE id=$1",
            [job.id, e.message],
          );
        }
      }
    });
  } finally {
    running = false;
  }
}
module.exports = { enqueue, processOutbox };
