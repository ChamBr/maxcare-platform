import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { History, Shield } from "lucide-react";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";

const RoleHistory = () => {
  const { data: logs, isLoading } = useQuery({
    queryKey: ["role-change-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("role_change_logs")
        .select(`
          id,
          old_role,
          new_role,
          created_at,
          users!role_change_logs_user_id_fkey (
            id,
            email,
            full_name
          ),
          changed_by:users!role_change_logs_changed_by_id_fkey (
            id,
            email,
            full_name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
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
              <History className="h-4 w-4" />
              Histórico de Alterações de Roles
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico de Alterações de Roles
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Carregando...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Role Anterior</TableHead>
                  <TableHead>Nova Role</TableHead>
                  <TableHead>Alterado Por</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs?.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {format(new Date(log.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      {log.users.full_name || log.users.email}
                    </TableCell>
                    <TableCell className="capitalize">{log.old_role}</TableCell>
                    <TableCell className="capitalize">{log.new_role}</TableCell>
                    <TableCell>
                      {log.changed_by.full_name || log.changed_by.email}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleHistory;