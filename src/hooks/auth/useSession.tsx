
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const SESSION_COOKIE_NAME = "maxcare_session";
const SESSION_EXPIRY_HOURS = 1;

export const useSession = () => {
  const [session, setSession] = useState<any>(() => {
    try {
      const sessionCookie = Cookies.get(SESSION_COOKIE_NAME);
      return sessionCookie ? JSON.parse(sessionCookie) : null;
    } catch (error) {
      console.error("Erro ao ler sessão inicial do cookie:", error);
      return null;
    }
  });

  const saveSessionToCookie = (currentSession: any) => {
    console.log("Salvando sessão em cookie:", currentSession ? "Presente" : "Nula");
    
    if (!currentSession) {
      console.log("Removendo cookie de sessão");
      Cookies.remove(SESSION_COOKIE_NAME, { path: '/', domain: window.location.hostname });
      return;
    }

    try {
      const sessionData = JSON.stringify(currentSession);
      Cookies.set(SESSION_COOKIE_NAME, sessionData, {
        expires: SESSION_EXPIRY_HOURS / 24,
        path: '/',
        secure: true,
        sameSite: 'strict'
      });
      console.log("Cookie de sessão salvo com sucesso");
    } catch (error) {
      console.error("Erro ao salvar sessão no cookie:", error);
    }
  };

  useEffect(() => {
    if (session) {
      saveSessionToCookie(session);
    }
  }, [session]);

  return {
    session,
    setSession,
    saveSessionToCookie
  };
};
