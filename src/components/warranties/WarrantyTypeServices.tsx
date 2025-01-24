import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface WarrantyTypeServicesProps {
  warrantyTypeId: string;
}

export const WarrantyTypeServices = ({ warrantyTypeId }: WarrantyTypeServicesProps) => {
  const [selectedService, setSelectedService] = useState("");
  const [maxUses, setMaxUses] = useState("1");
  const { toast } = useToast();

  const { data: services } = useQuery({
    queryKey: ["warranty-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warranty_services")
        .select("*")
        .eq("active", true)
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const { data: typeServices, refetch } = useQuery({
    queryKey: ["warranty-type-services", warrantyTypeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warranty_type_services")
        .select(`
          id,
          max_uses,
          warranty_services (
            id,
            name,
            description
          )
        `)
        .eq("warranty_type_id", warrantyTypeId);

      if (error) throw error;
      return data;
    },
  });

  const handleAddService = async () => {
    if (!selectedService) {
      toast({
        title: "Erro",
        description: "Selecione um serviço",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("warranty_type_services")
        .insert({
          warranty_type_id: warrantyTypeId,
          warranty_service_id: selectedService,
          max_uses: parseInt(maxUses),
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Serviço adicionado com sucesso",
      });

      setSelectedService("");
      setMaxUses("1");
      refetch();
    } catch (error) {
      console.error("Erro ao adicionar serviço:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o serviço",
        variant: "destructive",
      });
    }
  };

  const handleRemoveService = async (serviceId: string) => {
    try {
      const { error } = await supabase
        .from("warranty_type_services")
        .delete()
        .eq("id", serviceId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Serviço removido com sucesso",
      });

      refetch();
    } catch (error) {
      console.error("Erro ao remover serviço:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao remover o serviço",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <Select value={selectedService} onValueChange={setSelectedService}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um serviço" />
            </SelectTrigger>
            <SelectContent>
              {services?.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-32">
          <Input
            type="number"
            min="1"
            value={maxUses}
            onChange={(e) => setMaxUses(e.target.value)}
            placeholder="Máx. Usos"
          />
        </div>
        <Button onClick={handleAddService}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar
        </Button>
      </div>

      <div className="space-y-4">
        {typeServices?.map((service) => (
          <div
            key={service.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <h4 className="font-medium">{service.warranty_services.name}</h4>
              <p className="text-sm text-muted-foreground">
                {service.warranty_services.description}
              </p>
              <p className="text-sm text-muted-foreground">
                Máximo de usos: {service.max_uses}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveService(service.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};