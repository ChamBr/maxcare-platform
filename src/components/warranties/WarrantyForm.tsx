import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddressSelect } from "./AddressSelect";
import { WarrantyTypeSelect } from "./WarrantyTypeSelect";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  addressId: z.string().min(1, "Por favor selecione um endereço"),
  warrantyTypeId: z.string().min(1, "Por favor selecione um tipo de garantia"),
  purchaseDate: z.string().min(1, "Por favor selecione a data de compra"),
});

type FormValues = z.infer<typeof formSchema>;

interface WarrantyFormProps {
  onSuccess?: () => void;
}

const WarrantyForm = ({ onSuccess }: WarrantyFormProps) => {
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

      // Definindo as datas de início e fim da garantia
      const warrantyStart = new Date().toISOString().split('T')[0];
      const warrantyEnd = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];

      const { error } = await supabase
        .from("warranties")
        .insert({
          user_id: user.id,
          address_id: values.addressId,
          warranty_type_id: values.warrantyTypeId,
          purchase_date: values.purchaseDate,
          status: "active",
          approval_status: "pending",
          warranty_start: warrantyStart,
          warranty_end: warrantyEnd
        });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Sua solicitação de garantia foi enviada.",
      });
      
      onSuccess?.();
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
  );
};

export default WarrantyForm;