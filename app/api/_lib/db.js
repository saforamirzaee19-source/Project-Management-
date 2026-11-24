import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../",
);
const databasePath = path.join(root, "db.json");

export async function readDatabase() {
  const contents = await fs.readFile(databasePath, "utf8");
  return JSON.parse(contents);
}

export async function writeDatabase(database) {
  await fs.writeFile(databasePath, `${JSON.stringify(database, null, 2)}\n`, "utf8");
}

export function json(data, status = 200) {
  return Response.json(data, { status });
}
