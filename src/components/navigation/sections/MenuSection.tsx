import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NavigationButton } from "../NavigationButton";
import { cn } from "@/lib/utils";
import { LucideIcon, ChevronDown, ChevronUp } from "lucide-react";
import { useLocation } from "react-router-dom";

interface MenuItem {
  to: string;
  icon: LucideIcon;
  label: string;
}

interface MenuSectionProps {
  title: string;
  icon: LucideIcon;
  items: MenuItem[];
}

export const MenuSection = ({ title, icon: Icon, items }: MenuSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActiveRoute = items.some(item => location.pathname.startsWith(item.to));

  return (
    <div className="relative inline-block w-full">
      <Button 
        variant="ghost" 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full justify-between px-4 py-2",
          "transition-colors duration-200",
          "hover:bg-accent/80",
          isOpen && "bg-accent",
          isActiveRoute && "text-primary border-l-2 border-primary"
        )}
      >
        <span className="flex items-center gap-2">
          <Icon className={cn("h-4 w-4", isActiveRoute && "text-primary")} />
          {title}
        </span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>
      
      <div 
        className={cn(
          "absolute left-0 right-0 top-full mt-1 z-50",
          "transform transition-all duration-200 ease-out min-w-[200px] w-auto",
          isOpen 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-[-10px] pointer-events-none"
        )}
      >
        <div className="bg-background border rounded-md shadow-lg w-full whitespace-nowrap">
          {items.map((item) => {
            const isActive = location.pathname.startsWith(item.to);
            return (
              <div
                key={item.to}
                className={cn(
                  "relative",
                  isActive && "after:absolute after:left-0 after:top-0 after:h-full after:w-0.5 after:bg-primary"
                )}
              >
                <NavigationButton 
                  to={item.to} 
                  icon={item.icon}
                  isActive={isActive}
                >
                  {item.label}
                </NavigationButton>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};