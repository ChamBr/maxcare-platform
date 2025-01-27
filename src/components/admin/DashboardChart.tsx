import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardChartProps {
  type: "warranties" | "services";
}

export const DashboardChart = ({ type }: DashboardChartProps) => {
  const { data, isLoading } = useQuery({
    queryKey: [`dashboard-chart-${type}`],
    queryFn: async () => {
      if (type === "warranties") {
        const { data } = await supabase
          .from("warranties")
          .select("status")
          .order("status");

        const counts: Record<string, number> = {};
        data?.forEach((item) => {
          counts[item.status] = (counts[item.status] || 0) + 1;
        });

        return Object.entries(counts).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
        }));
      } else {
        const { data } = await supabase
          .from("services")
          .select("created_at, status")
          .order("created_at");

        const counts: Record<string, number> = {};
        data?.forEach((item) => {
          const month = new Date(item.created_at).toLocaleString("en-US", {
            month: "short",
          });
          counts[month] = (counts[month] || 0) + 1;
        });

        return Object.entries(counts).map(([name, value]) => ({
          name,
          value,
        }));
      }
    },
  });

  if (isLoading) {
    return <Skeleton className="w-full h-[300px]" />;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};