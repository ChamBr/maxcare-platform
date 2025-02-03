
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { WarrantyServicesTable } from "@/components/services/WarrantyServicesTable";
import { WarrantyRequestedServicesTable } from "@/components/services/WarrantyRequestedServicesTable";
import { Separator } from "@/components/ui/separator";

interface WarrantyDetailsProps {
  warrantyId: string;
  onBack: () => void;
}

export const WarrantyDetails = ({ warrantyId, onBack }: WarrantyDetailsProps) => {
  const { data: warranty, isLoading } = useQuery({
    queryKey: ["warranty-details", warrantyId],
    queryFn: async () => {
      // Primeiro, buscar os dados da garantia com informações básicas do usuário
      const { data: warrantyData, error: warrantyError } = await supabase
        .from("warranties")
        .select(`
          *,
          users!warranties_user_id_fkey (
            id,
            full_name,
            email,
            phone
          ),
          warranty_types (
            id,
            name
          )
        `)
        .eq("id", warrantyId)
        .single();

      if (warrantyError) throw warrantyError;

      // Buscar o endereço da garantia
      const { data: warrantyAddress, error: addressError } = await supabase
        .from("addresses")
        .select("*")
        .eq("id", warrantyData.address_id)
        .maybeSingle();

      if (addressError) throw addressError;

      // Se não encontrou o endereço da garantia, buscar qualquer endereço do usuário
      if (!warrantyAddress) {
        const { data: userAddress, error: userAddressError } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", warrantyData.users.id)
          .limit(1)
          .maybeSingle();

        if (userAddressError) throw userAddressError;

        return {
          ...warrantyData,
          address: userAddress
        };
      }

      return {
        ...warrantyData,
        address: warrantyAddress
      };
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
            description,
            active,
            created_at,
            updated_at
          )
        `)
        .eq("warranty_id", warrantyId);

      if (error) throw error;
      return data;
    },
  });

  const { data: availableServices } = useQuery({
    queryKey: ["available-warranty-services", warranty?.warranty_type_id, warranty?.address_id],
    queryFn: async () => {
      if (!warranty?.warranty_type_id || !warranty?.address_id) return [];
      
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
    enabled: !!warranty?.warranty_type_id && !!warranty?.address_id,
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <CardTitle>Endereço da Garantia</CardTitle>
          </CardHeader>
          <CardContent>
            {warranty.address ? (
              <>
                <p>
                  {warranty.address.street_address}
                  {warranty.address.apt_suite_unit && `, ${warranty.address.apt_suite_unit}`}
                </p>
                <p>
                  {warranty.address.city}, {warranty.address.state_code} - {warranty.address.zip_code}
                </p>
              </>
            ) : (
              <p>Nenhum endereço encontrado</p>
            )}
          </CardContent>
        </Card>
      </div>

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
        </CardContent>
      </Card>
    </div>
  );
};
