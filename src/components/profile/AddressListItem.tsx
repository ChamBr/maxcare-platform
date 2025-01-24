import { Address } from "@/types/address";
import { Building, Home, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AddressListItemProps {
  address: Address;
  isPrimary?: boolean;
  onEdit: (address: Address) => void;
  onSetPrimary: (address: Address) => void;
}

export const AddressListItem = ({
  address,
  isPrimary,
  onEdit,
  onSetPrimary,
}: AddressListItemProps) => {
  const getAddressIcon = () => {
    switch (address.address_type) {
      case "business":
        return <Building className="h-4 w-4" />;
      default:
        return <Home className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex items-center gap-4 py-2 group">
      <div className="flex items-center gap-2">
        {getAddressIcon()}
        {address.is_primary && (
          <ShieldCheck className="h-4 w-4 text-green-500" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm">
          {address.street_address}
          {address.apt_suite_unit && `, ${address.apt_suite_unit}`}
        </p>
        <p className="text-xs text-muted-foreground">
          {address.city}, {address.state_code} {address.zip_code}
        </p>
      </div>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(address)}
          className="h-8"
        >
          Editar
        </Button>
        {!isPrimary && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSetPrimary(address)}
            className="h-8"
          >
            Tornar Principal
          </Button>
        )}
      </div>
    </div>
  );
};