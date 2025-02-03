
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { WarrantyServicesTable } from "@/components/services/WarrantyServicesTable";
import { WarrantyRequestedServicesTable } from "@/components/services/WarrantyRequestedServicesTable";
import { Button } from "@/components/ui/button";
import { Service } from "@/types/services";

interface ServicesSectionCardProps {
  warrantyServices: {
    warranty: {
      id: string;
      warranty_types: {
        name: string;
      };
    };
    services: Array<{
      id: string;
      warranty_services: {
        id: string;
        name: string;
        description: string;
      };
      max_uses: number;
    }>;
  } | null;
  requestedServices: Service[] | undefined;
}

export const ServicesSectionCard = ({
  warrantyServices,
  requestedServices
}: ServicesSectionCardProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="p-4">
        <CardTitle className="text-lg flex items-center justify-between">
          {warrantyServices?.warranty ? (
            <>
              <span>Serviços Disponíveis</span>
              <Badge variant="outline" className="ml-2">
                {warrantyServices.warranty.warranty_types.name}
              </Badge>
            </>
          ) : (
            <span>Endereço sem Garantia Ativa</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {warrantyServices?.warranty ? (
          <div className="space-y-4">
            <WarrantyServicesTable 
              services={warrantyServices.services || []}
              warrantyId={warrantyServices.warranty.id}
            />

            {requestedServices && requestedServices.length > 0 && (
              <>
                <Separator className="my-4" />
                <div>
                  <h3 className="text-sm font-medium mb-3">Serviços Solicitados</h3>
                  <WarrantyRequestedServicesTable services={requestedServices} />
                </div>
              </>
            )}
          </div>
        ) : (
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Este endereço não possui uma garantia ativa. Você pode cadastrar uma nova garantia para este endereço.
            </p>
            <Button size="sm">
              Cadastrar Nova Garantia
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
