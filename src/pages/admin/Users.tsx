import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UsersTable, type User } from "@/components/admin/UsersTable";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useAuthState } from "@/hooks/useAuthState";

const Users = () => {
  const { userRole } = useAuthState();

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      // Primeiro, buscamos os usuários
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("id, email, full_name");

      if (usersError) {
        toast.error("Erro ao carregar usuários");
        throw usersError;
      }

      // Depois, buscamos os roles separadamente
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) {
        toast.error("Erro ao carregar roles dos usuários");
        throw rolesError;
      }

      // Combinamos os dados
      const usersWithRoles = usersData.map((user) => {
        const userRole = rolesData.find(role => role.user_id === user.id);
        return {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: userRole?.role || "customer",
        };
      });

      console.log("Usuários carregados:", usersWithRoles);
      return usersWithRoles as User[];
    },
  });

  const handleRoleChange = async (userId: string, role: User["role"]) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .upsert({ 
          user_id: userId, 
          role 
        }, { 
          onConflict: "user_id" 
        });

      if (error) throw error;

      toast.success("Papel do usuário atualizado com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar papel do usuário:", error);
      toast.error("Erro ao atualizar papel do usuário");
    }
  };

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
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <UsersTable users={users || []} onRoleChange={handleRoleChange} />
      )}
    </div>
  );
};

export default Users;