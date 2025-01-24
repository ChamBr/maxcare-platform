import { useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuthState } from "@/hooks/useAuthState";
import { WarrantyForm } from "@/components/warranties/WarrantyForm";
import { addDays, isAfter, isBefore, parseISO } from "date-fns";

const Warranties = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { session } = useAuthState();

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

      // Ordenar garantias por status e data de vencimento
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
          // Se mesmo status, ordenar por data de vencimento (mais distante primeiro)
          return new Date(b.warranty_end).getTime() - new Date(a.warranty_end).getTime();
        }

        return statusOrder[aStatus] - statusOrder[bStatus];
      });
    },
  });

  const getWarrantyStatus = (warranty) => {
    if (warranty.approval_status === "rejected") return "rejected";
    if (warranty.approval_status === "pending") return "pending";
    
    const today = new Date();
    const endDate = parseISO(warranty.warranty_end);
    const thirtyDaysFromNow = addDays(today, 30);

    if (isBefore(endDate, today)) return "expired";
    if (isBefore(endDate, thirtyDaysFromNow)) return "expiring";
    return "active";
  };

  const getStatusBadgeVariant = (status) => {
    const variants = {
      active: "green",
      expiring: "blue",
      expired: "red",
      pending: "purple",
      rejected: "red",
    };
    return variants[status];
  };

  const onSubmit = async (data: any) => {
    if (!session?.user?.id) {
      toast({
        title: "Erro ao solicitar garantia",
        description: "Você precisa estar logado para solicitar uma garantia.",
        variant: "destructive",
      });
      return;
    }

    try {
      const currentDate = new Date();
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

      const { error } = await supabase.from("warranties").insert({
        ...data,
        user_id: session.user.id,
        status: "active",
        approval_status: "pending",
        warranty_start: currentDate.toISOString(),
        warranty_end: oneYearFromNow.toISOString()
      });

      if (error) throw error;

      toast({
        title: "Garantia solicitada com sucesso",
        description: "Aguarde a aprovação da equipe.",
      });
      
      setOpen(false);
      refetch();
    } catch (error) {
      console.error("Erro ao solicitar garantia:", error);
      toast({
        title: "Erro ao solicitar garantia",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleRenewal = async (warrantyId: string) => {
    // Aqui você implementaria a lógica de renovação
    toast({
      title: "Solicitação de renovação enviada",
      description: "Nossa equipe irá analisar seu pedido em breve.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Minhas Garantias</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2" />
              Nova Garantia
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Solicitar Nova Garantia</DialogTitle>
            </DialogHeader>
            <WarrantyForm onSubmit={onSubmit} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {warranties?.map((warranty) => {
          const status = getWarrantyStatus(warranty);
          const showRenewalButton = ["expiring", "expired"].includes(status);

          return (
            <Card key={warranty.id} className="relative">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">{warranty.warranty_types?.name}</CardTitle>
                <Badge variant={getStatusBadgeVariant(status)} className="capitalize">
                  {status === "expiring" ? "Vencendo em breve" : status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Status de Aprovação:</strong>{" "}
                    <span className="capitalize">{warranty.approval_status}</span>
                  </p>
                  <p>
                    <strong>Endereço:</strong>{" "}
                    {warranty.addresses?.street_address}, {warranty.addresses?.city}, {warranty.addresses?.state_code}
                  </p>
                  {showRenewalButton && (
                    <Button
                      variant="outline"
                      className="mt-4 w-full"
                      onClick={() => handleRenewal(warranty.id)}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Solicitar Renovação
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Warranties;