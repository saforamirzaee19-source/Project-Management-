import crypto from "node:crypto";
import { Buffer } from "node:buffer";
import { auth } from "../../../../auth.js";
import { json, readDatabase, writeDatabase } from "../../_lib/db.js";

const ITERATIONS = 310000;

function hashPassword(password, salt) {
  return crypto
    .pbkdf2Sync(password, Buffer.from(salt, "hex"), ITERATIONS, 32, "sha256")
    .toString("hex");
}

function passwordsMatch(left, right) {
  const leftBuffer = Buffer.from(left, "hex");
  const rightBuffer = Buffer.from(right, "hex");
  return (
    leftBuffer.length === rightBuffer.length &&
    crypto.timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export async function PATCH(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return json({ error: "Authentication required." }, 401);
  }

  const body = await request.json();
  const displayName =
    typeof body.displayName === "string" ? body.displayName.trim() : "";
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const currentPassword =
    typeof body.currentPassword === "string" ? body.currentPassword : "";
  const newPassword =
    typeof body.newPassword === "string" ? body.newPassword : "";

  if (!displayName || !email || !currentPassword) {
    return json({ error: "Invalid account details." }, 400);
  }

  const database = await readDatabase();
  const index = database.accounts?.findIndex(
    (account) => account.userId === session.user.id,
  ) ?? -1;
  if (index < 0) {
    return json({ error: "The account could not be found." }, 404);
  }

  const account = database.accounts[index];
  if (
    !passwordsMatch(
      account.passwordHash,
      hashPassword(currentPassword, account.passwordSalt),
    )
  ) {
    return json({ error: "Current password is incorrect." }, 401);
  }
  if (
    database.accounts.some(
      (candidate) =>
        candidate.userId !== session.user.id && candidate.email === email,
    )
  ) {
    return json({ error: "An account with this email already exists." }, 409);
  }

  const updated = {
    ...account,
    displayName,
    email,
  };
  if (newPassword) {
    updated.passwordSalt = crypto.randomBytes(16).toString("hex");
    updated.passwordHash = hashPassword(newPassword, updated.passwordSalt);
  }

  database.accounts[index] = updated;
  await writeDatabase(database);
  return json({
    userId: updated.userId,
    displayName: updated.displayName,
    email: updated.email,
  });
}
