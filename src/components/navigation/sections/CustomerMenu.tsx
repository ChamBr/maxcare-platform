import { ShieldCheck, Wrench, UserCircle } from "lucide-react";
import { NavigationButton } from "../NavigationButton";

export const CustomerMenu = () => {
  return (
    <div className="flex md:flex-row flex-col md:space-x-4 space-y-2 md:space-y-0">
      <NavigationButton to="/warranties" icon={ShieldCheck}>
        Minhas Garantias
      </NavigationButton>
      <NavigationButton to="/services" icon={Wrench}>
        Solicitar Serviço
      </NavigationButton>
      <NavigationButton to="/profile" icon={UserCircle}>
        Meu Perfil
      </NavigationButton>
    </div>
  );
};