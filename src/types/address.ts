export interface Address {
  id: string;
  user_id: string;
  street_address: string;
  apt_suite_unit?: string;
  city: string;
  state_code: string;
  zip_code: string;
  is_primary: boolean;
  address_type: 'home' | 'business';
  created_at: string;
  updated_at: string;
}