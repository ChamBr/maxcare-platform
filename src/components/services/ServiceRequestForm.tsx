import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ServiceRequestForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [warrantyId, setWarrantyId] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please sign in to request a service.",
        });
        return;
      }

      const { error } = await supabase
        .from("services")
        .insert({
          user_id: user.id,
          warranty_id: warrantyId,
          service_type: serviceType,
          notes,
          status: "pending",
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your service request has been submitted.",
      });
      
      navigate("/services");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit service request. Please try again.",
      });
      console.error("Service request error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request New Service</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Warranty</label>
            <Select
              value={warrantyId}
              onValueChange={setWarrantyId}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a warranty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="warranty1">Warranty #1</SelectItem>
                <SelectItem value="warranty2">Warranty #2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Service Type</label>
            <Select
              value={serviceType}
              onValueChange={setServiceType}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="repair">Repair</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="inspection">Inspection</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Additional Notes</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe your service request..."
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
