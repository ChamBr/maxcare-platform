import { Cog, Users, Settings, FileText, Bell, Shield, CheckSquare } from "lucide-react";
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
          label: "Manage Users"
        },
        {
          to: "/admin/settings",
          icon: Settings,
          label: "Settings"
        },
        {
          to: "/admin/warranty-types",
          icon: Shield,
          label: "Warranty Types"
        },
        {
          to: "/admin/warranty-approvals",
          icon: CheckSquare,
          label: "Approve Warranties"
        },
        {
          to: "/admin/logs",
          icon: FileText,
          label: "Logs"
        },
        {
          to: "/admin/notifications",
          icon: Bell,
          label: "Notifications"
        }
      ]}
    />
  );
};