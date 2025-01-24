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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    // Não pode alterar o próprio role
    if (session?.user.id === targetUserId) return false;

    // Dev pode alterar qualquer role
    if (userRole === "dev") return true;

    // Admin só pode alterar roles de user e customer
    if (userRole === "admin") {
      return targetRole !== "dev" && targetRole !== "admin";
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
          {users.map((user) => {
            const hasPermission = canChangeRole(user.id, user.role);
            
            return (
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
                  {hasPermission ? (
                    <UserRoleSelect
                      defaultValue={user.role}
                      onRoleChange={(role) => onRoleChange(user.id, role)}
                    />
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-sm text-gray-500 cursor-help">
                            Sem permissão
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {getNoPermissionReason(
                              userRole,
                              user.id,
                              user.role,
                              session?.user.id
                            )}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};