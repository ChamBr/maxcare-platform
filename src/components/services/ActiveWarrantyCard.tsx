import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Plus, CheckCircle2, Wrench } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ServiceRequestForm } from "./ServiceRequestForm";
import { WarrantyServicesTable } from "./WarrantyServicesTable";
import { WarrantyRequestedServicesTable } from "./WarrantyRequestedServicesTable";
import { Separator } from "@/components/ui/separator";
import { format, parseISO } from "date-fns";
import { Service, Warranty } from "@/types/services";

interface ActiveWarrantyCardProps {
  warranty: Warranty;
  services: Service[];
  availableServices: any[];
}

export const ActiveWarrantyCard = ({ warranty, services, availableServices }: ActiveWarrantyCardProps) => {
  const getAvailableServicesForWarranty = (warrantyTypeId: string) => {
    return availableServices?.filter(service => service.warranty_type_id === warrantyTypeId) || [];
  };

  return (
    <Card key={warranty.id}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {warranty.warranty_types?.name}
          </CardTitle>
          <Badge variant="green" className="capitalize">
            <ShieldCheck className="mr-1 h-3 w-3" />
            Ativa
          </Badge>
        </div>
        <CardDescription>
          {warranty.addresses?.street_address}, {warranty.addresses?.city}, {warranty.addresses?.state_code}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Serviços Disponíveis */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Serviços Disponíveis
          </h3>
          <WarrantyServicesTable services={getAvailableServicesForWarranty(warranty.warranty_type_id!)} />
        </div>

        <Separator className="my-4" />

        {/* Serviços Solicitados */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Serviços Solicitados
          </h3>
          <WarrantyRequestedServicesTable 
            services={services.filter(service => service.warranty_id === warranty.id)} 
          />
        </div>
      </CardContent>

      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Solicitar Serviço
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Solicitar Serviço</DialogTitle>
            </DialogHeader>
            <ServiceRequestForm warrantyId={warranty.id} warrantyTypeId={warranty.warranty_type_id} />
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};