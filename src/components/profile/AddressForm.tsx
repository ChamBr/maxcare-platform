import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Address } from "@/types/address";

const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' }
];

interface AddressFormProps {
  address?: Address;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AddressForm = ({ address, onSuccess, onCancel }: AddressFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    street_address: "",
    apt_suite_unit: "",
    city: "",
    state_code: "FL",
    zip_code: "",
    address_type: "home",
  });

  useEffect(() => {
    if (address) {
      setFormData({
        street_address: address.street_address,
        apt_suite_unit: address.apt_suite_unit || "",
        city: address.city,
        state_code: address.state_code,
        zip_code: address.zip_code,
        address_type: address.address_type,
      });
    }
  }, [address]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      if (address) {
        const { error } = await supabase
          .from("addresses")
          .update(formData)
          .eq("id", address.id);

        if (error) throw error;

        toast({
          title: "Address updated",
          description: "Your address has been updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from("addresses")
          .insert({
            ...formData,
            user_id: user.id,
            is_primary: false,
          });

        if (error) throw error;

        toast({
          title: "Address created",
          description: "Your address has been created successfully.",
        });
      }
      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Address Type</label>
        <Select
          value={formData.address_type}
          onValueChange={(value) => setFormData(prev => ({ ...prev, address_type: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="home">Home</SelectItem>
            <SelectItem value="business">Business</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Street Address</label>
        <Input
          value={formData.street_address}
          onChange={(e) => setFormData(prev => ({ ...prev, street_address: e.target.value }))}
          placeholder="Enter street name and number"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Apartment/Suite/Unit</label>
        <Input
          value={formData.apt_suite_unit}
          onChange={(e) => setFormData(prev => ({ ...prev, apt_suite_unit: e.target.value }))}
          placeholder="Apartment, suite, or unit number (optional)"
        />
      </div>

      <div>
        <label className="text-sm font-medium">City</label>
        <Input
          value={formData.city}
          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
          placeholder="Enter city name"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">State</label>
          <Select
            value={formData.state_code}
            onValueChange={(value) => setFormData(prev => ({ ...prev, state_code: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((state) => (
                <SelectItem key={state.code} value={state.code}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">ZIP Code</label>
          <Input
            value={formData.zip_code}
            onChange={(e) => setFormData(prev => ({ ...prev, zip_code: e.target.value }))}
            placeholder="Enter ZIP code"
            required
            maxLength={10}
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : address ? "Update" : "Save"}
        </Button>
      </div>
    </form>
  );
};