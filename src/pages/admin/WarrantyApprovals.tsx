import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { WarrantyApprovalTable } from "@/components/warranties/WarrantyApprovalTable";
import { Skeleton } from "@/components/ui/skeleton";
import { PageWrapper } from "@/components/layout/PageWrapper";

const WarrantyApprovals = () => {
  const { data: warranties, refetch, isLoading } = useQuery({
    queryKey: ["warranties-approval"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warranties")
        .select(`
          id,
          created_at,
          approval_status,
          users!warranties_user_id_fkey (
            full_name,
            email
          ),
          addresses (
            street_address,
            city,
            state_code,
            address_type
          ),
          warranty_types (
            name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <PageWrapper showBreadcrumbs>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper showBreadcrumbs>
      <h1 className="text-3xl font-bold mb-6">Aprovação de Garantias</h1>
      <WarrantyApprovalTable
        warranties={warranties || []}
        onApprovalUpdate={refetch}
      />
    </PageWrapper>
  );
};

export default WarrantyApprovals;