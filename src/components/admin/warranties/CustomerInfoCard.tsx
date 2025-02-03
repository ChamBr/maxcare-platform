
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomerInfoProps {
  customer: {
    id: string;
    full_name: string | null;
    email: string | null;
    phone: string | null;
  } | null;
}

export const CustomerInfoCard = ({ customer }: CustomerInfoProps) => {
  if (!customer) return null;

  return (
    <Card className="shadow-sm">
      <CardHeader className="p-4">
        <CardTitle className="text-lg">Informações do Cliente</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-2">
          <p className="font-medium">{customer.full_name}</p>
          <p className="text-sm text-muted-foreground">{customer.email}</p>
          <p className="text-sm text-muted-foreground">{customer.phone || "Não informado"}</p>
        </div>
      </CardContent>
    </Card>
  );
};
