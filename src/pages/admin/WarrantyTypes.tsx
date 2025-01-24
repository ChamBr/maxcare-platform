import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Settings, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { WarrantyTypeForm } from "@/components/warranties/WarrantyTypeForm";
import { WarrantyTypeServices } from "@/components/warranties/WarrantyTypeServices";
import { Switch } from "@/components/ui/switch";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";

const WarrantyTypes = () => {
  const [selectedType, setSelectedType] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const { toast } = useToast();

  const { data: warrantyTypes, refetch } = useQuery({
    queryKey: ["warranty-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warranty_types")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (data: any) => {
    try {
      const { error } = await supabase
        .from("warranty_types")
        .upsert({
          id: selectedType?.id,
          ...data,
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Garantia ${selectedType ? "atualizada" : "criada"} com sucesso.`,
      });
      
      setIsFormOpen(false);
      setSelectedType(null);
      refetch();
    } catch (error) {
      console.error("Erro ao salvar garantia:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a garantia.",
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from("warranty_types")
        .update({ active: !currentActive })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Garantia ${!currentActive ? "ativada" : "desativada"} com sucesso.`,
      });
      
      refetch();
    } catch (error) {
      console.error("Erro ao atualizar status da garantia:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o status da garantia.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Início</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Garantias</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Garantias</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedType(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Garantia
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedType ? "Editar" : "Nova"} Garantia
              </DialogTitle>
            </DialogHeader>
            <WarrantyTypeForm 
              initialData={selectedType} 
              onSubmit={handleSubmit} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {warrantyTypes?.map((type) => (
          <Card key={type.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {type.name}
                {type.active ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
              </CardTitle>
              <div className="flex gap-2 items-center">
                <Switch
                  checked={type.active}
                  onCheckedChange={() => toggleActive(type.id, type.active)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedType(type);
                    setIsFormOpen(true);
                  }}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {type.description || "Sem descrição"}
              </p>
              <div className="mt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        setSelectedType(type);
                        setIsServicesOpen(true);
                      }}
                    >
                      Gerenciar Serviços
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Serviços da Garantia: {type.name}</DialogTitle>
                    </DialogHeader>
                    <WarrantyTypeServices warrantyTypeId={type.id} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WarrantyTypes;