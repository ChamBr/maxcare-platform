import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface WarrantyTypeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const WarrantyTypeSelect = ({ value, onValueChange }: WarrantyTypeSelectProps) => {
  const { data: warrantyTypes } = useQuery({
    queryKey: ["warranty-types"],
    queryFn: async () => {
      console.log("Buscando tipos de garantia...");
      const { data, error } = await supabase
        .from("warranty_types")
        .select("*")
        .eq("active", true)
        .order("name");

      if (error) {
        console.error("Erro ao buscar tipos de garantia:", error);
        throw error;
      }
      
      console.log("Tipos de garantia encontrados:", data);
      return data;
    },
  });

  return (
    <FormItem>
      <FormLabel>Tipo de Garantia</FormLabel>
      <FormControl>
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de garantia" />
          </SelectTrigger>
          <SelectContent>
            {warrantyTypes?.length === 0 && (
              <SelectItem value="" disabled>
                Nenhuma garantia disponível
              </SelectItem>
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