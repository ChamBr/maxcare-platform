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
  const [isAdmin, setIsAdmin] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("customer");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkUserRole(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        checkUserRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserRole = async (userId: string) => {
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();

    if (roles) {
      setUserRole(roles.role);
      setIsAdmin(roles.role === "dev");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out successfully",
      description: "You have been signed out of your account",
    });
    navigate("/login");
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

  const NavigationLinks = () => (
    <>
      <NavigationButton to="/warranties">My Warranties</NavigationButton>
      <NavigationButton to="/services">Request Service</NavigationButton>
      {isAdmin && (
        <NavigationButton to="/admin">Admin</NavigationButton>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-start md:space-x-6">
          <h1 
            onClick={() => navigate("/")}
            className="text-xl font-bold text-primary cursor-pointer transition-colors hover:text-primary/90"
          >
            MaxCare
          </h1>
          {session && (
            <>
              <nav className="hidden md:flex items-center space-x-2">
                <NavigationLinks />
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
                    <NavigationLinks />
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