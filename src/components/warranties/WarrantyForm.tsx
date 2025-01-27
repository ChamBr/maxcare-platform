import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AddressSelect } from "./AddressSelect";
import { WarrantyTypeSelect } from "./WarrantyTypeSelect";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  addressId: z.string().min(1, "Por favor selecione um endereço"),
  warrantyTypeId: z.string().min(1, "Por favor selecione um tipo de garantia"),
  purchaseDate: z.string().min(1, "Por favor selecione a data de compra"),
});

type FormValues = z.infer<typeof formSchema>;

const WarrantyForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      addressId: "",
      warrantyTypeId: "",
      purchaseDate: "",
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
          description: "Por favor, faça login para solicitar uma garantia.",
        });
        return;
      }

      const { error } = await supabase
        .from("warranties")
        .insert({
          user_id: user.id,
          address_id: values.addressId,
          warranty_type_id: values.warrantyTypeId,
          purchase_date: values.purchaseDate,
          status: "inactive", // Alterado de "pending" para "inactive"
          approval_status: "pending",
          warranty_start: new Date().toISOString(),
          warranty_end: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()
        });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Sua solicitação de garantia foi enviada.",
      });
      
      navigate("/warranties");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao enviar solicitação de garantia. Por favor, tente novamente.",
      });
      console.error("Warranty request error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitar Nova Garantia</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <AddressSelect
                value={form.watch("addressId")}
                onValueChange={(value) => form.setValue("addressId", value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <WarrantyTypeSelect
                value={form.watch("warrantyTypeId")}
                onValueChange={(value) => form.setValue("warrantyTypeId", value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Input
                type="date"
                {...form.register("purchaseDate")}
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Enviando..." : "Enviar Solicitação"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default WarrantyForm;