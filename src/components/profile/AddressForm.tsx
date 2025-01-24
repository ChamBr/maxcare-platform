import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AddressFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AddressForm = ({ onSuccess, onCancel }: AddressFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    street_address: "",
    apt_suite_unit: "",
    city: "",
    state_code: "",
    zip_code: "",
    address_type: "home",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não encontrado");

      const { error } = await supabase
        .from("addresses")
        .insert({
          ...formData,
          user_id: user.id,
          is_primary: false,
        });

      if (error) throw error;

      toast({
        title: "Endereço cadastrado",
        description: "Seu endereço foi cadastrado com sucesso.",
      });
      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar endereço",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Tipo de Endereço</label>
        <Select
          value={formData.address_type}
          onValueChange={(value) => setFormData(prev => ({ ...prev, address_type: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="home">Residencial</SelectItem>
            <SelectItem value="business">Comercial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Endereço</label>
        <Input
          value={formData.street_address}
          onChange={(e) => setFormData(prev => ({ ...prev, street_address: e.target.value }))}
          placeholder="Rua, número"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Complemento</label>
        <Input
          value={formData.apt_suite_unit}
          onChange={(e) => setFormData(prev => ({ ...prev, apt_suite_unit: e.target.value }))}
          placeholder="Apartamento, sala, etc."
        />
      </div>

      <div>
        <label className="text-sm font-medium">Cidade</label>
        <Input
          value={formData.city}
          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
          placeholder="Cidade"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Estado</label>
        <Input
          value={formData.state_code}
          onChange={(e) => setFormData(prev => ({ ...prev, state_code: e.target.value }))}
          placeholder="UF"
          required
          maxLength={2}
        />
      </div>

      <div>
        <label className="text-sm font-medium">CEP</label>
        <Input
          value={formData.zip_code}
          onChange={(e) => setFormData(prev => ({ ...prev, zip_code: e.target.value }))}
          placeholder="00000-000"
          required
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
};