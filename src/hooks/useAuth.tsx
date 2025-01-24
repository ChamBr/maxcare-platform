import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthUser extends User {
  role?: 'customer' | 'admin' | 'dev';
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca o usuário atual
    supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
      if (authUser) {
        // Busca o papel do usuário
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', authUser.id)
          .single();

        setUser({
          ...authUser,
          role: roleData?.role || 'customer',
        });
      }
      setLoading(false);
    });

    // Inscreve para mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Busca o papel do usuário quando o estado de autenticação muda
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        setUser({
          ...session.user,
          role: roleData?.role || 'customer',
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return {
    user,
    loading,
    signOut,
  };
};