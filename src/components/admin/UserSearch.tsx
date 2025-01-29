import { Input } from "@/components/ui/input";

interface UserSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const UserSearch = ({ searchTerm, onSearchChange }: UserSearchProps) => {
  return (
    <div className="mb-4">
      <Input
        placeholder="Buscar por nome ou email..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
};