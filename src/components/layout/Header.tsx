import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Header = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("customer");

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkUserRole(session.user.id);
      }
    });

    // Listen for auth changes
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
    navigate("/login");
  };

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 
            onClick={() => navigate("/")}
            className="text-2xl font-bold text-primary cursor-pointer"
          >
            MaxCare
          </h1>
          {session ? (
            <nav className="hidden md:flex items-center space-x-6">
              <Button 
                variant="ghost"
                onClick={() => navigate("/warranties")}
              >
                My Warranties
              </Button>
              <Button 
                variant="ghost"
                onClick={() => navigate("/services")}
              >
                Request Service
              </Button>
              {isAdmin && (
                <Button 
                  variant="ghost"
                  onClick={() => navigate("/admin")}
                >
                  Admin
                </Button>
              )}
            </nav>
          ) : null}
        </div>
        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="capitalize">
                  <User className="w-3 h-3 mr-1" />
                  {userRole}
                </Badge>
                <span className="text-sm text-gray-600">
                  {session.user.email}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button 
                variant="outline"
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