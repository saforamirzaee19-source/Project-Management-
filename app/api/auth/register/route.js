import crypto from "node:crypto";
import { Buffer } from "node:buffer";
import { json, readDatabase, writeDatabase } from "../../_lib/db.js";

const ITERATIONS = 310000;

function hashPassword(password, salt) {
  return crypto
    .pbkdf2Sync(password, Buffer.from(salt, "hex"), ITERATIONS, 32, "sha256")
    .toString("hex");
}

export async function POST(request) {
  const body = await request.json();
  const displayName =
    typeof body.displayName === "string" ? body.displayName.trim() : "";
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password =
    typeof body.password === "string" ? body.password : "";

  if (!displayName || !email || password.length < 8) {
    return json({ error: "Invalid account details." }, 400);
  }

  const database = await readDatabase();
  database.accounts ??= [];
  if (database.accounts.some((account) => account.email === email)) {
    return json({ error: "An account with this email already exists." }, 409);
  }

  const passwordSalt = crypto.randomBytes(16).toString("hex");
  const account = {
    userId: `user-${crypto.randomUUID()}`,
    displayName,
    email,
    passwordSalt,
    passwordHash: hashPassword(password, passwordSalt),
  };

  database.accounts.push(account);
  await writeDatabase(database);
  return json(
    {
      userId: account.userId,
      displayName: account.displayName,
      email: account.email,
    },
    201,
  );
}
