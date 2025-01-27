import { Wrench, ShieldCheck, ScrollText, FileText } from "lucide-react";
import { MenuSection } from "./MenuSection";

export const ServicesSection = () => {
  return (
    <MenuSection
      title="Services"
      icon={Wrench}
      items={[
        {
          to: "/admin/services?status=active",
          icon: ShieldCheck,
          label: "In Progress"
        },
        {
          to: "/admin/services?status=pending",
          icon: ScrollText,
          label: "Pending"
        },
        {
          to: "/admin/services?status=completed",
          icon: FileText,
          label: "Completed"
        }
      ]}
    />
  );
};