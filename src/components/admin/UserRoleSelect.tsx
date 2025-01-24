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
  disabled?: boolean;
}

export const UserRoleSelect = ({ 
  defaultValue, 
  onRoleChange,
  disabled = false 
}: UserRoleSelectProps) => {
  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={(value: UserRole) => onRoleChange(value)}
      disabled={disabled}
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
  );
};