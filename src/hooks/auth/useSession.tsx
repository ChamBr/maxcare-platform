
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Cookies from "js-cookie";

const SESSION_COOKIE_NAME = "maxcare_session";
const SESSION_EXPIRY_HOURS = 1;

export const useSession = () => {
  const [session, setSession] = useState<any>(null);

  const saveSessionToCookie = (currentSession: any) => {
    if (!currentSession) {
      Cookies.remove(SESSION_COOKIE_NAME);
      return;
    }

    Cookies.set(SESSION_COOKIE_NAME, JSON.stringify(currentSession), {
      expires: SESSION_EXPIRY_HOURS / 24,
      secure: true,
      sameSite: 'strict'
    });
  };

  const getSessionFromCookie = () => {
    const sessionCookie = Cookies.get(SESSION_COOKIE_NAME);
    return sessionCookie ? JSON.parse(sessionCookie) : null;
  };

  return {
    session,
    setSession,
    saveSessionToCookie,
    getSessionFromCookie
  };
};
