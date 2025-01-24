import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "./UsersTable";

interface UsersFilterProps {
  nameFilter: string;
  roleFilter: string;
  excludeCustomers?: boolean;
  onNameFilterChange: (value: string) => void;
  onRoleFilterChange: (value: string) => void;
}

export const UsersFilter = ({
  nameFilter,
  roleFilter,
  excludeCustomers = false,
  onNameFilterChange,
  onRoleFilterChange,
}: UsersFilterProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input
          placeholder="Filtrar por nome..."
          value={nameFilter}
          onChange={(e) => onNameFilterChange(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="w-full md:w-[200px]">
        <Select value={roleFilter} onValueChange={onRoleFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as roles</SelectItem>
            <SelectItem value="dev">Desenvolvedor</SelectItem>
            <SelectItem value="admin">Administrador</SelectItem>
            <SelectItem value="user">Usuário</SelectItem>
            {!excludeCustomers && <SelectItem value="customer">Cliente</SelectItem>}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};