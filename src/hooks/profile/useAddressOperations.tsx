
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Address } from "@/types/address";

export const useAddressOperations = () => {
  const { toast } = useToast();

  const { data: addresses, isLoading: isLoadingAddress, refetch: refetchAddresses } = useQuery({
    queryKey: ["user-addresses"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order('is_primary', { ascending: false });

      if (error) {
        console.error("Error fetching addresses:", error);
        throw error;
      }

      console.log("User addresses:", data);
      return data as Address[];
    },
  });

  const setPrimaryAddress = useMutation({
    mutationFn: async (addressId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      await supabase
        .from("addresses")
        .update({ is_primary: false })
        .eq("user_id", user.id);

      const { error } = await supabase
        .from("addresses")
        .update({ is_primary: true })
        .eq("id", addressId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Endereço atualizado",
        description: "Endereço principal foi atualizado com sucesso.",
      });
      refetchAddresses();
    },
    onError: (error: Error) => {
      console.error("Error updating primary address:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar endereço",
        description: error.message,
      });
    },
  });

  return {
    addresses,
    isLoadingAddress,
    refetchAddresses,
    setPrimaryAddress
  };
};
