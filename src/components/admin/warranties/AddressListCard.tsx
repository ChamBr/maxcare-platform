
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Address {
  id: string;
  street_address: string;
  apt_suite_unit: string | null;
  city: string;
  state_code: string;
  has_active_warranty?: boolean;
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
                {address.has_active_warranty && (
                  <Badge variant="secondary" className="h-5 text-xs whitespace-nowrap">
                    Garantia Ativa
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
