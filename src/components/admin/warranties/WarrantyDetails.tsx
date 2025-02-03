
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { CustomerInfoCard } from "./CustomerInfoCard";
import { AddressListCard } from "./AddressListCard";
import { ServicesSectionCard } from "./ServicesSectionCard";

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

      const { data: warranties, error: warrantiesError } = await supabase
        .from("warranties")
        .select("id, address_id, status, approval_status")
        .eq("user_id", customerData.user_id);

      if (warrantiesError) throw warrantiesError;

      return addressesData.map(address => ({
        ...address,
        has_active_warranty: warranties.some(w => 
          w.address_id === address.id && 
          w.status === 'active' && 
          w.approval_status === 'approved'
        ),
        warranty_status: warranties.find(w => w.address_id === address.id)?.approval_status
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
        <CustomerInfoCard customer={customerData?.users} />
        <AddressListCard 
          addresses={addresses || []}
          selectedAddressId={selectedAddressId}
          onAddressSelect={setSelectedAddressId}
        />
      </div>

      {/* Segunda linha: Serviços */}
      {selectedAddressId && (
        <ServicesSectionCard 
          warrantyServices={warrantyServices}
          requestedServices={requestedServices}
        />
      )}
    </div>
  );
};
