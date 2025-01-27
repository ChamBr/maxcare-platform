import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  return (
    <div className="rounded-md border min-w-[600px] md:min-w-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Serviço</TableHead>
            <TableHead className="whitespace-nowrap">Descrição</TableHead>
            <TableHead className="whitespace-nowrap">Usos Máximos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">{service.warranty_services.name}</TableCell>
              <TableCell>{service.warranty_services.description}</TableCell>
              <TableCell className="text-center">{service.max_uses}</TableCell>
            </TableRow>
          ))}
          {!services.length && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                Nenhum serviço disponível
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};