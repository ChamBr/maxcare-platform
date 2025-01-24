import { useState } from "react";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuthState } from "@/hooks/useAuthState";
import { WarrantyForm } from "@/components/warranties/WarrantyForm";

const Warranties = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { session } = useAuthState();

  const { data: warranties, refetch } = useQuery({
    queryKey: ["warranties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warranties")
        .select("*, addresses(street_address, city, state_code)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

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
      const { error } = await supabase.from("warranties").insert({
        ...data,
        user_id: session.user.id,
        status: "active",
        approval_status: "pending"
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
        {warranties?.map((warranty) => (
          <Card key={warranty.id}>
            <CardHeader>
              <CardTitle>{warranty.product_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="capitalize">{warranty.approval_status}</span>
                </p>
                <p>
                  <strong>Endereço:</strong>{" "}
                  {warranty.addresses?.street_address}, {warranty.addresses?.city}, {warranty.addresses?.state_code}
                </p>
                <p>
                  <strong>Data da Compra:</strong>{" "}
                  {new Date(warranty.purchase_date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Início da Garantia:</strong>{" "}
                  {new Date(warranty.warranty_start).toLocaleDateString()}
                </p>
                <p>
                  <strong>Fim da Garantia:</strong>{" "}
                  {new Date(warranty.warranty_end).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Warranties;