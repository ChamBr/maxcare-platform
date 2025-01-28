import { RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WarrantyStatus, getWarrantyStatus } from "./WarrantyStatus";
import { Warranty } from "@/types/services";

interface WarrantyCardProps {
  warranty: Warranty;
  onRenewal: (warrantyId: string) => void;
}

export const WarrantyCard = ({ warranty, onRenewal }: WarrantyCardProps) => {
  const status = getWarrantyStatus(warranty);
  const showRenewalButton = ["expiring", "expired"].includes(status);

  return (
    <Card className="relative">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">{warranty.warranty_types?.name}</CardTitle>
        <WarrantyStatus warranty={warranty} />
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <p>
            <strong>Approval Status:</strong>{" "}
            <span className="capitalize">{warranty.approval_status}</span>
          </p>
          <p>
            <strong>Address:</strong>{" "}
            {warranty.addresses?.street_address}, {warranty.addresses?.city},{" "}
            {warranty.addresses?.state_code}
          </p>
          {showRenewalButton && (
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => onRenewal(warranty.id)}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Request Renewal
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};