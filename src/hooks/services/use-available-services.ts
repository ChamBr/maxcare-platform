import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAvailableServices = (warrantyId: string, warrantyTypeId: string | null) => {
  return useQuery({
    queryKey: ["available-services", warrantyId, warrantyTypeId],
    queryFn: async () => {
      const { data: typeServices, error: typeError } = await supabase
        .from('warranty_type_services')
        .select(`
          id,
          max_uses,
          warranty_services (
            id,
            name
          )
        `)
        .eq('warranty_type_id', warrantyTypeId);

      if (typeError) throw typeError;

      const { data: requestedServices, error: requestError } = await supabase
        .from('services')
        .select('warranty_service_id, status')
        .eq('warranty_id', warrantyId)
        .neq('status', 'cancelled');

      if (requestError) throw requestError;

      const serviceUsageCounts = requestedServices.reduce((acc: Record<string, number>, service) => {
        if (service.warranty_service_id) {
          acc[service.warranty_service_id] = (acc[service.warranty_service_id] || 0) + 1;
        }
        return acc;
      }, {});

      return typeServices.filter(typeService => {
        const usageCount = serviceUsageCounts[typeService.warranty_services.id] || 0;
        return usageCount < typeService.max_uses;
      });
    },
    enabled: !!warrantyTypeId,
  });
};