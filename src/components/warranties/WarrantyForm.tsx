import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { AddressSelect } from "./AddressSelect";
import { WarrantyTypeSelect } from "./WarrantyTypeSelect";

interface WarrantyFormData {
  warranty_type_id: string;
  address_id: string;
}

interface WarrantyFormProps {
  onSubmit: (data: WarrantyFormData) => void;
}

export const WarrantyForm = ({ onSubmit }: WarrantyFormProps) => {
  const form = useForm<WarrantyFormData>();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

        <Button type="submit" className="w-full">
          Solicitar Garantia
        </Button>
      </form>
    </Form>
  );
};