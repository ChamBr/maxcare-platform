import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import type { UserRole } from "@/components/admin/UsersTable";

const getRoleTextColor = (role: UserRole) => {
  switch (role) {
    case "dev":
      return "text-purple-500";
    case "admin":
      return "text-red-500";
    case "user":
      return "text-blue-500";
    default:
      return "text-gray-500";
  }
};

export const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [role, setRole] = useState<UserRole>("customer");

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: userRole } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (userRole) {
      setRole(userRole.role as UserRole);
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow">
      <Link to="/" className="text-lg font-bold">
        MyApp
      </Link>
      <div className={`capitalize hidden sm:flex font-medium ${getRoleTextColor(role)}`}>
        {role}
      </div>
      <Button onClick={() => navigate("/login")}>Login</Button>
    </header>
  );
};
