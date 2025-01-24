import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, User, Menu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isStaff, setIsStaff] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("customer");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkUserRole(session.user.id);
      } else {
        clearUserState();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        checkUserRole(session.user.id);
      } else {
        clearUserState();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const clearUserState = () => {
    setIsStaff(false);
    setUserRole("customer");
    setSession(null);
  };

  const checkUserRole = async (userId: string) => {
    try {
      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .single();

      if (error) throw error;

      if (roles) {
        setUserRole(roles.role);
        setIsStaff(["dev", "admin"].includes(roles.role));
      }
    } catch (error) {
      console.error("Erro ao verificar papel do usuário:", error);
    }
  };

  const handleLogout = async () => {
    try {
      // Verifica se existe uma sessão antes de tentar fazer logout
      const { data: currentSession } = await supabase.auth.getSession();
      
      if (!currentSession.session) {
        clearUserState();
        navigate("/login");
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      clearUserState();
      
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado da sua conta",
      });

      navigate("/login");
    } catch (error: any) {
      console.error("Erro ao fazer logout:", error);
      toast({
        variant: "destructive",
        title: "Erro ao fazer logout",
        description: "Ocorreu um erro ao tentar desconectar. Tente novamente.",
      });
      
      // Força a limpeza da sessão no localStorage e redireciona
      localStorage.removeItem('sb-' + import.meta.env.VITE_SUPABASE_PROJECT_ID + '-auth-token');
      clearUserState();
      navigate("/login");
    }
  };

  const isCurrentPage = (path: string) => location.pathname === path;

  const NavigationButton = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Button 
      variant={isCurrentPage(to) ? "default" : "ghost"}
      onClick={() => navigate(to)}
      className={cn(
        "transition-all duration-200",
        isCurrentPage(to) && "bg-primary text-primary-foreground"
      )}
    >
      {children}
    </Button>
  );

  const StaffNavigationLinks = () => (
    <>
      <NavigationButton to="/admin">Dashboard</NavigationButton>
      <NavigationButton to="/admin/users">Usuários</NavigationButton>
      <NavigationButton to="/admin/services">Serviços</NavigationButton>
      <NavigationButton to="/admin/notifications">Notificações</NavigationButton>
      <NavigationButton to="/admin/settings">Configurações</NavigationButton>
    </>
  );

  const CustomerNavigationLinks = () => (
    <>
      <NavigationButton to="/warranties">My Warranties</NavigationButton>
      <NavigationButton to="/services">Request Service</NavigationButton>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-start md:space-x-6">
          <div className="flex items-center space-x-2">
            <h1 
              onClick={() => navigate("/")}
              className="text-xl font-bold text-primary cursor-pointer transition-colors hover:text-primary/90"
            >
              MaxCare
            </h1>
            {isStaff && (
              <span className="text-xl font-bold text-foreground">Admin</span>
            )}
          </div>
          {session && (
            <>
              <nav className="hidden md:flex items-center space-x-2">
                {isStaff ? <StaffNavigationLinks /> : <CustomerNavigationLinks />}
              </nav>
              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="ml-2">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[240px] sm:w-[280px]">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col space-y-2 mt-6">
                    {isStaff ? <StaffNavigationLinks /> : <CustomerNavigationLinks />}
                  </nav>
                </SheetContent>
              </Sheet>
            </>
          )}
        </div>
        <div className="flex items-center justify-end space-x-2">
          {session ? (
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="hidden sm:flex">
                <User className="mr-1 h-3 w-3" />
                {userRole}
              </Badge>
              <span className="hidden sm:inline text-sm text-muted-foreground">
                {session.user.email}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <Button 
                variant="ghost"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate("/register")}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};