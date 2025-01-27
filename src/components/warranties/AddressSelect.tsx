import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import type { Address } from "@/types/address";

interface AddressSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export const AddressSelect = ({ value, onValueChange, disabled }: AddressSelectProps) => {
  const { data: addresses, isLoading } = useQuery({
    queryKey: ["available-addresses"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { data: userAddresses, error: addressError } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id);

      if (addressError) throw addressError;

      const { data: activeWarranties, error: warrantyError } = await supabase
        .from("warranties")
        .select("address_id")
        .eq("status", "active")
        .neq("approval_status", "rejected");

      if (warrantyError) throw warrantyError;

      const usedAddressIds = new Set(activeWarranties.map(w => w.address_id));
      const availableAddresses = userAddresses.filter(addr => !usedAddressIds.has(addr.id));

      return availableAddresses as Address[];
    },
  });

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  if (!addresses || addresses.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You need to register an address before requesting a warranty.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder="Select an address" />
      </SelectTrigger>
      <SelectContent>
        {addresses.map((address) => (
          <SelectItem key={address.id} value={address.id}>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>
                {address.street_address}
                {address.apt_suite_unit && `, ${address.apt_suite_unit}`}
                {` - ${address.city}, ${address.state_code}`}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};