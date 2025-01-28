import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import type { FormValues } from "@/hooks/use-service-request";

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
          <FormLabel>Additional Notes</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Describe your service request..."
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