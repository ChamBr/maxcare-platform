import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";

interface Warranty {
  id: string;
  created_at: string;
  warranty_start: string;
  warranty_end: string;
  status: string;
  users: {
    full_name: string;
    email: string;
  };
  addresses: {
    street_address: string;
    city: string;
    state_code: string;
  };
  warranty_types: {
    name: string;
  };
}

const Subscriptions = () => {
  const { data: warranties, isLoading } = useQuery({
    queryKey: ["active-warranties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warranties")
        .select(`
          id,
          created_at,
          warranty_start,
          warranty_end,
          status,
          users!warranties_user_id_fkey (
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
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Warranty[];
    },
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Admin
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Garantias Ativas
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShieldCheck className="h-6 w-6" />
          Garantias Ativas
        </h1>

        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {warranties?.map((warranty) => (
              <Card key={warranty.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{warranty.warranty_types.name}</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      Válida até: {new Date(warranty.warranty_end).toLocaleDateString('pt-BR')}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Cliente:</strong> {warranty.users.full_name}
                    </p>
                    <p>
                      <strong>Email:</strong> {warranty.users.email}
                    </p>
                    <p>
                      <strong>Endereço:</strong>{" "}
                      {warranty.addresses?.street_address}, {warranty.addresses?.city}, {warranty.addresses?.state_code}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscriptions;