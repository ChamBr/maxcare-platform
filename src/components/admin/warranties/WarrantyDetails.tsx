import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { WarrantyServicesTable } from "@/components/services/WarrantyServicesTable";
import { WarrantyRequestedServicesTable } from "@/components/services/WarrantyRequestedServicesTable";
import { ServiceRequestForm } from "@/components/services/ServiceRequestForm";
import { Separator } from "@/components/ui/separator";

interface WarrantyDetailsProps {
  warrantyId: string;
  onBack: () => void;
}

export const WarrantyDetails = ({ warrantyId, onBack }: WarrantyDetailsProps) => {
  const { data: warranty, isLoading } = useQuery({
    queryKey: ["warranty-details", warrantyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warranties")
        .select(`
          *,
          users (
            full_name,
            email,
            phone
          ),
          addresses (
            street_address,
            apt_suite_unit,
            city,
            state_code,
            zip_code
          ),
          warranty_types (
            id,
            name
          )
        `)
        .eq("id", warrantyId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: services } = useQuery({
    queryKey: ["warranty-services", warrantyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select(`
          *,
          warranty_services (
            id,
            name,
            description
          )
        `)
        .eq("warranty_id", warrantyId);

      if (error) throw error;
      return data;
    },
  });

  const { data: availableServices } = useQuery({
    queryKey: ["available-warranty-services", warranty?.warranty_type_id],
    queryFn: async () => {
      if (!warranty?.warranty_type_id) return [];
      
      const { data, error } = await supabase
        .from("warranty_type_services")
        .select(`
          id,
          max_uses,
          warranty_type_id,
          warranty_services (
            id,
            name,
            description
          )
        `)
        .eq("warranty_type_id", warranty.warranty_type_id);

      if (error) throw error;
      return data;
    },
    enabled: !!warranty?.warranty_type_id,
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!warranty) {
    return <div>Garantia não encontrada</div>;
  }

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-4"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Nome:</strong> {warranty.users?.full_name}</p>
          <p><strong>Email:</strong> {warranty.users?.email}</p>
          <p><strong>Telefone:</strong> {warranty.users?.phone || "Não informado"}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Endereço</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            {warranty.addresses?.street_address}
            {warranty.addresses?.apt_suite_unit && `, ${warranty.addresses.apt_suite_unit}`}
          </p>
          <p>
            {warranty.addresses?.city}, {warranty.addresses?.state_code} - {warranty.addresses?.zip_code}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Serviços Disponíveis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <WarrantyServicesTable 
            services={availableServices || []}
            warrantyId={warrantyId}
          />

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-4">Serviços Solicitados</h3>
            <WarrantyRequestedServicesTable services={services || []} />
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-4">Nova Solicitação</h3>
            <ServiceRequestForm 
              warrantyId={warrantyId} 
              warrantyTypeId={warranty.warranty_type_id}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};