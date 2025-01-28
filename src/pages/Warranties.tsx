import { useState } from "react";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import WarrantyForm from "@/components/warranties/WarrantyForm";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { WarrantyCard } from "@/components/warranties/WarrantyCard";
import { getWarrantyStatus } from "@/components/warranties/WarrantyStatus";

const Warranties = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

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
    <PageWrapper title="Warranties">
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
        {warranties?.map((warranty) => (
          <WarrantyCard
            key={warranty.id}
            warranty={warranty}
            onRenewal={handleRenewal}
          />
        ))}
      </div>
    </PageWrapper>
  );
};

export default Warranties;