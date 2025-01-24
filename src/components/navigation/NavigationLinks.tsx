import { NavigationButton } from "./NavigationButton";
import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  Bell, 
  Settings,
  FileText,
  ShieldCheck,
  CreditCard,
  Clipboard,
  UserCircle,
  Building2,
  Cog,
  ScrollText
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavigationLinksProps {
  isStaff: boolean;
  userRole?: string;
}

export const NavigationLinks = ({ isStaff, userRole }: NavigationLinksProps) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    customers: false,
    services: false,
    system: false
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (isStaff && userRole === "dev") {
    return (
      <div className="w-full space-y-2">
        <NavigationButton to="/admin" icon={LayoutDashboard}>Dashboard</NavigationButton>
        
        <Collapsible open={openSections.customers} onOpenChange={() => toggleSection('customers')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Customers
              </span>
              <span className={cn(
                "transition-transform duration-200",
                openSections.customers ? "rotate-180" : ""
              )}>▼</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4 space-y-2">
            <NavigationButton to="/admin/users?type=customer" icon={Users}>Clientes</NavigationButton>
            <NavigationButton to="/admin/subscriptions" icon={CreditCard}>Garantias</NavigationButton>
            <NavigationButton to="/admin/service-requests" icon={Clipboard}>Solicitações</NavigationButton>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={openSections.services} onOpenChange={() => toggleSection('services')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Services
              </span>
              <span className={cn(
                "transition-transform duration-200",
                openSections.services ? "rotate-180" : ""
              )}>▼</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4 space-y-2">
            <NavigationButton to="/admin/services?status=active" icon={ShieldCheck}>Serviços Ativos</NavigationButton>
            <NavigationButton to="/admin/services?status=pending" icon={ScrollText}>Serviços Pendentes</NavigationButton>
            <NavigationButton to="/admin/services?status=completed" icon={FileText}>Histórico</NavigationButton>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={openSections.system} onOpenChange={() => toggleSection('system')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Cog className="h-4 w-4" />
                System
              </span>
              <span className={cn(
                "transition-transform duration-200",
                openSections.system ? "rotate-180" : ""
              )}>▼</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4 space-y-2">
            <NavigationButton to="/admin/users" icon={Users}>Gerenciar Usuários</NavigationButton>
            <NavigationButton to="/admin/settings" icon={Settings}>Configurações</NavigationButton>
            <NavigationButton to="/admin/logs" icon={FileText}>Logs</NavigationButton>
            <NavigationButton to="/admin/notifications" icon={Bell}>Notificações</NavigationButton>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  }

  if (userRole === "admin") {
    return (
      <div className="w-full space-y-2">
        <NavigationButton to="/admin" icon={LayoutDashboard}>Dashboard</NavigationButton>
        
        <Collapsible open={openSections.customers} onOpenChange={() => toggleSection('customers')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Customers
              </span>
              <span className={cn(
                "transition-transform duration-200",
                openSections.customers ? "rotate-180" : ""
              )}>▼</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4 space-y-2">
            <NavigationButton to="/admin/users?type=customer" icon={Users}>Clientes</NavigationButton>
            <NavigationButton to="/admin/subscriptions" icon={CreditCard}>Garantias</NavigationButton>
            <NavigationButton to="/admin/service-requests" icon={Clipboard}>Solicitações</NavigationButton>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={openSections.services} onOpenChange={() => toggleSection('services')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Services
              </span>
              <span className={cn(
                "transition-transform duration-200",
                openSections.services ? "rotate-180" : ""
              )}>▼</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4 space-y-2">
            <NavigationButton to="/admin/services?status=active" icon={ShieldCheck}>Serviços Ativos</NavigationButton>
            <NavigationButton to="/admin/services?status=pending" icon={ScrollText}>Serviços Pendentes</NavigationButton>
            <NavigationButton to="/admin/services?status=completed" icon={FileText}>Histórico</NavigationButton>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={openSections.system} onOpenChange={() => toggleSection('system')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Cog className="h-4 w-4" />
                System
              </span>
              <span className={cn(
                "transition-transform duration-200",
                openSections.system ? "rotate-180" : ""
              )}>▼</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4 space-y-2">
            <NavigationButton to="/admin/users" icon={Users}>Gerenciar Usuários</NavigationButton>
            <NavigationButton to="/admin/settings" icon={Settings}>Configurações</NavigationButton>
            <NavigationButton to="/admin/logs" icon={FileText}>Logs</NavigationButton>
            <NavigationButton to="/admin/notifications" icon={Bell}>Notificações</NavigationButton>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  }

  if (userRole === "user") {
    return (
      <div className="w-full space-y-2">
        <NavigationButton to="/admin" icon={LayoutDashboard}>Dashboard</NavigationButton>
        
        <Collapsible open={openSections.customers} onOpenChange={() => toggleSection('customers')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Customers
              </span>
              <span className={cn(
                "transition-transform duration-200",
                openSections.customers ? "rotate-180" : ""
              )}>▼</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4 space-y-2">
            <NavigationButton to="/admin/users?type=customer" icon={Users}>Clientes</NavigationButton>
            <NavigationButton to="/admin/subscriptions" icon={CreditCard}>Garantias</NavigationButton>
            <NavigationButton to="/admin/service-requests" icon={Clipboard}>Solicitações</NavigationButton>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={openSections.services} onOpenChange={() => toggleSection('services')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Services
              </span>
              <span className={cn(
                "transition-transform duration-200",
                openSections.services ? "rotate-180" : ""
              )}>▼</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4 space-y-2">
            <NavigationButton to="/admin/services?status=active" icon={ShieldCheck}>Serviços Ativos</NavigationButton>
            <NavigationButton to="/admin/services?status=pending" icon={ScrollText}>Serviços Pendentes</NavigationButton>
            <NavigationButton to="/admin/services?status=completed" icon={FileText}>Histórico</NavigationButton>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex md:flex-row flex-col md:space-x-4 space-y-2 md:space-y-0">
        <NavigationButton to="/warranties" icon={ShieldCheck}>Minhas Garantias</NavigationButton>
        <NavigationButton to="/services" icon={Wrench}>Solicitar Serviço</NavigationButton>
        <NavigationButton to="/profile" icon={UserCircle}>Meu Perfil</NavigationButton>
      </div>
    </div>
  );
};