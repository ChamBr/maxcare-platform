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
        "w-full justify-start gap-3 px-4",
        "transition-all duration-300 ease-in-out",
        "hover:scale-105",
        "md:w-auto md:min-w-[140px]",
        isCurrentPage && "bg-primary text-primary-foreground animate-fade-in"
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span>{children}</span>
    </Button>
  );
};