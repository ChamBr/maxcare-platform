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
          <SelectItem value="dev">Desenvolvedor</SelectItem>
          <SelectItem value="admin">Administrador</SelectItem>
          <SelectItem value="user">Usuário</SelectItem>
          <SelectItem value="customer">Cliente</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};