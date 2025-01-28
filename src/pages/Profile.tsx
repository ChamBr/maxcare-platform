import { UserCircle, MapPin } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import type { Address } from "@/types/address";
import { ProfileSection } from "@/components/profile/ProfileSection";
import { AddressSection } from "@/components/profile/AddressSection";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { AddressForm } from "@/components/profile/AddressForm";

const Profile = () => {
  const { toast } = useToast();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>();

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
        title: "Profile updated",
        description: "Your information has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error updating profile",
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
        title: "Address updated",
        description: "Primary address has been updated successfully.",
      });
      refetchAddresses();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error updating address",
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
    refetchAddresses();
  };

  const handleAddressFormCancel = () => {
    setShowAddressForm(false);
    setSelectedAddress(undefined);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <ProfileSection title="Personal Information" icon={<UserCircle className="h-5 w-5" />}>
          <ProfileInfo
            profile={profile}
            isLoading={isLoadingProfile}
            onUpdate={(data) => updateProfile.mutate(data)}
          />
        </ProfileSection>

        <ProfileSection title="Addresses" icon={<MapPin className="h-5 w-5" />}>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedAddress ? "Edit Address" : "New Address"}</DialogTitle>
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
