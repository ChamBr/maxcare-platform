import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ServiceTypeField } from "./form/ServiceTypeField";
import { NotesField } from "./form/NotesField";

const formSchema = z.object({
  serviceType: z.string().min(1, "Por favor selecione um tipo de serviço"),
  notes: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

interface ServiceRequestFormProps {
  warrantyId: string;
  warrantyTypeId: string | null;
}

export const ServiceRequestForm = ({ warrantyId, warrantyTypeId }: ServiceRequestFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceType: "",
      notes: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Erro de Autenticação",
          description: "Por favor, faça login para solicitar um serviço.",
        });
        return;
      }

      const { error } = await supabase
        .from("services")
        .insert({
          user_id: user.id,
          warranty_id: warrantyId,
          service_type: values.serviceType,
          notes: values.notes,
          status: "pending",
        });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Sua solicitação de serviço foi enviada.",
      });
      
      navigate("/services");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao enviar solicitação de serviço. Por favor, tente novamente.",
      });
      console.error("Service request error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitar Novo Serviço</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ServiceTypeField form={form} isLoading={isLoading} />
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