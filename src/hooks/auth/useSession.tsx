
import { useState } from "react";
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
      Cookies.remove(SESSION_COOKIE_NAME);
      return;
    }

    try {
      const sessionData = JSON.stringify(currentSession);
      Cookies.set(SESSION_COOKIE_NAME, sessionData, {
        expires: SESSION_EXPIRY_HOURS / 24,
        secure: true,
        sameSite: 'lax'
      });
      console.log("Cookie de sessão salvo com sucesso");
    } catch (error) {
      console.error("Erro ao salvar sessão no cookie:", error);
    }
  };

  const getSessionFromCookie = () => {
    try {
      const sessionCookie = Cookies.get(SESSION_COOKIE_NAME);
      console.log("Lendo cookie de sessão:", sessionCookie ? "Encontrado" : "Não encontrado");
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
