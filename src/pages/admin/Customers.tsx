
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

type WarrantyBase = {
  id: string;
  warranty_start: string;
  warranty_end: string;
  status: string;
  approval_status: string;
};

type CustomerWithWarranty = User & {
  has_active_warranty: boolean;
  warranties_count: number;
  warranties?: WarrantyBase[];
  phone?: string | null;
};

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState<boolean | null>(null);

  const { data: customers, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
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
          )
        `)
        .in("id", (
          await supabase
            .from("user_roles")
            .select("user_id")
            .eq("role", "customer")
        ).data?.map(row => row.user_id) || []);

      if (error) throw error;

      return (users as any[]).map((user): CustomerWithWarranty => ({
        ...user,
        has_active_warranty: user.warranties?.some((w: WarrantyBase) => 
          w.status === 'active' && 
          w.approval_status === 'approved' &&
          new Date(w.warranty_end) > new Date()
        ) || false,
        warranties_count: user.warranties?.length || 0
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
              <TableHead>Warranties</TableHead>
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
                <TableCell>{customer.warranties_count}</TableCell>
                <TableCell>
                  <Badge variant={customer.has_active_warranty ? "success" : "secondary"}>
                    {customer.has_active_warranty ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="outline">View</Button>
                  <Button size="sm">New Warranty</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Customers;
