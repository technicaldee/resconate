import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const frontend = path.join(root, "frontend"),
  standalone = path.join(frontend, ".next/standalone/frontend");
if (!fs.existsSync(path.join(standalone, "server.js")))
  throw new Error("Run npm run build before starting production");
fs.cpSync(path.join(frontend, "public"), path.join(standalone, "public"), {
  recursive: true,
});
fs.cpSync(
  path.join(frontend, ".next/static"),
  path.join(standalone, ".next/static"),
  { recursive: true },
);
const child = spawn(process.execPath, [path.join(standalone, "server.js")], {
  stdio: "inherit",
  env: {
    ...process.env,
    NODE_ENV: "production",
    HOSTNAME: process.env.WEB_HOST || "127.0.0.1",
  },
});
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => child.kill(signal));
child.on("exit", (code) => {
  process.exitCode = code || 0;
});
