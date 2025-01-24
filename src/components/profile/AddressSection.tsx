import { MapPin, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AddressListItem } from "./AddressListItem";
import { Skeleton } from "@/components/ui/skeleton";
import type { Address } from "@/types/address";

interface AddressSectionProps {
  addresses: Address[] | undefined;
  isLoading: boolean;
  onEdit: (address: Address) => void;
  onSetPrimary: (address: Address) => void;
  onAddNew: () => void;
}

export const AddressSection = ({
  addresses,
  isLoading,
  onEdit,
  onSetPrimary,
  onAddNew,
}: AddressSectionProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
    );
  }

  if (!addresses || addresses.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You haven't added any addresses yet. Adding an address is important for managing your warranties.
        </AlertDescription>
        <Button variant="outline" className="mt-4" onClick={onAddNew}>
          Add Address
        </Button>
      </Alert>
    );
  }

  return (
    <div className="space-y-2 divide-y">
      {addresses.map((address) => (
        <AddressListItem
          key={address.id}
          address={address}
          isPrimary={address.is_primary}
          onEdit={onEdit}
          onSetPrimary={onSetPrimary}
        />
      ))}
      <div className="pt-4">
        <Button variant="outline" onClick={onAddNew}>
          Add New Address
        </Button>
      </div>
    </div>
  );
};