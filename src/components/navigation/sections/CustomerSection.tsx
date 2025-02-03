
import { Building2 } from "lucide-react";
import { NavigationButton } from "../NavigationButton";

export const CustomerSection = () => {
  return (
    <div className="w-full">
      <NavigationButton to="/admin/customers" icon={Building2}>
        Customers
      </NavigationButton>
    </div>
  );
};

