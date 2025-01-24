import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus } from "lucide-react";
import { useAuthState } from "@/hooks/useAuthState";

const serviceRequestSchema = z.object({
  warranty_service_id: z.string({
    required_error: "Selecione um serviço",
  }),
});

type ServiceRequestData = z.infer<typeof serviceRequestSchema>;

interface ServiceRequestFormProps {
  warrantyId: string;
  warrantyTypeId: string | null;
}

export const ServiceRequestForm = ({ warrantyId, warrantyTypeId }: ServiceRequestFormProps) => {
  const { toast } = useToast();
  const { session } = useAuthState();
  const form = useForm<ServiceRequestData>({
    resolver: zodResolver(serviceRequestSchema),
  });

  const { data: availableServices, isLoading: isLoadingServices } = useQuery({
    queryKey: ["warranty-type-services", warrantyTypeId],
    queryFn: async () => {
      if (!warrantyTypeId) return [];

      const { data: typeServices, error } = await supabase
        .from("warranty_type_services")
        .select(`
          warranty_service_id,
          max_uses,
          warranty_services (
            id,
            name,
            description
          )
        `)
        .eq("warranty_type_id", warrantyTypeId);

      if (error) throw error;

      // Para cada serviço, verificar quantos usos ainda estão disponíveis
      const servicesWithUsage = await Promise.all(
        typeServices.map(async (typeService) => {
          const { data: canRequest } = await supabase
            .rpc("can_request_service", {
              p_warranty_id: warrantyId,
              p_warranty_service_id: typeService.warranty_service_id,
            });

          return {
            ...typeService,
            canRequest,
          };
        })
      );

      return servicesWithUsage;
    },
  });

  const onSubmit = async (data: ServiceRequestData) => {
    try {
      const { error } = await supabase
        .from("services")
        .insert({
          warranty_id: warrantyId,
          warranty_service_id: data.warranty_service_id,
          status: "pending",
          service_type: "warranty",
          user_id: session?.user.id,
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Serviço solicitado com sucesso",
      });

      form.reset();
    } catch (error) {
      console.error("Erro ao solicitar serviço:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao solicitar o serviço",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="warranty_service_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serviço</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isLoadingServices}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableServices?.map((service) => (
                      <SelectItem
                        key={service.warranty_services.id}
                        value={service.warranty_services.id}
                        disabled={!service.canRequest}
                      >
                        <div className="flex flex-col">
                          <span>{service.warranty_services.name}</span>
                          {!service.canRequest && (
                            <span className="text-xs text-muted-foreground">
                              Limite de usos atingido
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={!form.formState.isValid || form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Solicitar Serviço
        </Button>
      </form>
    </Form>
  );
};