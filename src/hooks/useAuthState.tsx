
import { useSessionState } from "./use-session-state";

export const useAuthState = () => {
  const { isStaff, session, userRole, clearSessionState } = useSessionState();

  return {
    isStaff,
    session,
    userRole,
    clearUserState: clearSessionState
  };
};
