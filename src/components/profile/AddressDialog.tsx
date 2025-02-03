
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddressForm } from "@/components/profile/AddressForm";
import type { Address } from "@/types/address";

interface AddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAddress?: Address;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AddressDialog = ({
  open,
  onOpenChange,
  selectedAddress,
  onSuccess,
  onCancel
}: AddressDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[425px] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>{selectedAddress ? "Editar Endereço" : "Novo Endereço"}</DialogTitle>
        </DialogHeader>
        <AddressForm
          address={selectedAddress}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
};
