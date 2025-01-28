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
import { cn } from "@/lib/utils";
import { useState } from "react";

export const Header = () => {
  const navigate = useNavigate();
  const { isStaff, session, userRole, clearUserState } = useAuthState();
  const [isOpen, setIsOpen] = useState(false);

  const getPortalName = () => {
    if (!session) return "MaxCare";
    if (isStaff && userRole === "dev") return ["MaxCare", "Panel"];
    if (userRole === "admin") return ["MaxCare", "Panel"];
    return ["MaxCare", "Customer"];
  };

  const getPortalColor = () => {
    if (!session) return "text-primary";
    if (isStaff && userRole === "dev") return "text-[#1A1F2C]";
    if (userRole === "admin") return "text-blue-900";
    return "text-black";
  };

  const handleNavigate = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4">
          <h1 
            onClick={() => navigate("/")}
            className="text-xl font-bold cursor-pointer transition-colors flex items-center"
          >
            <span className="text-primary">MaxCare</span>
            {session && Array.isArray(getPortalName()) && (
              <span className={cn("ml-1", getPortalColor())}>
                {getPortalName()[1]}
              </span>
            )}
          </h1>
        </div>
        
        {session && (
          <>
            <nav className="hidden md:flex flex-1 items-center">
              <NavigationLinks isStaff={isStaff} userRole={userRole} onNavigate={handleNavigate} />
            </nav>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="ml-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[280px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-6">
                  <NavigationLinks isStaff={isStaff} userRole={userRole} onNavigate={handleNavigate} />
                </nav>
              </SheetContent>
            </Sheet>
          </>
        )}

        <div className="flex items-center justify-end space-x-2 ml-auto">
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