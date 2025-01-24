import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { AddressSelect } from "./AddressSelect";
import { WarrantyTypeSelect } from "./WarrantyTypeSelect";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface WarrantyFormData {
  warranty_type_id: string;
  address_id: string;
  purchase_date: Date;
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

        <FormField
          control={form.control}
          name="purchase_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data da Compra</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("2000-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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