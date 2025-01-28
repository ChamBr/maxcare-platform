import { useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuthState } from "@/hooks/useAuthState";
import WarrantyForm from "@/components/warranties/WarrantyForm";
import { addDays, isAfter, isBefore, parseISO } from "date-fns";
import { PageWrapper } from "@/components/layout/PageWrapper";

const Warranties = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { session } = useAuthState();

  const { data: warranties, refetch } = useQuery({
    queryKey: ["warranties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warranties")
        .select(`
          *,
          addresses(street_address, city, state_code),
          warranty_types(name)
        `)
        .order("warranty_end", { ascending: false });

      if (error) throw error;

      return data.sort((a, b) => {
        const statusOrder = {
          active: 0,
          pending: 1,
          rejected: 2,
          expired: 3,
        };

        const aStatus = getWarrantyStatus(a);
        const bStatus = getWarrantyStatus(b);

        if (aStatus === bStatus) {
          return new Date(b.warranty_end).getTime() - new Date(a.warranty_end).getTime();
        }

        return statusOrder[aStatus] - statusOrder[bStatus];
      });
    },
  });

  const getWarrantyStatus = (warranty) => {
    if (warranty.approval_status === "rejected") return "rejected";
    if (warranty.approval_status === "pending") return "pending";
    
    const today = new Date();
    const endDate = parseISO(warranty.warranty_end);
    const thirtyDaysFromNow = addDays(today, 30);

    if (isBefore(endDate, today)) return "expired";
    if (isBefore(endDate, thirtyDaysFromNow)) return "expiring";
    return "active";
  };

  const getStatusBadgeVariant = (status) => {
    const variants = {
      active: "green",
      expiring: "blue",
      expired: "red",
      pending: "purple",
      rejected: "red",
    };
    return variants[status];
  };

  const handleRenewal = async (warrantyId: string) => {
    toast({
      title: "Renewal Request Sent",
      description: "Our team will review your request soon.",
    });
  };

  const handleWarrantySuccess = () => {
    setOpen(false);
    refetch();
  };

  return (
    <PageWrapper showBreadcrumbs>
      <div className="flex items-center justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2" />
              New Warranty
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request New Warranty</DialogTitle>
            </DialogHeader>
            <WarrantyForm onSuccess={handleWarrantySuccess} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {warranties?.map((warranty) => {
          const status = getWarrantyStatus(warranty);
          const showRenewalButton = ["expiring", "expired"].includes(status);

          return (
            <Card key={warranty.id} className="relative">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">{warranty.warranty_types?.name}</CardTitle>
                <Badge variant={getStatusBadgeVariant(status)} className="capitalize">
                  {status === "expiring" ? "Expiring Soon" : status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Approval Status:</strong>{" "}
                    <span className="capitalize">{warranty.approval_status}</span>
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {warranty.addresses?.street_address}, {warranty.addresses?.city}, {warranty.addresses?.state_code}
                  </p>
                  {showRenewalButton && (
                    <Button
                      variant="outline"
                      className="mt-4 w-full"
                      onClick={() => handleRenewal(warranty.id)}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Request Renewal
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PageWrapper>
  );
};

export default Warranties;