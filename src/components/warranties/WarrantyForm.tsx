import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AddressSelect } from "./AddressSelect";

interface WarrantyFormData {
  product_name: string;
  purchase_date: string;
  warranty_start: string;
  warranty_end: string;
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
          name="product_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Produto</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: iPhone 13" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="purchase_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data da Compra</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="warranty_start"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Início da Garantia</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="warranty_end"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fim da Garantia</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Solicitar Garantia
        </Button>
      </form>
    </Form>
  );
};