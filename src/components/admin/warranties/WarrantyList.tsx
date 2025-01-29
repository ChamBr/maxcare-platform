import { House, FileText } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Warranty {
  id: string;
  warranty_start: string;
  warranty_end: string;
  users: {
    full_name: string | null;
    email: string;
  } | null;
  warranty_types: {
    name: string;
  } | null;
}

interface WarrantyListProps {
  warranties: Warranty[];
  onWarrantyClick: (warrantyId: string) => void;
}

export const WarrantyList = ({ warranties, onWarrantyClick }: WarrantyListProps) => {
  const getWarrantyIcon = (warrantyName: string) => {
    return warrantyName.toLowerCase().includes('casa') ? 
      <House className="h-5 w-5" /> : 
      <FileText className="h-5 w-5" />;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {warranties.map((warranty) => (
        <Card 
          key={warranty.id}
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => onWarrantyClick(warranty.id)}
        >
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {warranty.warranty_types && getWarrantyIcon(warranty.warranty_types.name)}
                  <span className="font-medium">
                    {warranty.users?.full_name || warranty.users?.email}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {warranty.warranty_types?.name}
                </p>
                <p className="text-sm">
                  {format(parseISO(warranty.warranty_start), "dd/MM/yyyy")} - {format(parseISO(warranty.warranty_end), "dd/MM/yyyy")}
                </p>
              </div>
              <Button variant="ghost" size="sm">
                Ver detalhes
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};