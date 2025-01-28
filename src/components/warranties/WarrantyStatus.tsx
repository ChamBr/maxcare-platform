import { Badge } from "@/components/ui/badge";
import { addDays, isBefore, parseISO } from "date-fns";
import { Warranty } from "@/types/services";

interface WarrantyStatusProps {
  warranty: Warranty;
}

export const getWarrantyStatus = (warranty: Warranty) => {
  if (warranty.approval_status === "rejected") return "rejected";
  if (warranty.approval_status === "pending") return "pending";
  
  const today = new Date();
  const endDate = parseISO(warranty.warranty_end);
  const thirtyDaysFromNow = addDays(today, 30);

  if (isBefore(endDate, today)) return "expired";
  if (isBefore(endDate, thirtyDaysFromNow)) return "expiring";
  return "active";
};

export const getStatusBadgeVariant = (status: string) => {
  const variants = {
    active: "green",
    expiring: "blue",
    expired: "red",
    pending: "purple",
    rejected: "red",
  } as const;
  return variants[status as keyof typeof variants];
};

export const WarrantyStatus = ({ warranty }: WarrantyStatusProps) => {
  const status = getWarrantyStatus(warranty);
  
  return (
    <Badge variant={getStatusBadgeVariant(status)} className="capitalize">
      {status === "expiring" ? "Expiring Soon" : status}
    </Badge>
  );
};