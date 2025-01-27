import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/hooks/use-service-request";

interface NotesFieldProps {
  form: UseFormReturn<FormValues>;
  isLoading: boolean;
}

export const NotesField = ({ form, isLoading }: NotesFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Observações Adicionais</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Descreva sua solicitação de serviço..."
              disabled={isLoading}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};