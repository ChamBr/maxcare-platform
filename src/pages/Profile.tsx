import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle, MapPin, AlertCircle } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AddressListItem } from "@/components/profile/AddressListItem";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { AddressForm } from "@/components/profile/AddressForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import type { Address } from "@/types/address";

const Profile = () => {
  const { toast } = useToast();
  const [showAddressForm, setShowAddressForm] = useState(false);

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

  const { data: addresses, isLoading: isLoadingAddress, refetch: refetchAddresses } = useQuery({
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
    mutationFn: async (data: any) => {
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
    },
    onError: (error: Error) => {
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

      await supabase
        .from("addresses")
        .update({ is_primary: false })
        .eq("user_id", user.id);

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
      refetchAddresses();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar endereço",
        description: error.message,
      });
    },
  });

  const handleEditAddress = (address: Address) => {
    // TODO: Implementar edição de endereço
    console.log("Edit address:", address);
  };

  const handleAddressFormSuccess = () => {
    setShowAddressForm(false);
    refetchAddresses();
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
            <ProfileInfo
              profile={profile}
              isLoading={isLoadingProfile}
              onUpdate={(data) => updateProfile.mutate(data)}
            />
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
                    onSetPrimary={(address) => setPrimaryAddress.mutate(address.id)}
                  />
                ))}
                <div className="pt-4">
                  <Button variant="outline" onClick={() => setShowAddressForm(true)}>
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
                <Button variant="outline" className="mt-4" onClick={() => setShowAddressForm(true)}>
                  Cadastrar Endereço
                </Button>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showAddressForm} onOpenChange={setShowAddressForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Endereço</DialogTitle>
          </DialogHeader>
          <AddressForm
            onSuccess={handleAddressFormSuccess}
            onCancel={() => setShowAddressForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
