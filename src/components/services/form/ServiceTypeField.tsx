import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../ServiceRequestForm";

interface ServiceTypeFieldProps {
  form: UseFormReturn<FormValues>;
  isLoading: boolean;
}

export const ServiceTypeField = ({ form, isLoading }: ServiceTypeFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="serviceType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tipo de Serviço</FormLabel>
          <Select
            disabled={isLoading}
            onValueChange={field.onChange}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de serviço" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="repair">Reparo</SelectItem>
              <SelectItem value="maintenance">Manutenção</SelectItem>
              <SelectItem value="inspection">Inspeção</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};