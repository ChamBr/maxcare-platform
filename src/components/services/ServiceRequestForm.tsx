import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ServiceTypeField } from "./form/ServiceTypeField";
import { NotesField } from "./form/NotesField";
import { useServiceRequest } from "@/hooks/use-service-request";
import type { FormValues } from "@/hooks/use-service-request";
import { useToast } from "@/components/ui/use-toast";

interface ServiceRequestFormProps {
  warrantyId: string;
  warrantyTypeId: string | null;
}

export const ServiceRequestForm = ({ warrantyId, warrantyTypeId }: ServiceRequestFormProps) => {
  const { toast } = useToast();
  const { isLoading, availableServices, onSubmit, formSchema } = useServiceRequest(warrantyId, warrantyTypeId);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceType: "",
      notes: "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      await onSubmit(values);
      form.reset();
      toast({
        title: "Success",
        description: "Service request submitted successfully!",
      });
    } catch (error) {
      console.error("Error submitting request:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to submit request. Please try again.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request New Service</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <ServiceTypeField 
              form={form} 
              isLoading={isLoading} 
              availableServices={availableServices}
            />
            <NotesField form={form} isLoading={isLoading} />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};