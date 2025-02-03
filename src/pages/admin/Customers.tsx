
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/components/admin/UsersTable";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { WarrantyDetails } from "@/components/admin/warranties/WarrantyDetails";

type WarrantyBase = {
  id: string;
  warranty_start: string;
  warranty_end: string;
  status: string;
  approval_status: string;
};

type CustomerWithWarranty = User & {
  has_active_warranty: boolean;
  active_warranties_count: number;
  addresses_count: number;
  warranties?: WarrantyBase[];
  phone?: string | null;
};

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [selectedWarrantyId, setSelectedWarrantyId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const { data: customers, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      // First get customer IDs
      const { data: customerIds } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "customer");

      if (!customerIds) return [];

      // Get customer details with warranties and addresses count
      const { data: users, error } = await supabase
        .from("users")
        .select(`
          *,
          warranties:warranties(
            id,
            warranty_start,
            warranty_end,
            status,
            approval_status
          ),
          addresses:addresses(count)
        `)
        .in("id", customerIds.map(row => row.user_id));

      if (error) throw error;

      return (users as any[]).map((user): CustomerWithWarranty => ({
        ...user,
        has_active_warranty: user.warranties?.some((w: WarrantyBase) => 
          w.status === 'active' && 
          w.approval_status === 'approved' &&
          new Date(w.warranty_end) > new Date()
        ) || false,
        active_warranties_count: user.warranties?.filter((w: WarrantyBase) =>
          w.status === 'active' && 
          w.approval_status === 'approved' &&
          new Date(w.warranty_end) > new Date()
        ).length || 0,
        addresses_count: user.addresses?.count || 0
      }));
    }
  });

  const filteredCustomers = customers?.filter(customer => {
    const matchesSearch = 
      customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterActive === null) return matchesSearch;
    return matchesSearch && customer.has_active_warranty === filterActive;
  });

  const handleViewDetails = (warrantyId: string) => {
    setSelectedWarrantyId(warrantyId);
    setSheetOpen(true);
  };

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Customers</h1>
        <Button>New Customer</Button>
      </div>

      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button 
          variant={filterActive === true ? "default" : "outline"}
          onClick={() => setFilterActive(filterActive === true ? null : true)}
        >
          Active Warranty
        </Button>
        <Button 
          variant={filterActive === false ? "default" : "outline"}
          onClick={() => setFilterActive(filterActive === false ? null : false)}
        >
          No Active Warranty
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Active Warranties</TableHead>
              <TableHead>Addresses</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers?.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.full_name || "N/A"}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone || "N/A"}</TableCell>
                <TableCell>{customer.active_warranties_count}</TableCell>
                <TableCell>{customer.addresses_count}</TableCell>
                <TableCell>
                  <Badge variant={customer.has_active_warranty ? "success" : "secondary"}>
                    {customer.has_active_warranty ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => customer.warranties?.[0]?.id && handleViewDetails(customer.warranties[0].id)}
                  >
                    View
                  </Button>
                  <Button size="sm">New Warranty</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[90vw] sm:max-w-[600px]">
          <SheetHeader>
            <SheetTitle>Customer Details</SheetTitle>
          </SheetHeader>
          {selectedWarrantyId && (
            <WarrantyDetails 
              warrantyId={selectedWarrantyId}
              onBack={() => setSheetOpen(false)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Customers;
