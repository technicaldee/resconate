const fs = require("node:fs");
const path = require("node:path");
const { pool, transaction } = require("./db");
async function migrate() {
  await transaction(async (db) => {
    await db.query("SELECT pg_advisory_xact_lock(802341)");
    await db.query(
      "CREATE TABLE IF NOT EXISTS workspace_migrations(name text PRIMARY KEY,applied_at timestamptz NOT NULL DEFAULT now())",
    );
    for (const name of fs
      .readdirSync(path.join(__dirname, "../migrations"))
      .filter((n) => n.endsWith(".sql"))
      .sort()) {
      const { rowCount } = await db.query(
        "SELECT 1 FROM workspace_migrations WHERE name=$1",
        [name],
      );
      if (!rowCount) {
        await db.query(
          fs.readFileSync(path.join(__dirname, "../migrations", name), "utf8"),
        );
        await db.query("INSERT INTO workspace_migrations(name)VALUES($1)", [
          name,
        ]);
        console.log("Applied", name);
      }
    }
  });
}
if (require.main === module)
  migrate()
    .then(() => pool.end())
    .catch((e) => {
      console.error(e.message);
      pool.end();
      process.exitCode = 1;
    });
module.exports = { migrate };
