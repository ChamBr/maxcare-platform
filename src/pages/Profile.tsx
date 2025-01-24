import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle, MapPin, AlertCircle } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AddressListItem } from "@/components/profile/AddressListItem";
import type { Address } from "@/types/address";

const Profile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
  });

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: addresses, isLoading: isLoadingAddress } = useQuery({
    queryKey: ["user-addresses"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order('is_primary', { ascending: false });

      if (error) throw error;
      return data as Address[];
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { error } = await supabase
        .from("users")
        .update(data)
        .eq("id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar perfil",
        description: error.message,
      });
    },
  });

  const setPrimaryAddress = useMutation({
    mutationFn: async (addressId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      // Primeiro, remove o status primário de todos os endereços
      await supabase
        .from("addresses")
        .update({ is_primary: false })
        .eq("user_id", user.id);

      // Depois, define o novo endereço primário
      const { error } = await supabase
        .from("addresses")
        .update({ is_primary: true })
        .eq("id", addressId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Endereço atualizado",
        description: "O endereço principal foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar endereço",
        description: error.message,
      });
    },
  });

  const handleEdit = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
      });
    }
    setIsEditing(true);
  };

  const handleSave = () => {
    updateProfile.mutate(formData);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleEditAddress = (address: Address) => {
    // TODO: Implementar edição de endereço
    console.log("Edit address:", address);
  };

  const handleSetPrimaryAddress = (address: Address) => {
    setPrimaryAddress.mutate(address.id);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <UserCircle className="h-8 w-8" />
        Meu Perfil
      </h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingProfile ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[180px]" />
              </div>
            ) : isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nome</label>
                  <Input
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Seu nome completo"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Telefone</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(123) 456-7890"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    value={profile?.email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    A alteração de email será implementada em breve.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={updateProfile.isPending}>
                    {updateProfile.isPending ? "Salvando..." : "Salvar"}
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p><strong>Nome:</strong> {profile?.full_name || "Não informado"}</p>
                <p><strong>Email:</strong> {profile?.email}</p>
                <p><strong>Telefone:</strong> {profile?.phone || "Não informado"}</p>
                <Button onClick={handleEdit}>Editar Informações</Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Endereços
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingAddress ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            ) : addresses && addresses.length > 0 ? (
              <div className="space-y-2 divide-y">
                {addresses.map((address) => (
                  <AddressListItem
                    key={address.id}
                    address={address}
                    isPrimary={address.is_primary}
                    onEdit={handleEditAddress}
                    onSetPrimary={handleSetPrimaryAddress}
                  />
                ))}
                <div className="pt-4">
                  <Button variant="outline">
                    Adicionar Novo Endereço
                  </Button>
                </div>
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Você ainda não cadastrou um endereço. O cadastro de endereço é importante para o gerenciamento das suas garantias.
                </AlertDescription>
                <Button variant="outline" className="mt-4">
                  Cadastrar Endereço
                </Button>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;