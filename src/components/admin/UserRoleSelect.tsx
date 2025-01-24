import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type UserRole = "dev" | "admin" | "user" | "customer";

interface UserRoleSelectProps {
  defaultValue: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const UserRoleSelect = ({ 
  defaultValue, 
  onRoleChange,
}: UserRoleSelectProps) => {
  return (
    <div className="flex justify-end">
      <Select
        defaultValue={defaultValue}
        onValueChange={(value: UserRole) => onRoleChange(value)}
      >
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="dev">Dev</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="user">User</SelectItem>
          <SelectItem value="customer">Customer</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};