import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const EmailConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const token = searchParams.get("token");
        const type = searchParams.get("type");

        if (!token || type !== "email_confirmation") {
          throw new Error("Link de confirmação inválido");
        }

        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: "email",
        });

        if (error) throw error;

        setIsSuccess(true);
        toast({
          title: "Email confirmado com sucesso!",
          description: "Agora você pode fazer login na sua conta.",
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro na confirmação",
          description: error.message || "Por favor, tente novamente.",
        });
      } finally {
        setIsVerifying(false);
      }
    };

    confirmEmail();
  }, [searchParams, toast]);

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Confirmação de Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          {isVerifying ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p>Verificando seu email...</p>
            </div>
          ) : isSuccess ? (
            <div className="space-y-4">
              <p className="text-green-600">
                Seu email foi confirmado com sucesso!
              </p>
              <Button onClick={() => navigate("/login")} className="w-full">
                Ir para o Login
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-red-600">
                Não foi possível confirmar seu email.
              </p>
              <Button onClick={() => navigate("/register")} className="w-full">
                Voltar para o Cadastro
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailConfirmation;