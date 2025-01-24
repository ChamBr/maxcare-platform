import { NavigationButton } from "./NavigationButton";
import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  Bell, 
  Settings,
  History,
  ShieldCheck,
  FileSpreadsheet,
  UserCircle
} from "lucide-react";

interface NavigationLinksProps {
  isStaff: boolean;
  userRole?: string;
}

export const NavigationLinks = ({ isStaff, userRole }: NavigationLinksProps) => {
  if (isStaff && userRole === "dev") {
    return (
      <div className="w-full">
        <div className="flex md:flex-row flex-col md:space-x-4 space-y-2 md:space-y-0">
          <NavigationButton to="/admin" icon={LayoutDashboard}>Dashboard</NavigationButton>
          <NavigationButton to="/admin/users" icon={Users}>Usuários</NavigationButton>
          <NavigationButton to="/admin/services" icon={Wrench}>Serviços</NavigationButton>
          <NavigationButton to="/admin/notifications" icon={Bell}>Notificações</NavigationButton>
          <NavigationButton to="/admin/settings" icon={Settings}>Configurações</NavigationButton>
          <NavigationButton to="/admin/role-history" icon={History}>Histórico de Roles</NavigationButton>
        </div>
      </div>
    );
  }

  if (userRole === "admin") {
    return (
      <div className="w-full">
        <div className="flex md:flex-row flex-col md:space-x-4 space-y-2 md:space-y-0">
          <NavigationButton to="/admin" icon={LayoutDashboard}>Dashboard</NavigationButton>
          <NavigationButton to="/admin/users" icon={Users}>Usuários</NavigationButton>
          <NavigationButton to="/admin/services" icon={Wrench}>Serviços</NavigationButton>
          <NavigationButton to="/admin/notifications" icon={Bell}>Notificações</NavigationButton>
          <NavigationButton to="/admin/settings" icon={Settings}>Configurações</NavigationButton>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex md:flex-row flex-col md:space-x-4 space-y-2 md:space-y-0">
        <NavigationButton to="/warranties" icon={ShieldCheck}>Minhas Garantias</NavigationButton>
        <NavigationButton to="/services" icon={Wrench}>Solicitar Serviço</NavigationButton>
        <NavigationButton to="/history" icon={History}>Histórico</NavigationButton>
        <NavigationButton to="/profile" icon={UserCircle}>Meu Perfil</NavigationButton>
      </div>
    </div>
  );
};