import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["system-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_settings")
        .select("*");

      if (error) {
        toast.error("Erro ao carregar configurações");
        throw error;
      }

      return data.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, any>);
    },
  });

  const updateSettings = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const { error } = await supabase
        .from("system_settings")
        .update({ value })
        .eq("key", key);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-settings"] });
      toast.success("Configurações atualizadas com sucesso");
    },
    onError: () => {
      toast.error("Erro ao atualizar configurações");
    },
  });

  const handleFooterSettingsChange = (
    field: "enabled" | "left_text" | "right_link",
    value: any
  ) => {
    const currentSettings = settings?.footer_settings || {
      enabled: false,
      left_text: "alisson.ai",
      right_link: "https://www.alisson.ai",
    };

    updateSettings.mutate({
      key: "footer_settings",
      value: {
        ...currentSettings,
        [field]: value,
      },
    });
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  const footerSettings = settings?.footer_settings || {
    enabled: false,
    left_text: "alisson.ai",
    right_link: "https://www.alisson.ai",
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Configurações</h1>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="footer-enabled">Exibir Footer</Label>
                  <Switch
                    id="footer-enabled"
                    checked={footerSettings.enabled}
                    onCheckedChange={(checked) =>
                      handleFooterSettingsChange("enabled", checked)
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="footer-text">Texto do Footer</Label>
                  <Input
                    id="footer-text"
                    value={footerSettings.left_text}
                    onChange={(e) =>
                      handleFooterSettingsChange("left_text", e.target.value)
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="footer-link">Link do Footer</Label>
                  <Input
                    id="footer-link"
                    value={footerSettings.right_link}
                    onChange={(e) =>
                      handleFooterSettingsChange("right_link", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="notification-email">Email para Notificações</Label>
                <Input id="notification-email" type="email" />
              </div>
              <Button>Atualizar Configurações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="session-timeout">Tempo Limite da Sessão (minutos)</Label>
                <Input id="session-timeout" type="number" defaultValue="30" />
              </div>
              <Button>Salvar Configurações</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
