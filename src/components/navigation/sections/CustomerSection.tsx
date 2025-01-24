import { Building2, Users, CreditCard, Clipboard } from "lucide-react";
import { NavigationButton } from "../NavigationButton";
import { MenuSection } from "./MenuSection";

export const CustomerSection = () => {
  return (
    <MenuSection
      title="Customers"
      icon={Building2}
      items={[
        {
          to: "/admin/users?type=customer",
          icon: Users,
          label: "Clientes"
        },
        {
          to: "/admin/subscriptions",
          icon: CreditCard,
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