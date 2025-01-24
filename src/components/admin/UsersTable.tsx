import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserRoleSelect } from "./UserRoleSelect";
import { useAuthState } from "@/hooks/useAuthState";

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

const getRoleBadgeVariant = (role: UserRole) => {
  switch (role) {
    case "dev":
      return "purple";
    case "admin":
      return "red";
    case "user":
      return "blue";
    default:
      return "default";
  }
};

export const UsersTable = ({ users, onRoleChange }: UsersTableProps) => {
  const { session, userRole } = useAuthState();

  const canChangeRole = (targetUserId: string, targetRole: UserRole) => {
    // Não pode alterar o próprio role
    if (session?.user.id === targetUserId) return false;

    // Dev pode alterar qualquer role
    if (userRole === 'dev') return true;

    // Admin só pode alterar roles abaixo do seu nível
    if (userRole === 'admin') {
      // Admin não pode alterar roles de dev ou outros admin
      if (targetRole === 'dev' || targetRole === 'admin') return false;
      return true;
    }

    // Outros usuários não podem alterar roles
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
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.full_name || "N/A"}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {canChangeRole(user.id, user.role) ? (
                  <UserRoleSelect
                    defaultValue={user.role}
                    onRoleChange={(role) => onRoleChange(user.id, role)}
                  />
                ) : (
                  <span className="text-sm text-gray-500">Sem permissão</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};