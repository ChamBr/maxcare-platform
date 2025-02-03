
import { UserCircle, MapPin } from "lucide-react";
import { useState } from "react";
import type { Address } from "@/types/address";
import { ProfileSection } from "@/components/profile/ProfileSection";
import { AddressSection } from "@/components/profile/AddressSection";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { AddressDialog } from "@/components/profile/AddressDialog";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { useAuthState } from "@/hooks/useAuthState";
import { useProfileData } from "@/hooks/useProfileData";

interface HandleActionProps {
  address?: Address;
}

const Profile = () => {
  const { userRole } = useAuthState();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>();

  const {
    profile,
    addresses,
    isLoadingProfile,
    isLoadingAddress,
    updateProfile,
    setPrimaryAddress,
  } = useProfileData();

  const handleEditAddress = (address: Address) => {
    setSelectedAddress(address);
    setShowAddressForm(true);
  };

  const handleAddressFormSuccess = () => {
    setShowAddressForm(false);
    setSelectedAddress(undefined);
  };

  const handleAddressFormCancel = () => {
    setShowAddressForm(false);
    setSelectedAddress(undefined);
  };

  return (
    <div className="space-y-4">
      <ProfileHeader userRole={userRole} />

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
