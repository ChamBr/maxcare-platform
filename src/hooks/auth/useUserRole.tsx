
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useUserRole = () => {
  const [isStaff, setIsStaff] = useState(false);
  const [userRole, setUserRole] = useState<string>("customer");

  const checkUserRole = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Erro ao verificar papel do usuário:", error);
        return;
      }

      if (data) {
        setUserRole(data.role);
        setIsStaff(["dev", "admin"].includes(data.role));
      }
    } catch (error) {
      console.error("Erro ao verificar papel do usuário:", error);
    }
  }, []);

  return { isStaff, userRole, checkUserRole };
};
