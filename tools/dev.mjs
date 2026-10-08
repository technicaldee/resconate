import { spawn } from "node:child_process";
try {
  process.loadEnvFile(".env");
} catch {}
const production = process.argv.includes("--production");
if (production) process.env.NODE_ENV = "production";
let stopping = false;
const children = ["backend", "frontend"].map((workspace) =>
  spawn(
    "npm",
    ["run", production ? "start" : "dev", "--workspace", workspace],
    { stdio: "inherit", detached: process.platform !== "win32" },
  ),
);
function stop(signal = "SIGTERM") {
  if (stopping) return;
  stopping = true;
  for (const c of children)
    try {
      process.platform === "win32"
        ? c.kill(signal)
        : process.kill(-c.pid, signal);
    } catch {}
}
for (const c of children) {
  c.on("error", () => {
    process.exitCode = 1;
    stop();
  });
  c.on("exit", (code) => {
    if (!stopping) {
      process.exitCode = code || 1;
      stop();
    }
  });
}
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => stop(signal));
