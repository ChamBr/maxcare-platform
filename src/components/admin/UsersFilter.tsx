import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "./UsersTable";

interface UsersFilterProps {
  nameFilter: string;
  roleFilter: string;
  onNameFilterChange: (value: string) => void;
  onRoleFilterChange: (value: string) => void;
}

export const UsersFilter = ({
  nameFilter,
  roleFilter,
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
            <SelectItem value="">Todas as roles</SelectItem>
            <SelectItem value="dev">Dev</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};