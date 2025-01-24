import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { AddressSelect } from "./AddressSelect";
import { WarrantyTypeSelect } from "./WarrantyTypeSelect";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const warrantyFormSchema = z.object({
  warranty_type_id: z.string({
    required_error: "Selecione um tipo de garantia",
  }),
  address_id: z.string({
    required_error: "Selecione um endereço",
  }),
});

type WarrantyFormData = z.infer<typeof warrantyFormSchema>;

interface WarrantyFormProps {
  onSubmit: (data: WarrantyFormData) => void;
}

export const WarrantyForm = ({ onSubmit }: WarrantyFormProps) => {
  const form = useForm<WarrantyFormData>({
    resolver: zodResolver(warrantyFormSchema),
  });
  const currentDate = new Date();

  const { formState: { isValid, isSubmitting } } = form;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="text-sm text-muted-foreground mb-4">
          Solicitado em {format(currentDate, "PPP", { locale: ptBR })}
        </div>

        <FormField
          control={form.control}
          name="address_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <AddressSelect
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="warranty_type_id"
          render={({ field }) => (
            <WarrantyTypeSelect
              value={field.value}
              onValueChange={field.onChange}
            />
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={!isValid || isSubmitting}
        >
          Solicitar Garantia
        </Button>
      </form>
    </Form>
  );
};