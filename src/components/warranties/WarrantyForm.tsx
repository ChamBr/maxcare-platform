import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AddressSelect } from "./AddressSelect";
import { WarrantyTypeSelect } from "./WarrantyTypeSelect";

const WarrantyForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [addressId, setAddressId] = useState<string>("");
  const [warrantyTypeId, setWarrantyTypeId] = useState<string>("");
  const [purchaseDate, setPurchaseDate] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please sign in to request a warranty.",
        });
        return;
      }

      const { error } = await supabase
        .from("warranties")
        .insert({
          user_id: user.id,
          address_id: addressId,
          warranty_type_id: warrantyTypeId,
          purchase_date: purchaseDate,
          status: "pending",
          approval_status: "pending",
          warranty_start: new Date().toISOString(),
          warranty_end: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your warranty request has been submitted.",
      });
      
      navigate("/warranties");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit warranty request. Please try again.",
      });
      console.error("Warranty request error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request New Warranty</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Installation Address</label>
            <AddressSelect
              value={addressId}
              onValueChange={setAddressId}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Warranty Type</label>
            <WarrantyTypeSelect
              value={warrantyTypeId}
              onValueChange={setWarrantyTypeId}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Purchase Date</label>
            <Input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WarrantyForm;