
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { WarrantyServicesTable } from "@/components/services/WarrantyServicesTable";
import { WarrantyRequestedServicesTable } from "@/components/services/WarrantyRequestedServicesTable";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Address } from "@/types/address";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface WarrantyDetailsProps {
  warrantyId: string;
  onBack: () => void;
}

export const WarrantyDetails = ({ warrantyId, onBack }: WarrantyDetailsProps) => {
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const { data: customerData, isLoading: isLoadingCustomer } = useQuery({
    queryKey: ["customer-details", warrantyId],
    queryFn: async () => {
      const { data: warrantyData, error: warrantyError } = await supabase
        .from("warranties")
        .select(`
          user_id,
          users (
            id,
            full_name,
            email,
            phone
          )
        `)
        .eq("id", warrantyId)
        .single();

      if (warrantyError) throw warrantyError;
      return warrantyData;
    },
  });

  const { data: addresses } = useQuery({
    queryKey: ["customer-addresses", customerData?.user_id],
    queryFn: async () => {
      if (!customerData?.user_id) return [];

      const { data: addressesData, error: addressesError } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", customerData.user_id);

      if (addressesError) throw addressesError;

      // Buscar garantias ativas para cada endereço
      const { data: activeWarranties, error: warrantiesError } = await supabase
        .from("warranties")
        .select("id, address_id")
        .eq("user_id", customerData.user_id)
        .eq("status", "active")
        .eq("approval_status", "approved");

      if (warrantiesError) throw warrantiesError;

      // Marcar endereços que têm garantias ativas
      return addressesData.map(address => ({
        ...address,
        has_active_warranty: activeWarranties.some(w => w.address_id === address.id)
      }));
    },
    enabled: !!customerData?.user_id,
  });

  const { data: warrantyServices } = useQuery({
    queryKey: ["warranty-services", selectedAddressId],
    queryFn: async () => {
      if (!selectedAddressId) return null;

      // Primeiro, verificar se existe uma garantia ativa para este endereço
      const { data: activeWarranty, error: warrantyError } = await supabase
        .from("warranties")
        .select(`
          id,
          warranty_type_id,
          warranty_types (
            id,
            name
          )
        `)
        .eq("address_id", selectedAddressId)
        .eq("status", "active")
        .eq("approval_status", "approved")
        .maybeSingle();

      if (warrantyError) throw warrantyError;

      if (!activeWarranty) return null;

      // Se existe uma garantia ativa, buscar os serviços disponíveis
      const { data: services, error: servicesError } = await supabase
        .from("warranty_type_services")
        .select(`
          id,
          max_uses,
          warranty_service_id,
          warranty_services (
            id,
            name,
            description
          )
        `)
        .eq("warranty_type_id", activeWarranty.warranty_type_id);

      if (servicesError) throw servicesError;

      return {
        warranty: activeWarranty,
        services
      };
    },
    enabled: !!selectedAddressId,
  });

  const { data: requestedServices } = useQuery({
    queryKey: ["requested-services", warrantyId],
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

  if (isLoadingCustomer) {
    return <div>Carregando...</div>;
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

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Nome:</strong> {customerData?.users?.full_name}</p>
          <p><strong>Email:</strong> {customerData?.users?.email}</p>
          <p><strong>Telefone:</strong> {customerData?.users?.phone || "Não informado"}</p>
        </CardContent>
      </Card>

      {/* Address Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Endereços Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {addresses?.map((address) => (
              <div
                key={address.id}
                className={cn(
                  "p-4 rounded-lg border cursor-pointer transition-colors",
                  selectedAddressId === address.id ? "border-primary bg-primary/5" : "hover:bg-accent",
                  "relative"
                )}
                onClick={() => setSelectedAddressId(address.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      {address.street_address}
                      {address.apt_suite_unit && `, ${address.apt_suite_unit}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {address.city}, {address.state_code} - {address.zip_code}
                    </p>
                  </div>
                  {address.has_active_warranty && (
                    <Badge className="ml-2">Garantia Ativa</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Services */}
      {selectedAddressId && warrantyServices?.warranty && (
        <Card>
          <CardHeader>
            <CardTitle>Serviços Disponíveis - {warrantyServices.warranty.warranty_types.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <WarrantyServicesTable 
              services={warrantyServices.services || []}
              warrantyId={warrantyServices.warranty.id}
            />

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-4">Serviços Solicitados</h3>
              <WarrantyRequestedServicesTable services={requestedServices || []} />
            </div>
          </CardContent>
        </Card>
      )}

      {selectedAddressId && !warrantyServices?.warranty && (
        <Card>
          <CardHeader>
            <CardTitle>Endereço sem Garantia Ativa</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Este endereço não possui uma garantia ativa. Você pode cadastrar uma nova garantia para este endereço.
            </p>
            <Button>
              Cadastrar Nova Garantia
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
