import { spawn } from "node:child_process";
import process from "node:process";
import { setTimeout as delay } from "node:timers/promises";
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

async function isApiAvailable() {
  try {
    const response = await fetch("http://127.0.0.1:3001/tasks", {
      signal: AbortSignal.timeout(500),
    });
    return response.ok && Array.isArray(await response.json());
  } catch {
    return false;
  }
}

async function startDevelopmentServers() {
  if (!(await isApiAvailable())) {
    const apiServer = startChild(
      "API server",
      path.join(projectRoot, "node_modules", "json-server", "lib", "bin.js"),
      ["db.json", "--port", "3001"],
    );
    const startupDeadline = Date.now() + 15000;

    while (!shuttingDown && Date.now() < startupDeadline) {
      if (apiServer.exitCode !== null || apiServer.signalCode !== null) {
        throw new Error(
          "The API server stopped before it became available on port 3001.",
        );
      }
      if (await isApiAvailable()) {
        break;
      }
      await delay(250);
    }

    if (shuttingDown) {
      return;
    }
    if (!(await isApiAvailable())) {
      throw new Error("The API server did not become available on port 3001.");
    }
  }

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
