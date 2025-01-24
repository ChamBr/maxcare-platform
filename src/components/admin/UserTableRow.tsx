import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserRoleSelect } from "./UserRoleSelect";
import { User, UserRole } from "./UsersTable";

interface UserTableRowProps {
  user: User;
  hasPermission: boolean;
  noPermissionReason: string;
  onRoleChange: (userId: string, role: UserRole) => void;
}

export const UserTableRow = ({
  user,
  hasPermission,
  noPermissionReason,
  onRoleChange,
}: UserTableRowProps) => {
  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case "dev":
        return "purple";
      case "admin":
        return "destructive";
      case "user":
        return "secondary";
      case "customer":
        return "blue";
      default:
        return "default";
    }
  };

  return (
    <TableRow>
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
                <p>{noPermissionReason}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </TableCell>
    </TableRow>
  );
};