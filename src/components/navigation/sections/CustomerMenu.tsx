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
        is
      >
        Meu Perfil
      </NavigationButton>
      <NavigationButton 
        to="/warranties" 
        icon={ShieldCheck}
        isActive={location.pathname === "/warranties"}
      >
        Minhas Garantias
      </NavigationButton>
      <NavigationButton 
        to="/services" 
        icon={Wrench}
        isActive={location.pathname === "/services"}
      >
        Solicitar Serviço
      </NavigationButton>
    </div>
  );
};