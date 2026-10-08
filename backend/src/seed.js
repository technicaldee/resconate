const crypto = require("node:crypto");
const config = require("./config");
const { pool, transaction } = require("./db");
const { migrate } = require("./migrate");
const { hashPassword } = require("./domain");
async function seed() {
  if (config.production)
    throw new Error("Demo seeding is disabled in production");
  if (
    !process.env.SEED_EMAIL ||
    !process.env.SEED_PASSWORD ||
    process.env.SEED_PASSWORD.length < 10
  )
    throw new Error(
      "Set SEED_EMAIL and SEED_PASSWORD (at least 10 characters) in .env",
    );
  await migrate();
  const email = process.env.SEED_EMAIL.toLowerCase();
  if (
    (await pool.query("SELECT id FROM users WHERE lower(email)=$1", [email]))
      .rowCount
  ) {
    console.log("Demo account already exists. No records changed.");
    return;
  }
  const hash = await hashPassword(process.env.SEED_PASSWORD);
  await transaction(async (db) => {
    const bid = crypto.randomUUID(),
      uid = crypto.randomUUID();
    await db.query(
      "INSERT INTO businesses(id,name,phone,sector)VALUES($1,$2,$3,$4)",
      [bid, "Ewet Kitchen", "", "food"],
    );
    await db.query(
      "INSERT INTO users(id,business_id,name,email,password_hash)VALUES($1,$2,$3,$4,$5)",
      [uid, bid, "Ada Okon", email, hash],
    );
    const workers = [
      ["Blessing Okon", "Cook", "monthly", 4500000],
      ["Victor Ekong", "Kitchen assistant", "daily", 350000],
      ["Iniobong Udo", "Cashier", "monthly", 4000000],
    ];
    for (const [name, role, pay_type, rate] of workers) {
      const wid = crypto.randomUUID();
      await db.query(
        "INSERT INTO workers(id,business_id,name,role,pay_type,rate)VALUES($1,$2,$3,$4,$5,$6)",
        [wid, bid, name, role, pay_type, rate],
      );
      if (name.startsWith("Blessing"))
        await db.query(
          "INSERT INTO entries(id,business_id,worker_id,kind,amount,entry_date,note,created_by)VALUES($1,$2,$3,'advance',500000,CURRENT_DATE,'Transport',$4)",
          [crypto.randomUUID(), bid, wid, uid],
        );
      if (pay_type === "daily")
        await db.query(
          "INSERT INTO entries(id,business_id,worker_id,kind,units,entry_date,note,created_by)VALUES($1,$2,$3,'work',1,CURRENT_DATE,'Morning shift',$4)",
          [crypto.randomUUID(), bid, wid, uid],
        );
    }
  });
  console.log(
    "Local sample account created. Credentials are in your untracked .env.",
  );
}
seed()
  .then(() => pool.end())
  .catch((e) => {
    console.error(e.message);
    pool.end();
    process.exitCode = 1;
  });
