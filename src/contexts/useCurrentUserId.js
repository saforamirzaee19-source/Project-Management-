import useAuth from "./useAuth.js";

function useCurrentUserId() {
  const { userId } = useAuth();
  if (!userId) {
    throw new Error("A user ID is available only while signed in.");
  }

  return userId;
}

export default useCurrentUserId;
