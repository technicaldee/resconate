const { Pool, types } = require("pg");
types.setTypeParser(1082, (value) => value);
types.setTypeParser(20, (value) => {
  const n = Number(value);
  if (!Number.isSafeInteger(n))
    throw new Error("Database integer exceeds the safe calculation limit");
  return n;
});
const config = require("./config");
const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: config.dbSsl ? { rejectUnauthorized: true } : false,
  max: 10,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
});
pool.on("error", () => console.error("Database connection error"));
async function transaction(fn) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
module.exports = { pool, transaction };
