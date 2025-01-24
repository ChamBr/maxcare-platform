import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { User, Menu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuthState } from "@/hooks/useAuthState";
import { NavigationLinks } from "@/components/navigation/NavigationLinks";
import { LogoutButton } from "@/components/auth/LogoutButton";

export const Header = () => {
  const navigate = useNavigate();
  const { isStaff, session, userRole, clearUserState } = useAuthState();

  const getPortalName = () => {
    if (isStaff && userRole === "dev") return "MaxCare Panel";
    if (userRole === "admin") return "MaxCare Services";
    return "MaxCare Customer";
  };

  const getPortalColor = () => {
    if (isStaff && userRole === "dev") return "text-primary";
    if (userRole === "admin") return "text-blue-500";
    return "text-green-500";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-start md:space-x-6">
          <div className="flex items-center space-x-2">
            <h1 
              onClick={() => navigate("/")}
              className={cn(
                "text-xl font-bold cursor-pointer transition-colors",
                getPortalColor(),
                "hover:opacity-90"
              )}
            >
              {getPortalName()}
            </h1>
          </div>
          {session && (
            <>
              <nav className="hidden md:flex items-center space-x-2">
                <NavigationLinks isStaff={isStaff} userRole={userRole} />
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
                    <NavigationLinks isStaff={isStaff} userRole={userRole} />
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
              <LogoutButton onLogout={clearUserState} />
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