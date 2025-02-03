
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useCheckRole = () => {
  const [isStaff, setIsStaff] = useState(false);
  const [userRole, setUserRole] = useState<string>("customer");

  const checkUserRole = async (userId: string) => {
    try {
      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .single();

      if (error) throw error;

      if (roles) {
        setUserRole(roles.role);
        setIsStaff(["dev", "admin"].includes(roles.role));
      }
    } catch (error) {
      console.error("Erro ao verificar papel do usuário:", error);
    }
  };

  const clearRoleState = () => {
    setIsStaff(false);
    setUserRole("customer");
  };

  return {
    isStaff,
    userRole,
    checkUserRole,
    clearRoleState,
  };
};
