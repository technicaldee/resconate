const config = require("./src/config");
const { pool } = require("./src/db");
const { migrate } = require("./src/migrate");
const { app, reconcileTransfers } = require("./src/app");
const { processOutbox } = require("./src/outbox");
async function start() {
  await migrate();
  const server = app.listen(
    config.port,
    process.env.API_HOST || "127.0.0.1",
    () => console.log(`Resconate API: http://127.0.0.1:${config.port}`),
  );
  const timer = setInterval(() => {
    processOutbox().catch(() => console.error("Message queue unavailable"));
    reconcileTransfers().catch(() =>
      console.error("Transfer reconciliation unavailable"),
    );
  }, 30000);
  timer.unref();
  for (const s of ["SIGTERM", "SIGINT"])
    process.on(s, () => {
      clearInterval(timer);
      server.close(() => pool.end());
    });
}
if (require.main === module)
  start().catch((e) => {
    console.error("API startup failed:", e.message);
    process.exitCode = 1;
    pool.end();
  });
module.exports = { app };
