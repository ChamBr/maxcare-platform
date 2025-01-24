import { ShieldCheck, Wrench, UserCircle } from "lucide-react";
import { NavigationButton } from "../NavigationButton";

export const CustomerMenu = () => {
  return (
    <div className="flex md:flex-row flex-col gap-2">
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