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
          label: "Serviços Ativos"
        },
        {
          to: "/admin/services?status=pending",
          icon: ScrollText,
          label: "Serviços Pendentes"
        },
        {
          to: "/admin/services?status=completed",
          icon: FileText,
          label: "Histórico"
        }
      ]}
    />
  );
};