import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import type { FormValues } from "@/hooks/use-service-request";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface ServiceTypeFieldProps {
  form: UseFormReturn<FormValues>;
  isLoading: boolean;
  availableServices: Array<{
    warranty_services: {
      id: string;
      name: string;
    };
  }>;
}

export const ServiceTypeField = ({ form, isLoading, availableServices }: ServiceTypeFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="serviceType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Service Type</FormLabel>
          <FormControl>
            <Select
              disabled={isLoading}
              onValueChange={field.onChange}
              value={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                {availableServices.length > 0 ? (
                  availableServices.map((service) => (
                    <SelectItem 
                      key={service.warranty_services.id} 
                      value={service.warranty_services.id}
                    >
                      {service.warranty_services.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none text-muted-foreground">
                    No services available
                  </div>
                )}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};