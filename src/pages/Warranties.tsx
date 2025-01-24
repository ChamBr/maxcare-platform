import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface WarrantyFormData {
  product_name: string;
  purchase_date: string;
  warranty_start: string;
  warranty_end: string;
}

const Warranties = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<WarrantyFormData>();

  const { data: warranties, refetch } = useQuery({
    queryKey: ["warranties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warranties")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const onSubmit = async (data: WarrantyFormData) => {
    try {
      const { error } = await supabase.from("warranties").insert({
        ...data,
        status: "active",
      });

      if (error) throw error;

      toast({
        title: "Garantia solicitada com sucesso",
        description: "Aguarde a aprovação da equipe.",
      });
      
      setOpen(false);
      form.reset();
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="product_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Produto</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: iPhone 13" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="purchase_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data da Compra</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="warranty_start"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Início da Garantia</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="warranty_end"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fim da Garantia</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Solicitar Garantia
                </Button>
              </form>
            </Form>
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