import { cn } from "@/lib/utils";

interface PageTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTitle = ({ children, className }: PageTitleProps) => {
  return (
    <h2 className={cn(
      "text-xl md:text-2xl font-bold mb-4",
      className
    )}>
      {children}
    </h2>
  );
};