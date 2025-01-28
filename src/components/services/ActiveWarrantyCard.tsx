import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Plus, CheckCircle2, Wrench } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ServiceRequestForm } from "./ServiceRequestForm";
import { WarrantyServicesTable } from "./WarrantyServicesTable";
import { WarrantyRequestedServicesTable } from "./WarrantyRequestedServicesTable";
import { Separator } from "@/components/ui/separator";
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
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-base md:text-lg">
            {warranty.warranty_types?.name}
          </CardTitle>
          <Badge variant="green" className="capitalize whitespace-nowrap">
            <ShieldCheck className="mr-1 h-3 w-3" />
            Ativa
          </Badge>
        </div>
        <CardDescription className="text-sm break-words">
          {warranty.addresses?.street_address}, {warranty.addresses?.city}, {warranty.addresses?.state_code}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Serviços Disponíveis */}
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            Serviços Disponíveis
          </h3>
          <div className="overflow-x-auto">
            <WarrantyServicesTable 
              services={getAvailableServicesForWarranty(warranty.warranty_type_id!)}
              warrantyId={warranty.id}
            />
          </div>
        </div>

        <Separator />

        {/* Serviços Solicitados */}
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Wrench className="h-4 w-4 flex-shrink-0" />
            Serviços Solicitados
          </h3>
          <div className="overflow-x-auto">
            <WarrantyRequestedServicesTable 
              services={services.filter(service => service.warranty_id === warranty.id)} 
            />
          </div>
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
          <DialogContent className="w-[95vw] max-w-lg">
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