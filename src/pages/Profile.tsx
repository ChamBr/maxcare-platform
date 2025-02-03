
import { UserCircle, MapPin } from "lucide-react";
import { useState } from "react";
import type { Address } from "@/types/address";
import { ProfileSection } from "@/components/profile/ProfileSection";
import { AddressSection } from "@/components/profile/AddressSection";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { AddressDialog } from "@/components/profile/AddressDialog";
import { useAuthState } from "@/hooks/useAuthState";
import { useProfileOperations } from "@/hooks/profile/useProfileOperations";
import { useAddressOperations } from "@/hooks/profile/useAddressOperations";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const { userRole } = useAuthState();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>();

  const { profile, isLoadingProfile, updateProfile } = useProfileOperations();
  const { 
    addresses, 
    isLoadingAddress, 
    refetchAddresses, 
    setPrimaryAddress 
  } = useAddressOperations();

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

      <AddressDialog
        open={showAddressForm}
        onOpenChange={setShowAddressForm}
        selectedAddress={selectedAddress}
        onSuccess={handleAddressFormSuccess}
        onCancel={handleAddressFormCancel}
      />
    </div>
  );
};

export default Profile;
