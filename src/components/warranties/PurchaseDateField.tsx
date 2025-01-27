import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PurchaseDateFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const PurchaseDateField = ({ value, onChange, disabled }: PurchaseDateFieldProps) => {
  return (
    <FormItem>
      <FormLabel>Data de Compra</FormLabel>
      <FormControl>
        <Input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};