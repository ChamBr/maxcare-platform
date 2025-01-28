import { Address } from "@/types/address";
import { Building, Home, ShieldCheck, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    <TooltipProvider>
      <div className="flex flex-row items-start gap-2 py-2 group">
        <div className="flex flex-col items-center gap-1 pt-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>{getAddressIcon()}</div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{address.address_type === "business" ? "Endereço comercial" : "Endereço residencial"}</p>
            </TooltipContent>
          </Tooltip>
          {address.is_primary && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Endereço principal</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm">
            {address.street_address}
            {address.apt_suite_unit && `, ${address.apt_suite_unit}`}
          </p>
          <p className="text-xs text-muted-foreground">
            {address.city}, {address.state_code} {address.zip_code}
          </p>
        </div>
        <div className="flex flex-row gap-2 items-center sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(address)}
            className="h-8"
          >
            Edit
          </Button>
          {!isPrimary && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSetPrimary(address)}
              className="h-8 whitespace-nowrap"
            >
              Set as Primary
            </Button>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};