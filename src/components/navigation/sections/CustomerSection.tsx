
import { Building2 } from "lucide-react";
import { NavigationButton } from "../NavigationButton";
import { MenuSection } from "./MenuSection";

export const CustomerSection = () => {
  return (
    <MenuSection
      title="Customers"
      icon={Building2}
      items={[
        {
          to: "/admin/customers",
          icon: Building2,
          label: "Customers"
        }
      ]}
    />
  );
};
