
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { WarrantyServicesTable } from "@/components/services/WarrantyServicesTable";
import { WarrantyRequestedServicesTable } from "@/components/services/WarrantyRequestedServicesTable";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
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

      const { data: activeWarranties, error: warrantiesError } = await supabase
        .from("warranties")
        .select("id, address_id")
        .eq("user_id", customerData.user_id)
        .eq("status", "active")
        .eq("approval_status", "approved");

      if (warrantiesError) throw warrantiesError;

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
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="h-8"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="h-6">
            Cliente #{customerData?.users?.id?.slice(-4)}
          </Badge>
        </div>
      </div>

      {/* Primeira linha: Info do Cliente e Endereços lado a lado */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Informações do Cliente - Lado Esquerdo */}
        <Card className="shadow-sm">
          <CardHeader className="p-4">
            <CardTitle className="text-lg">Informações do Cliente</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-2">
              <p className="font-medium">{customerData?.users?.full_name}</p>
              <p className="text-sm text-muted-foreground">{customerData?.users?.email}</p>
              <p className="text-sm text-muted-foreground">{customerData?.users?.phone || "Não informado"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Endereços - Lado Direito */}
        <Card className="shadow-sm">
          <CardHeader className="p-4">
            <CardTitle className="text-lg">Endereços</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-2 max-h-[150px] overflow-y-auto">
              {addresses?.map((address) => (
                <div
                  key={address.id}
                  className={cn(
                    "p-2 rounded-md border cursor-pointer transition-colors",
                    selectedAddressId === address.id ? "border-primary bg-primary/5" : "hover:bg-accent",
                    "relative"
                  )}
                  onClick={() => setSelectedAddressId(address.id)}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 text-sm">
                      <p className="font-medium">
                        {address.street_address}
                        {address.apt_suite_unit && `, ${address.apt_suite_unit}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {address.city}, {address.state_code}
                      </p>
                    </div>
                    {address.has_active_warranty && (
                      <Badge variant="secondary" className="h-5 text-xs whitespace-nowrap">
                        Garantia Ativa
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Segunda linha: Serviços */}
      {selectedAddressId && (
        <Card className="shadow-sm">
          <CardHeader className="p-4">
            <CardTitle className="text-lg flex items-center justify-between">
              {warrantyServices?.warranty ? (
                <>
                  <span>Serviços Disponíveis</span>
                  <Badge variant="outline" className="ml-2">
                    {warrantyServices.warranty.warranty_types.name}
                  </Badge>
                </>
              ) : (
                <span>Endereço sem Garantia Ativa</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {warrantyServices?.warranty ? (
              <div className="space-y-4">
                <WarrantyServicesTable 
                  services={warrantyServices.services || []}
                  warrantyId={warrantyServices.warranty.id}
                />

                {requestedServices && requestedServices.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <h3 className="text-sm font-medium mb-3">Serviços Solicitados</h3>
                      <WarrantyRequestedServicesTable services={requestedServices} />
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Este endereço não possui uma garantia ativa. Você pode cadastrar uma nova garantia para este endereço.
                </p>
                <Button size="sm">
                  Cadastrar Nova Garantia
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
