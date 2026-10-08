import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
try {
  process.loadEnvFile(path.join(root, ".env"));
} catch (e) {
  if (e.code !== "ENOENT") throw e;
}
process.env.NODE_ENV = "production";
const child = spawn("npm", ["run", "build", "--workspace", "frontend"], {
  cwd: root,
  stdio: "inherit",
  env: process.env,
});
child.on("error", (e) => {
  console.error(e.message);
  process.exitCode = 1;
});
child.on("exit", (code) => {
  process.exitCode = code || 0;
});
