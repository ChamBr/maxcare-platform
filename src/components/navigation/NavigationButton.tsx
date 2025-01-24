import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavigationButtonProps {
  to: string;
  children: React.ReactNode;
}

export const NavigationButton = ({ to, children }: NavigationButtonProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isCurrentPage = location.pathname === to;

  return (
    <Button 
      variant={isCurrentPage ? "default" : "ghost"}
      onClick={() => navigate(to)}
      className={cn(
        "transition-all duration-200",
        isCurrentPage && "bg-primary text-primary-foreground"
      )}
    >
      {children}
    </Button>
  );
};