import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface WarrantyTypeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export const WarrantyTypeSelect = ({ value, onValueChange, disabled }: WarrantyTypeSelectProps) => {
  const { data: warrantyTypes, isLoading } = useQuery({
    queryKey: ["warranty-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warranty_types")
        .select("*")
        .eq("active", true)
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  return (
    <FormItem>
      <FormLabel>Warranty Type</FormLabel>
      <FormControl>
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
          <SelectTrigger>
            <SelectValue placeholder="Select warranty type" />
          </SelectTrigger>
          <SelectContent>
            {!isLoading && warrantyTypes?.length === 0 && (
              <div className="p-2 text-sm text-muted-foreground text-center">
                No warranty types available
              </div>
            )}
            {warrantyTypes?.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};