import { Building2, Users, ShieldCheck, Clipboard } from "lucide-react";
import { NavigationButton } from "../NavigationButton";
import { MenuSection } from "./MenuSection";

export const CustomerSection = () => {
  return (
    <MenuSection
      title="Clientes"
      icon={Building2}
      items={[
        {
          to: "/admin/users?type=customer",
          icon: Users,
          label: "Clientes"
        },
        {
          to: "/admin/subscriptions",
          icon: ShieldCheck,
          label: "Garantias"
        },
        {
          to: "/admin/service-requests",
          icon: Clipboard,
          label: "Solicitações"
        }
      ]}
    />
  );
};