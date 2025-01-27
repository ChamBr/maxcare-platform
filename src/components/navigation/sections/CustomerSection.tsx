import { Building2, Users, ShieldCheck, Clipboard } from "lucide-react";
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
          label: "Customers"
        },
        {
          to: "/admin/subscriptions",
          icon: ShieldCheck,
          label: "Warranties"
        },
        {
          to: "/admin/service-requests",
          icon: Clipboard,
          label: "Requests"
        }
      ]}
    />
  );
};