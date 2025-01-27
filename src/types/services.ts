import { Database } from "@/integrations/supabase/types";

type Tables = Database['public']['Tables'];

export interface Service extends Tables['services']['Row'] {
  warranty_services?: Tables['warranty_services']['Row'];
  warranties?: {
    id: string;
    warranty_types?: {
      name: string;
    };
  };
}

export interface Warranty extends Tables['warranties']['Row'] {
  warranty_types?: Tables['warranty_types']['Row'];
  addresses?: Tables['addresses']['Row'];
}