
import { Database } from "@/integrations/supabase/types";

type Tables = Database['public']['Tables'];

export interface Service {
  id: string;
  warranty_id: string;
  user_id: string;
  service_type: string;
  status: string;
  scheduled_date: string | null;
  completed_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  warranty_service_id: string | null;
  warranty_services?: {
    id: string;
    name: string;
    description: string | null;
    active: boolean | null;
    created_at: string;
    updated_at: string;
  };
  warranties?: {
    id: string;
    warranty_types?: {
      name: string;
    };
  };
  users?: {
    full_name: string | null;
    email: string | null;
  };
}

export interface Warranty {
  id: string;
  user_id: string;
  purchase_date: string | null;
  warranty_start: string;
  warranty_end: string;
  status: string;
  created_at: string;
  updated_at: string;
  approval_status: string;
  approved_by_id: string | null;
  approved_at: string | null;
  address_id: string | null;
  warranty_type_id: string | null;
  warranty_types?: {
    id: string;
    name: string;
    description: string | null;
    active: boolean | null;
    created_at: string;
    updated_at: string;
  };
  addresses?: {
    street_address: string;
    city: string;
    state_code: string;
  };
  users?: {
    full_name: string | null;
    email: string | null;
  };
}
