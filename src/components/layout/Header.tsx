import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export const Header = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  // Não renderiza o header se estivermos em qualquer rota administrativa
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold">MaxCare</span>
        </Link>

        <nav className="flex flex-1 items-center justify-end space-x-4">
          {user ? (
            <>
              <Link to="/warranties">
                <Button variant="ghost">Minhas Garantias</Button>
              </Link>
              <Link to="/services">
                <Button variant="ghost">Solicitar Serviço</Button>
              </Link>
              {(user.role === 'admin' || user.role === 'dev') && (
                <Link to="/admin">
                  <Button variant="ghost">Admin</Button>
                </Link>
              )}
              <Button variant="ghost" onClick={signOut}>
                Sair
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Entrar</Button>
              </Link>
              <Link to="/register">
                <Button variant="secondary">Cadastrar</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};