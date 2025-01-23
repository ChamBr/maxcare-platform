import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        let errorMessage = "Ocorreu um erro ao fazer login. Tente novamente.";
        
        // Parse the error body if it exists
        try {
          const errorBody = JSON.parse(error.message);
          if (errorBody.code === "email_not_confirmed") {
            errorMessage = "Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada.";
          }
        } catch {
          // If we can't parse the error body, use the error message directly
          errorMessage = error.message;
        }
        
        toast({
          variant: "destructive",
          title: "Erro ao fazer login",
          description: errorMessage,
        });
        throw error;
      }

      if (data.user) {
        toast({
          title: "Bem-vindo de volta!",
          description: "Login realizado com sucesso.",
        });
        navigate("/");
      }
    } catch (error: any) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Entre no MaxCare</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Senha</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
            <p className="text-center text-sm text-gray-600">
              Não tem uma conta?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-primary hover:underline"
                disabled={isLoading}
              >
                Cadastre-se
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;