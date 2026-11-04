import { useContext } from "react";
import { CurrentUserContext } from "./currentUserContext.js";

function useCurrentUserId() {
  const userId = useContext(CurrentUserContext);
  if (!userId) {
    throw new Error("useCurrentUserId must be used within CurrentUserProvider.");
  }

  return userId;
}

export default useCurrentUserId;
