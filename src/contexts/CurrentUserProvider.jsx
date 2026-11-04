import { useState } from "react";
import { CurrentUserContext } from "./currentUserContext.js";

const USER_ID_STORAGE_KEY = "forma.userId";

function createUserId() {
  const savedUserId = window.localStorage.getItem(USER_ID_STORAGE_KEY);
  if (savedUserId) {
    return savedUserId;
  }

  const userId = `user-${window.crypto.randomUUID()}`;

  window.localStorage.setItem(USER_ID_STORAGE_KEY, userId);
  return userId;
}

function CurrentUserProvider({ children }) {
  const [userId] = useState(createUserId);

  return (
    <CurrentUserContext.Provider value={userId}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export default CurrentUserProvider;
