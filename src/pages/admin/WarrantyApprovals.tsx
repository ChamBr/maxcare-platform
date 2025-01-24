import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { WarrantyApprovalTable } from "@/components/warranties/WarrantyApprovalTable";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
          users (
            full_name,
            email
          ),
          addresses (
            street_address,
            city,
            state_code
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
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin" className="flex items-center gap-2">
              Admin
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Aprovação de Garantias
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold">Aprovação de Garantias</h1>
      
      <WarrantyApprovalTable
        warranties={warranties || []}
        onApprovalUpdate={refetch}
      />
    </div>
  );
};

export default WarrantyApprovals;