import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ServiceTypeField } from "./form/ServiceTypeField";
import { NotesField } from "./form/NotesField";
import { useServiceRequest } from "@/hooks/use-service-request";

interface ServiceRequestFormProps {
  warrantyId: string;
  warrantyTypeId: string | null;
}

export const ServiceRequestForm = ({ warrantyId, warrantyTypeId }: ServiceRequestFormProps) => {
  const { isLoading, availableServices, onSubmit, formSchema } = useServiceRequest(warrantyId, warrantyTypeId);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceType: "",
      notes: "",
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitar Novo Serviço</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ServiceTypeField 
              form={form} 
              isLoading={isLoading} 
              availableServices={availableServices}
            />
            <NotesField form={form} isLoading={isLoading} />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Enviando..." : "Enviar Solicitação"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};