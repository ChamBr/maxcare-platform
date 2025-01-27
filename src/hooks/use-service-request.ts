import { useAvailableServices } from "./services/use-available-services";
import { useServiceSubmission } from "./services/use-service-submission";
import { serviceFormSchema, ServiceFormValues } from "./services/types";

export type { ServiceFormValues };

export const useServiceRequest = (warrantyId: string, warrantyTypeId: string | null) => {
  const { data: availableServices = [] } = useAvailableServices(warrantyId, warrantyTypeId);
  const { isLoading, onSubmit } = useServiceSubmission({ 
    warrantyId, 
    availableServices 
  });

  return {
    isLoading,
    availableServices,
    onSubmit,
    formSchema: serviceFormSchema,
  };
};