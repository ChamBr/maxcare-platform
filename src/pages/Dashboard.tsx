import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Package2, Wrench, Activity } from "lucide-react";
import { DashboardChart } from "@/components/admin/DashboardChart";

interface DashboardStats {
  totalCustomers: number;
  activeWarranties: number;
  pendingServices: number;
  recentActivities: number;
}

const Dashboard = () => {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [
        { count: customersCount },
        { count: warrantiesCount },
        { count: servicesCount },
      ] = await Promise.all([
        supabase
          .from("user_roles")
          .select("*", { count: "exact", head: true })
          .eq("role", "customer"),
        supabase
          .from("warranties")
          .select("*", { count: "exact", head: true })
          .eq("status", "active"),
        supabase
          .from("services")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
      ]);

      return {
        totalCustomers: customersCount || 0,
        activeWarranties: warrantiesCount || 0,
        pendingServices: servicesCount || 0,
        recentActivities: 0, // Implementar lógica de atividades recentes
      };
    },
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Clientes"
          value={stats?.totalCustomers}
          icon={Users}
          isLoading={isLoading}
        />
        <StatsCard
          title="Garantias Ativas"
          value={stats?.activeWarranties}
          icon={Package2}
          isLoading={isLoading}
        />
        <StatsCard
          title="Serviços Pendentes"
          value={stats?.pendingServices}
          icon={Wrench}
          isLoading={isLoading}
        />
        <StatsCard
          title="Atividades Recentes"
          value={stats?.recentActivities}
          icon={Activity}
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Garantias</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardChart type="warranties" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Serviços por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardChart type="services" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value?: number;
  icon: React.ElementType;
  isLoading: boolean;
}

const StatsCard = ({ title, value, icon: Icon, isLoading }: StatsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-7 w-20" />
        ) : (
          <div className="text-2xl font-bold">{value || 0}</div>
        )}
      </CardContent>
    </Card>
  );
};

export default Dashboard;