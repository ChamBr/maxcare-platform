import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface NavigationButtonProps {
  to: string;
  children: React.ReactNode;
  icon?: LucideIcon;
}

export const NavigationButton = ({ to, children, icon: Icon }: NavigationButtonProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isCurrentPage = location.pathname === to;

  return (
    <Button 
      variant={isCurrentPage ? "default" : "ghost"}
      onClick={() => navigate(to)}
      className={cn(
        "w-full justify-start gap-2",
        "transition-all duration-200",
        isCurrentPage && "bg-primary text-primary-foreground"
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </Button>
  );
};