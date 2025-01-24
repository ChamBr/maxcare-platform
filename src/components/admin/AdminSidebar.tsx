import { useLocation } from "react-router-dom";
import { Users, Settings, Bell, FileText, LayoutDashboard } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavigationButton } from "@/components/navigation/NavigationButton";

export function AdminSidebar() {
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Usuários",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Configurações",
      url: "/admin/settings",
      icon: Settings,
    },
    {
      title: "Notificações",
      url: "/admin/notifications",
      icon: Bell,
    },
    {
      title: "Logs",
      url: "/admin/logs",
      icon: FileText,
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administração</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={location.pathname === item.url}
                  >
                    <NavigationButton
                      to={item.url}
                      icon={item.icon}
                      isActive={location.pathname === item.url}
                    >
                      {item.title}
                    </NavigationButton>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}