
import { UserCircle, MapPin } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import type { Address } from "@/types/address";
import { ProfileSection } from "@/components/profile/ProfileSection";
import { AddressSection } from "@/components/profile/AddressSection";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { AddressForm } from "@/components/profile/AddressForm";
import { useAuthState } from "@/hooks/useAuthState";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { userRole } = useAuthState();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>();

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      console.log("Current user:", user);

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        throw error;
      }

      console.log("User profile:", data);
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

      if (error) {
        console.error("Error fetching addresses:", error);
        throw error;
      }

      console.log("User addresses:", data);
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
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });
    },
    onError: (error: Error) => {
      console.error("Error updating profile:", error);
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
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
      toast({
        title: "Endereço atualizado",
        description: "Endereço principal foi atualizado com sucesso.",
      });
    },
    onError: (error: Error) => {
      console.error("Error updating primary address:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar endereço",
        description: error.message,
      });
    },
  });

  const handleEditAddress = (address: Address) => {
    setSelectedAddress(address);
    setShowAddressForm(true);
  };

  const handleAddressFormSuccess = () => {
    setShowAddressForm(false);
    setSelectedAddress(undefined);
    queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
  };

  const handleAddressFormCancel = () => {
    setShowAddressForm(false);
    setSelectedAddress(undefined);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "dev":
        return "purple";
      case "admin":
        return "destructive";
      case "user":
        return "secondary";
      case "customer":
        return "blue";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-2xl font-bold">Perfil</h1>
        <Badge variant={getRoleBadgeVariant(userRole)}>{userRole}</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ProfileSection title="Informações Pessoais" icon={<UserCircle className="h-5 w-5" />}>
          <ProfileInfo
            profile={profile}
            isLoading={isLoadingProfile}
            onUpdate={(data) => updateProfile.mutate(data)}
          />
        </ProfileSection>

        <ProfileSection title="Endereços" icon={<MapPin className="h-5 w-5" />}>
          <AddressSection
            addresses={addresses}
            isLoading={isLoadingAddress}
            onEdit={handleEditAddress}
            onSetPrimary={(address) => setPrimaryAddress.mutate(address.id)}
            onAddNew={() => setShowAddressForm(true)}
          />
        </ProfileSection>
      </div>

      <Dialog open={showAddressForm} onOpenChange={setShowAddressForm}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[425px] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>{selectedAddress ? "Editar Endereço" : "Novo Endereço"}</DialogTitle>
          </DialogHeader>
          <AddressForm
            address={selectedAddress}
            onSuccess={handleAddressFormSuccess}
            onCancel={handleAddressFormCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
