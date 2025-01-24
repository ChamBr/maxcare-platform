import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UsersTable, type User } from "@/components/admin/UsersTable";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useAuthState } from "@/hooks/useAuthState";
import { UsersFilter } from "@/components/admin/UsersFilter";
import { useState } from "react";

const Users = () => {
  const { userRole, session } = useAuthState();
  const [nameFilter, setNameFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("id, email, full_name");

      if (usersError) {
        toast.error("Erro ao carregar usuários");
        throw usersError;
      }

      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) {
        toast.error("Erro ao carregar roles dos usuários");
        throw rolesError;
      }

      const usersWithRoles = usersData.map((user) => {
        const userRole = rolesData.find(role => role.user_id === user.id);
        return {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: userRole?.role || "customer",
        };
      });

      return usersWithRoles as User[];
    },
  });

  const handleRoleChange = async (userId: string, newRole: User["role"]) => {
    try {
      // Buscar a role atual do usuário
      const { data: currentRoleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .single();

      const oldRole = currentRoleData?.role || "customer";

      // Atualizar a role
      const { error } = await supabase
        .from("user_roles")
        .upsert({ 
          user_id: userId, 
          role: newRole 
        }, { 
          onConflict: "user_id" 
        });

      if (error) throw error;

      // Registrar a mudança no log
      const { error: logError } = await supabase
        .from("role_change_logs")
        .insert({
          user_id: userId,
          changed_by_id: session?.user.id,
          old_role: oldRole,
          new_role: newRole,
        });

      if (logError) throw logError;

      toast.success("Papel do usuário atualizado com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar papel do usuário:", error);
      toast.error("Erro ao atualizar papel do usuário");
    }
  };

  const filteredUsers = users?.filter(user => {
    const matchesName = user.full_name?.toLowerCase().includes(nameFilter.toLowerCase()) ||
                       user.email.toLowerCase().includes(nameFilter.toLowerCase());
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    return matchesName && matchesRole;
  });

  if (!["dev", "admin"].includes(userRole)) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold text-red-600">
          Acesso Negado
        </h1>
        <p className="mt-2 text-gray-600">
          Você não tem permissão para acessar esta página.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Usuários</h1>
      </div>
      
      <UsersFilter
        nameFilter={nameFilter}
        roleFilter={roleFilter}
        onNameFilterChange={setNameFilter}
        onRoleFilterChange={setRoleFilter}
      />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <UsersTable users={filteredUsers || []} onRoleChange={handleRoleChange} />
      )}
    </div>
  );
};

export default Users;