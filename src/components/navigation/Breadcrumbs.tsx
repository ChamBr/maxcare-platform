import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { motion } from "framer-motion";

const routeLabels: Record<string, string> = {
  admin: "Admin",
  services: "Services",
  users: "Users",
  notifications: "Notifications",
  settings: "Settings",
  logs: "Logs",
  subscriptions: "Subscriptions",
  "service-requests": "Service Requests",
  warranties: "Warranties",
};

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Se estivermos em uma rota admin/*, removemos 'admin' do caminho
  const isAdminRoute = pathSegments[0] === "admin";
  const displaySegments = isAdminRoute ? pathSegments.slice(1) : pathSegments;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link to="/" className="text-muted-foreground hover:text-foreground">
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          
          {displaySegments.map((segment, index) => {
            const isLast = index === displaySegments.length - 1;
            const label = routeLabels[segment] || segment;
            
            // Construir o path considerando se estamos em uma rota admin
            const segmentsForPath = isAdminRoute 
              ? ['admin', ...displaySegments.slice(0, index + 1)]
              : displaySegments.slice(0, index + 1);
            const path = `/${segmentsForPath.join("/")}`;

            return (
              <BreadcrumbItem key={path}>
                {isLast ? (
                  <BreadcrumbPage className="text-lg font-semibold">
                    {label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink>
                    <Link to={path} className="text-muted-foreground hover:text-foreground">
                      {label}
                    </Link>
                  </BreadcrumbLink>
                )}
                {!isLast && <BreadcrumbSeparator />}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </motion.div>
  );
};