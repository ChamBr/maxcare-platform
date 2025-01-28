import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface NavigationButtonProps {
  to: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  isActive?: boolean;
  onNavigate?: () => void;
}

export const NavigationButton = ({ 
  to, 
  children, 
  icon: Icon, 
  isActive = false,
  onNavigate
}: NavigationButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
    onNavigate?.();
  };

  return (
    <Button 
      variant={isActive ? "default" : "ghost"}
      onClick={handleClick}
      className={cn(
        "w-full justify-start gap-2 px-4 py-2",
        "transition-all duration-200",
        "hover:bg-accent hover:text-accent-foreground",
        "md:w-full",
        isActive && "bg-primary/10 text-primary hover:bg-primary/20"
      )}
    >
      {Icon && <Icon className={cn("h-4 w-4", isActive && "text-primary")} />}
      <span className={cn(isActive && "font-medium")}>{children}</span>
    </Button>
  );
};