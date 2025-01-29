import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, UserRole } from "@/components/admin/UsersTable";

export const useUsersData = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const checkAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login");
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!roles || roles.role !== "dev") {
      toast({
        title: "Acesso Negado",
        description: "Apenas desenvolvedores podem acessar esta página.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }
  };

  const fetchUsers = async () => {
    const { data: usersData, error: usersError } = await supabase
      .from("users")
      .select("id, email, full_name");

    if (usersError) {
      toast({
        title: "Erro",
        description: "Erro ao carregar usuários.",
        variant: "destructive",
      });
      return;
    }

    const { data: rolesData, error: rolesError } = await supabase
      .from("user_roles")
      .select("user_id, role");

    if (rolesError) {
      toast({
        title: "Erro",
        description: "Erro ao carregar roles.",
        variant: "destructive",
      });
      return;
    }

    const usersWithRoles = usersData.map((user) => ({
      ...user,
      role: (rolesData.find((role) => role.user_id === user.id)?.role || "customer") as UserRole,
    }));

    setUsers(usersWithRoles);
    setIsLoading(false);
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    const { error } = await supabase
      .from("user_roles")
      .upsert({ 
        user_id: userId, 
        role: newRole 
      }, { 
        onConflict: "user_id" 
      });

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar role do usuário.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: "Role do usuário atualizado com sucesso.",
    });

    fetchUsers();
  };

  useEffect(() => {
    checkAccess();
    fetchUsers();
  }, []);

  return { users, isLoading, handleRoleChange };
};