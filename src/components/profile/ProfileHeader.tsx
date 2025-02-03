
import { Badge } from "@/components/ui/badge";
import { getRoleBadgeVariant } from "@/utils/getRoleBadgeVariant";

interface ProfileHeaderProps {
  userRole: string;
}

export const ProfileHeader = ({ userRole }: ProfileHeaderProps) => {
  return (
    <div className="flex items-center gap-2 mb-6">
      <h1 className="text-2xl font-bold">Perfil</h1>
      <Badge variant={getRoleBadgeVariant(userRole)}>{userRole}</Badge>
    </div>
  );
};
