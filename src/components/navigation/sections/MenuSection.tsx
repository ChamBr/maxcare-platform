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
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between">
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
      <CollapsibleContent className="pl-4 space-y-2">
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
  );
};