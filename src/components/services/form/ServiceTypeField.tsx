import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../ServiceRequestForm";

export const SERVICE_TYPES = {
  repair: "Reparo",
  maintenance: "Manutenção",
  inspection: "Inspeção"
} as const;

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
              {Object.entries(SERVICE_TYPES).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};