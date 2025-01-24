import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NavigationButton } from "../NavigationButton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

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

  return (
    <div className="relative">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-between px-4 py-2 hover:bg-accent",
              "transition-colors duration-200",
              isOpen && "bg-accent"
            )}
          >
            <span className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              {title}
            </span>
            <span className={cn(
              "transition-transform duration-200",
              isOpen ? "rotate-180" : ""
            )}>▼</span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="absolute z-50 w-full min-w-[200px] bg-background border rounded-md shadow-lg mt-1 py-2">
          {items.map((item) => (
            <NavigationButton 
              key={item.to}
              to={item.to} 
              icon={item.icon}
            >
              {item.label}
            </NavigationButton>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};