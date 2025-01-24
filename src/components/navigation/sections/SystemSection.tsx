import { Cog, Users, Settings, FileText, Bell } from "lucide-react";
import { MenuSection } from "./MenuSection";

export const SystemSection = () => {
  return (
    <MenuSection
      title="System"
      icon={Cog}
      items={[
        {
          to: "/admin/users",
          icon: Users,
          label: "Gerenciar Usuários"
        },
        {
          to: "/admin/settings",
          icon: Settings,
          label: "Configurações"
        },
        {
          to: "/admin/logs",
          icon: FileText,
          label: "Logs"
        },
        {
          to: "/admin/notifications",
          icon: Bell,
          label: "Notificações"
        }
      ]}
    />
  );
};