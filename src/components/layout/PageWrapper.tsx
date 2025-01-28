import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { PageTitle } from "@/components/ui/page-title";

interface PageWrapperProps {
  children: React.ReactNode;
  showBreadcrumbs?: boolean;
  title?: string;
}

export const PageWrapper = ({ children, showBreadcrumbs = false, title }: PageWrapperProps) => {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-4"
    >
      {showBreadcrumbs && <Breadcrumbs />}
      {title && <PageTitle>{title}</PageTitle>}
      {children}
    </motion.div>
  );
};