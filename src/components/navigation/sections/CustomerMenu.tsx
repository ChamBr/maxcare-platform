import { ShieldCheck, Wrench, UserCircle } from "lucide-react";
import { NavigationButton } from "../NavigationButton";
import { useLocation } from "react-router-dom";

export const CustomerMenu = () => {
  const location = useLocation();
  
  return (
    <div className="flex md:flex-row flex-col gap-2">
      <NavigationButton 
        to="/profile" 
        icon={UserCircle}
        isActive={location.pathname === "/profile"}
      >
        My Profile
      </NavigationButton>
      <NavigationButton 
        to="/warranties" 
        icon={ShieldCheck}
        isActive={location.pathname === "/warranties"}
      >
        My Warranties
      </NavigationButton>
      <NavigationButton 
        to="/services" 
        icon={Wrench}
        isActive={location.pathname === "/services"}
      >
        Request Service
      </NavigationButton>
    </div>
  );
};