import { useQuery } from "@tanstack/react-query";
import { Clock, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ActiveWarrantyCard } from "@/components/services/ActiveWarrantyCard";
import { isAfter, parseISO } from "date-fns";

const Services = () => {
  const { data: warranties } = useQuery({
    queryKey: ["active-warranties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warranties")
        .select(`
          *,
          warranty_types(
            id,
            name,
            description,
            active,
            created_at,
            updated_at
          ),
          addresses(street_address, city, state_code)
        `)
        .eq("status", "active")
        .eq("approval_status", "approved")
        .order("warranty_end", { ascending: false });

      if (error) throw error;

      return data.filter(warranty => {
        const endDate = parseISO(warranty.warranty_end);
        return isAfter(endDate, new Date());
      });
    },
  });

  const { data: services } = useQuery({
    queryKey: ["warranty-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select(`
          *,
          warranties (
            id,
            warranty_types (
              name
            )
          ),
          warranty_services (
            id,
            name,
            description,
            active,
            created_at,
            updated_at
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: availableServices } = useQuery({
    queryKey: ["available-warranty-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warranty_type_services")
        .select(`
          id,
          max_uses,
          warranty_type_id,
          warranty_services (
            id,
            name,
            description
          )
        `);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="grid gap-6">
      {/* Active Warranties Section */}
      <section>
        <div className="grid gap-4 md:grid-cols-2">
          {warranties?.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">
                  You don't have any active warranties at the moment.
                </p>
              </CardContent>
            </Card>
          )}

          {warranties?.map((warranty) => (
            <ActiveWarrantyCard
              key={warranty.id}
              warranty={warranty}
              services={services || []}
              availableServices={availableServices || []}
            />
          ))}
        </div>
      </section>

      {/* Individual Services Section */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5" />
              Coming Soon
            </CardTitle>
            <CardDescription>
              Soon you'll be able to request individual services, even without an active warranty.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button disabled className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Request Individual Service
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Services;
