import { PageWrapper } from "@/components/layout/PageWrapper";
import { Input } from "@/components/ui/input";
import { ServiceRequestsTable } from "@/components/admin/service-requests/ServiceRequestsTable";
import { useServiceRequests } from "@/hooks/admin/useServiceRequests";

const ServiceRequests = () => {
  const {
    isLoading,
    searchTerm,
    setSearchTerm,
    filteredRequests,
    handleStatusUpdate
  } = useServiceRequests();

  if (isLoading) {
    return <PageWrapper>Carregando...</PageWrapper>;
  }

  return (
    <PageWrapper title="Solicitações de Serviço">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Input
            placeholder="Buscar por nome, email ou tipo de serviço..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <ServiceRequestsTable
          requests={filteredRequests}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </PageWrapper>
  );
};

export default ServiceRequests;