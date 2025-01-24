import { NavigationButton } from "./NavigationButton";
import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  Bell, 
  Settings,
  ClipboardList,
  FileText,
  History,
  ShieldCheck,
  FileSpreadsheet,
  UserCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NavigationLinksProps {
  isStaff: boolean;
  userRole?: string;
}

export const NavigationLinks = ({ isStaff, userRole }: NavigationLinksProps) => {
  if (isStaff && userRole === "dev") {
    return (
      <div className="flex flex-col space-y-1 w-full">
        <div className="px-2 py-1">
          <Badge variant="outline" className="w-full justify-center bg-[#1A1F2C]/5 text-[#1A1F2C]">
            MaxCare Panel
          </Badge>
        </div>
        <div className="flex flex-col space-y-1">
          <NavigationButton to="/admin" icon={LayoutDashboard}>Dashboard</NavigationButton>
          <NavigationButton to="/admin/users" icon={Users}>Usuários</NavigationButton>
          <NavigationButton to="/admin/services" icon={Wrench}>Serviços</NavigationButton>
          <NavigationButton to="/admin/notifications" icon={Bell}>Notificações</NavigationButton>
          <NavigationButton to="/admin/settings" icon={Settings}>Configurações</NavigationButton>
        </div>
      </div>
    );
  }

  if (userRole === "admin") {
    return (
      <div className="flex flex-col space-y-1 w-full">
        <div className="px-2 py-1">
          <Badge variant="outline" className="w-full justify-center bg-blue-900/5 text-blue-900">
            MaxCare Services
          </Badge>
        </div>
        <div className="flex flex-col space-y-1">
          <NavigationButton to="/services/dashboard" icon={LayoutDashboard}>Dashboard</NavigationButton>
          <NavigationButton to="/services/clients" icon={Users}>Clientes</NavigationButton>
          <NavigationButton to="/services/warranties" icon={ShieldCheck}>Garantias</NavigationButton>
          <NavigationButton to="/services/reports" icon={FileSpreadsheet}>Relatórios</NavigationButton>
          <NavigationButton to="/services/history" icon={History}>Histórico</NavigationButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-1 w-full">
      <div className="px-2 py-1">
        <Badge variant="outline" className="w-full justify-center bg-black/5 text-black">
          MaxCare Customer
        </Badge>
      </div>
      <div className="flex flex-col space-y-1">
        <NavigationButton to="/warranties" icon={ShieldCheck}>Minhas Garantias</NavigationButton>
        <NavigationButton to="/services" icon={Wrench}>Solicitar Serviço</NavigationButton>
        <NavigationButton to="/history" icon={History}>Histórico</NavigationButton>
        <NavigationButton to="/profile" icon={UserCircle}>Meu Perfil</NavigationButton>
      </div>
    </div>
  );
};