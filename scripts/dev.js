import { spawn } from "node:child_process";
import process from "node:process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const children = new Set();
let shuttingDown = false;

function stopChildren(exitCode = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  process.exitCode = exitCode;
  for (const child of children) {
    child.kill();
  }
}

function startChild(name, scriptPath, args = []) {
  const child = spawn(process.execPath, [scriptPath, ...args], {
    cwd: projectRoot,
    stdio: "inherit",
  });
  children.add(child);
  child.on("error", (error) => {
    console.error(`Couldn’t start ${name}: ${error.message}`);
    stopChildren(1);
  });
  child.on("exit", (code, signal) => {
    children.delete(child);
    if (!shuttingDown) {
      console.error(
        `${name} stopped unexpectedly${signal ? ` (${signal})` : ` (exit code ${code})`}.`,
      );
      stopChildren(code || 1);
    }
  });
  return child;
}

async function startDevelopmentServers() {
  if (!shuttingDown) {
    startChild(
      "Next.js",
      path.join(projectRoot, "node_modules", "next", "dist", "bin", "next"),
      ["dev"],
    );
  }
}

process.on("SIGINT", () => stopChildren());
process.on("SIGTERM", () => stopChildren());

startDevelopmentServers().catch((error) => {
  console.error(error.message);
  stopChildren(1);
});
