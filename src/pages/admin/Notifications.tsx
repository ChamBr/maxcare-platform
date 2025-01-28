import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PageWrapper } from "@/components/layout/PageWrapper";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  users: {
    full_name: string;
    email: string;
  };
}

const Notifications = () => {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select(`
          id,
          title,
          message,
          read,
          created_at,
          users (
            full_name,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Notification[];
    },
  });

  return (
    <PageWrapper showBreadcrumbs>
      <h1 className="text-3xl font-bold mb-6">Notificações</h1>
      
      <div className="grid gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))
        ) : (
          notifications?.map((notification) => (
            <Card key={notification.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{notification.title}</CardTitle>
                  <Badge variant={notification.read ? "secondary" : "blue"}>
                    {notification.read ? "Lida" : "Não lida"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <p>{notification.message}</p>
                  <div className="text-sm text-muted-foreground">
                    <p>Para: {notification.users.full_name}</p>
                    <p>
                      Enviada em:{" "}
                      {format(new Date(notification.created_at), "PPP 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </PageWrapper>
  );
};

export default Notifications;