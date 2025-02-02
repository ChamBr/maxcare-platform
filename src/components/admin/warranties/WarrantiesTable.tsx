
import { useState } from "react";
import { Download, ArrowUp, ArrowDown } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Warranty } from "@/types/services";

interface WarrantiesTableProps {
  warranties: Warranty[];
  onWarrantyClick: (warrantyId: string) => void;
}

type SortField = 'name' | 'email' | 'type' | 'validity';
type SortOrder = 'asc' | 'desc';

export const WarrantiesTable = ({ warranties, onWarrantyClick }: WarrantiesTableProps) => {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortedWarranties = () => {
    return [...warranties].sort((a, b) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      
      switch (sortField) {
        case 'name':
          return multiplier * ((a.users?.full_name || a.users?.email || '').localeCompare(b.users?.full_name || b.users?.email || ''));
        case 'email':
          return multiplier * ((a.users?.email || '').localeCompare(b.users?.email || ''));
        case 'type':
          return multiplier * ((a.warranty_types?.name || '').localeCompare(b.warranty_types?.name || ''));
        case 'validity':
          return multiplier * (new Date(a.warranty_start).getTime() - new Date(b.warranty_start).getTime());
        default:
          return 0;
      }
    });
  };

  const handleExport = () => {
    const headers = ['Nome', 'Email', 'Tipo de Garantia', 'Vigência'];
    const data = getSortedWarranties().map(warranty => [
      warranty.users?.full_name || warranty.users?.email || '',
      warranty.users?.email || '',
      warranty.warranty_types?.name || '',
      `${format(parseISO(warranty.warranty_start), "dd/MM/yyyy")} -> ${format(parseISO(warranty.warranty_end), "dd/MM/yyyy")}`
    ]);

    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `garantias_${format(new Date(), 'dd-MM-yyyy')}.csv`;
    link.click();
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (field !== sortField) return null;
    return sortOrder === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead 
            className="cursor-pointer"
            onClick={() => handleSort('name')}
          >
            <div className="flex items-center">
              Nome <SortIcon field="name" />
            </div>
          </TableHead>
          <TableHead 
            className="cursor-pointer"
            onClick={() => handleSort('email')}
          >
            <div className="flex items-center">
              Email <SortIcon field="email" />
            </div>
          </TableHead>
          <TableHead 
            className="cursor-pointer"
            onClick={() => handleSort('type')}
          >
            <div className="flex items-center">
              Tipo de Garantia <SortIcon field="type" />
            </div>
          </TableHead>
          <TableHead 
            className="cursor-pointer"
            onClick={() => handleSort('validity')}
          >
            <div className="flex items-center">
              Vigência <SortIcon field="validity" />
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {getSortedWarranties().map((warranty) => (
          <TableRow
            key={warranty.id}
            className="cursor-pointer hover:bg-accent/50"
            onClick={() => onWarrantyClick(warranty.id)}
          >
            <TableCell>{warranty.users?.full_name || warranty.users?.email}</TableCell>
            <TableCell>{warranty.users?.email}</TableCell>
            <TableCell>{warranty.warranty_types?.name}</TableCell>
            <TableCell>
              {format(parseISO(warranty.warranty_start), "dd/MM/yyyy")} {"->"} {format(parseISO(warranty.warranty_end), "dd/MM/yyyy")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
