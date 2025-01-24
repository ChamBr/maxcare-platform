import { Wrench, ShieldCheck, ScrollText, FileText } from "lucide-react";
import { MenuSection } from "./MenuSection";

export const ServicesSection = () => {
  return (
    <MenuSection
      title="Serviços"
      icon={Wrench}
      items={[
        {
          to: "/admin/services?status=active",
          icon: ShieldCheck,
          label: "Em Andamento"
        },
        {
          to: "/admin/services?status=pending",
          icon: ScrollText,
          label: "Aguardando"
        },
        {
          to: "/admin/services?status=completed",
          icon: FileText,
          label: "Concluídos"
        }
      ]}
    />
  );
};