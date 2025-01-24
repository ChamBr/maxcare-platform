import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UsersTable, type User } from "@/components/admin/UsersTable";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const Users = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select(`
          id,
          email,
          full_name,
          user_roles (
            role
          )
        `);

      if (error) {
        toast.error("Erro ao carregar usuários");
        throw error;
      }

      return data.map((user) => ({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.user_roles?.[0]?.role || "customer",
      })) as User[];
    },
  });

  const handleRoleChange = async (userId: string, role: User["role"]) => {
    const { error } = await supabase
      .from("user_roles")
      .update({ role })
      .eq("user_id", userId);

    if (error) {
      toast.error("Erro ao atualizar papel do usuário");
      return;
    }

    toast.success("Papel do usuário atualizado com sucesso");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Usuários</h1>
      
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