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
  return (
    <div className="bg-white rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.full_name || "N/A"}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
              </TableCell>
              <TableCell>
                <UserRoleSelect
                  defaultValue={user.role}
                  onRoleChange={(role) => onRoleChange(user.id, role)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};