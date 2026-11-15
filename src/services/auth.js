const ACCOUNTS_STORAGE_KEY = "forma.accounts";
const PASSWORD_HASH_ITERATIONS = 310000;

function getAccounts() {
  const savedAccounts = window.localStorage.getItem(ACCOUNTS_STORAGE_KEY);
  if (!savedAccounts) {
    return [];
  }

  let accounts;
  try {
    accounts = JSON.parse(savedAccounts);
  } catch (error) {
    throw new Error(
      "Saved account data is invalid. Clear this app’s local storage and try again.",
      { cause: error },
    );
  }

  if (
    !Array.isArray(accounts) ||
    accounts.some(
      (account) =>
        !account ||
        typeof account.userId !== "string" ||
        typeof account.email !== "string" ||
        typeof account.displayName !== "string" ||
        typeof account.passwordSalt !== "string" ||
        typeof account.passwordHash !== "string",
    )
  ) {
    throw new Error("Saved account data is invalid. Clear this app’s local storage and try again.");
  }

  return accounts;
}

function saveAccounts(accounts) {
  try {
    window.localStorage.setItem(
      ACCOUNTS_STORAGE_KEY,
      JSON.stringify(accounts),
    );
  } catch (error) {
    throw new Error(`Couldn’t save account data: ${error.message}`, {
      cause: error,
    });
  }
}

function toHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

function fromHex(value) {
  return Uint8Array.from(
    value.match(/.{2}/g) ?? [],
    (byte) => Number.parseInt(byte, 16),
  );
}

async function hashPassword(password, salt) {
  if (!window.crypto?.subtle) {
    throw new Error("Secure password hashing is unavailable in this browser.");
  }

  const key = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const hash = await window.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: fromHex(salt),
      iterations: PASSWORD_HASH_ITERATIONS,
      hash: "SHA-256",
    },
    key,
    256,
  );

  return toHex(new Uint8Array(hash));
}

function equalHash(left, right) {
  if (left.length !== right.length) {
    return false;
  }

  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

function toPublicAccount(account) {
  return {
    userId: account.userId,
    email: account.email,
    displayName: account.displayName,
  };
}

export async function registerAccount({ displayName, email, password }) {
  const accounts = getAccounts();
  const normalizedEmail = email.trim().toLowerCase();
  if (accounts.some((account) => account.email === normalizedEmail)) {
    throw new Error("An account with this email already exists.");
  }

  const salt = toHex(window.crypto.getRandomValues(new Uint8Array(16)));
  const account = {
    userId: `user-${window.crypto.randomUUID()}`,
    displayName: displayName.trim(),
    email: normalizedEmail,
    passwordSalt: salt,
    passwordHash: await hashPassword(password, salt),
  };

  saveAccounts([...accounts, account]);
  return toPublicAccount(account);
}

export async function authenticateAccount(email, password) {
  const account = getAccounts().find(
    (candidate) => candidate.email === email.trim().toLowerCase(),
  );

  if (
    !account ||
    !equalHash(account.passwordHash, await hashPassword(password, account.passwordSalt))
  ) {
    throw new Error("Email or password is incorrect.");
  }

  return toPublicAccount(account);
}

export async function updateAccount(userId, updates) {
  const accounts = getAccounts();
  const accountIndex = accounts.findIndex(
    (candidate) => candidate.userId === userId,
  );
  if (accountIndex < 0) {
    throw new Error("The account could not be found.");
  }

  const account = accounts[accountIndex];
  const currentPasswordHash = await hashPassword(
    updates.currentPassword,
    account.passwordSalt,
  );
  if (!equalHash(account.passwordHash, currentPasswordHash)) {
    throw new Error("Current password is incorrect.");
  }

  const normalizedEmail = updates.email.trim().toLowerCase();
  if (
    accounts.some(
      (candidate) =>
        candidate.userId !== userId && candidate.email === normalizedEmail,
    )
  ) {
    throw new Error("An account with this email already exists.");
  }

  const updatedAccount = {
    ...account,
    displayName: updates.displayName.trim(),
    email: normalizedEmail,
  };

  if (updates.newPassword) {
    updatedAccount.passwordSalt = toHex(
      window.crypto.getRandomValues(new Uint8Array(16)),
    );
    updatedAccount.passwordHash = await hashPassword(
      updates.newPassword,
      updatedAccount.passwordSalt,
    );
  }

  accounts[accountIndex] = updatedAccount;
  saveAccounts(accounts);
  return toPublicAccount(updatedAccount);
}
