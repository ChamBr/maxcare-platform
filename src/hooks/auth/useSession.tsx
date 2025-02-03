
import { useState } from "react";
import Cookies from "js-cookie";

const SESSION_COOKIE_NAME = "maxcare_session";
const SESSION_EXPIRY_HOURS = 1;

export const useSession = () => {
  const [session, setSession] = useState<any>(() => {
    const sessionCookie = Cookies.get(SESSION_COOKIE_NAME);
    return sessionCookie ? JSON.parse(sessionCookie) : null;
  });

  const saveSessionToCookie = (currentSession: any) => {
    if (!currentSession) {
      Cookies.remove(SESSION_COOKIE_NAME);
      return;
    }

    try {
      const sessionData = JSON.stringify(currentSession);
      Cookies.set(SESSION_COOKIE_NAME, sessionData, {
        expires: SESSION_EXPIRY_HOURS / 24,
        secure: true,
        sameSite: 'lax' // Mudando para 'lax' para permitir navegação
      });
    } catch (error) {
      console.error("Erro ao salvar sessão no cookie:", error);
    }
  };

  const getSessionFromCookie = () => {
    try {
      const sessionCookie = Cookies.get(SESSION_COOKIE_NAME);
      return sessionCookie ? JSON.parse(sessionCookie) : null;
    } catch (error) {
      console.error("Erro ao ler sessão do cookie:", error);
      return null;
    }
  };

  return {
    session,
    setSession,
    saveSessionToCookie,
    getSessionFromCookie
  };
};
