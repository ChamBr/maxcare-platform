
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCheckRole } from "./use-check-role";

export const useSessionState = () => {
  const [session, setSession] = useState<any>(null);
  const { checkUserRole, clearRoleState, isStaff, userRole } = useCheckRole();

  const clearSessionState = () => {
    clearRoleState();
    setSession(null);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkUserRole(session.user.id);
      } else {
        clearSessionState();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        checkUserRole(session.user.id);
      } else {
        clearSessionState();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    session,
    isStaff,
    userRole,
    clearSessionState
  };
};
