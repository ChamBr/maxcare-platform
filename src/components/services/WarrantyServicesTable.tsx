import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";

interface WarrantyServicesTableProps {
  services: Array<{
    id: string;
    warranty_services: {
      name: string;
      description: string;
    };
    max_uses: number;
  }>;
}

export const WarrantyServicesTable = ({ services }: WarrantyServicesTableProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Serviço</TableHead>
            {!isMobile && (
              <TableHead className="whitespace-nowrap">Descrição</TableHead>
            )}
            <TableHead className="whitespace-nowrap text-center">Disponível</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">{service.warranty_services.name}</TableCell>
              {!isMobile && (
                <TableCell>{service.warranty_services.description}</TableCell>
              )}
              <TableCell className="text-center">{`0/${service.max_uses}`}</TableCell>
            </TableRow>
          ))}
          {!services.length && (
            <TableRow>
              <TableCell colSpan={isMobile ? 2 : 3} className="text-center text-muted-foreground">
                Nenhum serviço disponível
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};