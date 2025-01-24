import { LayoutDashboard } from "lucide-react";
import { NavigationButton } from "./NavigationButton";
import { CustomerSection } from "./sections/CustomerSection";
import { ServicesSection } from "./sections/ServicesSection";
import { SystemSection } from "./sections/SystemSection";
import { CustomerMenu } from "./sections/CustomerMenu";

interface NavigationLinksProps {
  isStaff: boolean;
  userRole?: string;
}

export const NavigationLinks = ({ isStaff, userRole }: NavigationLinksProps) => {
  if (isStaff && userRole === "dev") {
    return (
      <div className="w-full space-y-2 px-2">
        <NavigationButton to="/admin" icon={LayoutDashboard}>
          Dashboard
        </NavigationButton>
        <CustomerSection />
        <ServicesSection />
        <SystemSection />
      </div>
    );
  }

  if (userRole === "admin") {
    return (
      <div className="w-full space-y-2 px-2">
        <NavigationButton to="/admin" icon={LayoutDashboard}>
          Dashboard
        </NavigationButton>
        <CustomerSection />
        <ServicesSection />
        <SystemSection />
      </div>
    );
  }

  if (userRole === "user") {
    return (
      <div className="w-full space-y-2 px-2">
        <NavigationButton to="/admin" icon={LayoutDashboard}>
          Dashboard
        </NavigationButton>
        <CustomerSection />
        <ServicesSection />
      </div>
    );
  }

  return (
    <div className="w-full px-2">
      <CustomerMenu />
    </div>
  );
};