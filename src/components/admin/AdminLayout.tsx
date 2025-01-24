import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, Settings, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const isCurrentPath = (path: string) => location.pathname === path;

  const navigationItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
    },
    {
      title: "Usuários",
      icon: Users,
      href: "/admin/users",
    },
    {
      title: "Notificações",
      icon: Bell,
      href: "/admin/notifications",
    },
    {
      title: "Configurações",
      icon: Settings,
      href: "/admin/settings",
    },
  ];

  const NavigationLinks = () => (
    <>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
              isCurrentPath(item.href)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header com navegação */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          {/* Menu para mobile */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px]">
              <SheetHeader>
                <SheetTitle>Menu Administrativo</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-2 mt-4">
                <NavigationLinks />
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo ou título */}
          <div className="mr-4 hidden md:flex">
            <h2 className="text-lg font-semibold">MaxCare Admin</h2>
          </div>

          {/* Navegação desktop */}
          <nav className="hidden md:flex items-center space-x-2 flex-1">
            <NavigationLinks />
          </nav>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;