import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthState } from "@/hooks/useAuthState";
import { UserTableRow } from "./UserTableRow";

export type UserRole = "dev" | "admin" | "user" | "customer";

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
}

interface UsersTableProps {
  users: User[];
  onRoleChange: (userId: string, role: UserRole) => void;
}

const getNoPermissionReason = (
  currentUserRole: string,
  targetUserId: string,
  targetRole: UserRole,
  sessionUserId: string | undefined
) => {
  if (sessionUserId === targetUserId) {
    return "Você não pode alterar seu próprio nível de acesso";
  }

  if (currentUserRole === "admin") {
    if (targetRole === "dev") {
      return "Administradores não podem modificar desenvolvedores";
    }
    if (targetRole === "admin") {
      return "Administradores não podem modificar outros administradores";
    }
  }

  return "Você não tem permissão para alterar níveis de acesso";
};

export const UsersTable = ({ users, onRoleChange }: UsersTableProps) => {
  const { session, userRole } = useAuthState();

  const canChangeRole = (targetUserId: string, targetRole: UserRole): boolean => {
    if (session?.user.id === targetUserId) return false;
    if (userRole === "dev") return true;
    if (userRole === "admin") {
      return targetRole !== "dev" && targetRole !== "admin";
    }
    return false;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Nome</TableHead>
            <TableHead className="w-[250px]">Email</TableHead>
            <TableHead className="w-[120px]">Role</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              hasPermission={canChangeRole(user.id, user.role)}
              noPermissionReason={getNoPermissionReason(
                userRole,
                user.id,
                user.role,
                session?.user.id
              )}
              onRoleChange={onRoleChange}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};