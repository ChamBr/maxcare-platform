import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { NavigationButton } from "../NavigationButton";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

  useEffect(() => {
    if (!isActiveRoute) {
      setIsOpen(false);
    }
  }, [location.pathname, isActiveRoute]);

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full justify-between px-4 py-2",
          "transition-all duration-300 ease-in-out",
          "hover:bg-accent/80",
          isOpen && "bg-accent",
          isActiveRoute && "text-primary border-l-2 border-primary"
        )}
      >
        <span className="flex items-center gap-2">
          <Icon className={cn("h-4 w-4", isActiveRoute && "text-primary")} />
          {title}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-xs"
        >
          ▼
        </motion.span>
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="relative z-50 w-full bg-background border-x border-b rounded-b-md shadow-lg py-2">
              {items.map((item, index) => {
                const isActive = location.pathname.startsWith(item.to);
                return (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
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
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};