
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, AlertCircle, XOctagon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Address {
  id: string;
  street_address: string;
  apt_suite_unit: string | null;
  city: string;
  state_code: string;
  has_active_warranty?: boolean;
  warranty_status?: string;
}

interface AddressListCardProps {
  addresses: Address[];
  selectedAddressId: string | null;
  onAddressSelect: (addressId: string) => void;
}

export const AddressListCard = ({ 
  addresses, 
  selectedAddressId, 
  onAddressSelect 
}: AddressListCardProps) => {
  const getWarrantyStatusBadge = (status: string | undefined) => {
    switch (status) {
      case 'approved':
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="success" className="h-5 w-5 p-0 flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Aprovado</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case 'pending':
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="blue" className="h-5 w-5 p-0 flex items-center justify-center">
                  <AlertCircle className="w-3 h-3" />
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Pendente</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case 'rejected':
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="red" className="h-5 w-5 p-0 flex items-center justify-center">
                  <XOctagon className="w-3 h-3" />
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Rejeitado</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="p-4">
        <CardTitle className="text-lg">Endereços</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-2 max-h-[150px] overflow-y-auto">
          {addresses?.map((address) => (
            <div
              key={address.id}
              className={cn(
                "p-2 rounded-md border cursor-pointer transition-colors",
                selectedAddressId === address.id ? "border-primary bg-primary/5" : "hover:bg-accent",
                "relative"
              )}
              onClick={() => onAddressSelect(address.id)}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 text-sm">
                  <p className="font-medium">
                    {address.street_address}
                    {address.apt_suite_unit && `, ${address.apt_suite_unit}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {address.city}, {address.state_code}
                  </p>
                </div>
                <div>
                  {address.warranty_status && getWarrantyStatusBadge(address.warranty_status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

