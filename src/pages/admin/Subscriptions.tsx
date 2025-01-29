import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Input } from "@/components/ui/input";
import { WarrantiesTable } from "@/components/admin/warranties/WarrantiesTable";
import { WarrantyDetails } from "@/components/admin/warranties/WarrantyDetails";

const Subscriptions = () => {
  const [search, setSearch] = useState("");
  const [selectedWarrantyId, setSelectedWarrantyId] = useState<string | null>(null);

  const { data: warranties, isLoading } = useQuery({
    queryKey: ["active-warranties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warranties")
        .select(`
          id,
          warranty_start,
          warranty_end,
          users!warranties_user_id_fkey (
            full_name,
            email
          ),
          warranty_types (
            name
          )
        `)
        .eq("status", "active")
        .eq("approval_status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredWarranties = warranties?.filter(warranty => 
    warranty.users?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    warranty.users?.email?.toLowerCase().includes(search.toLowerCase()) ||
    warranty.warranty_types?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return <PageWrapper>Carregando...</PageWrapper>;
  }

  return (
    <PageWrapper>
      <div className="space-y-6">
        {!selectedWarrantyId ? (
          <>
            <div className="mb-4">
              <Input
                placeholder="Buscar por nome do cliente, email ou tipo de garantia..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <WarrantiesTable 
              warranties={filteredWarranties || []} 
              onWarrantyClick={setSelectedWarrantyId}
            />
          </>
        ) : (
          <WarrantyDetails 
            warrantyId={selectedWarrantyId} 
            onBack={() => setSelectedWarrantyId(null)}
          />
        )}
      </div>
    </PageWrapper>
  );
};

export default Subscriptions;