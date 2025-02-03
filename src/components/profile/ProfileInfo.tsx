
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileInfoProps {
  profile: any;
  isLoading: boolean;
  onUpdate: (data: any) => void;
}

const formatPhoneNumber = (value: string) => {
  // Remove todos os caracteres não numéricos
  const numbers = value.replace(/\D/g, '');
  
  // Retorna vazio se não houver números
  if (numbers.length === 0) return '';
  
  // Aplica a máscara (XXX) XXX-XXXX
  if (numbers.length <= 3) return `(${numbers}`;
  if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
  return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
};

export const ProfileInfo = ({ profile, isLoading, onUpdate }: ProfileInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
  });

  const handleEdit = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
      });
    }
    setIsEditing(true);
  };

  const handleSave = () => {
    // Remove a formatação do telefone antes de salvar
    const dataToSave = {
      ...formData,
      phone: formData.phone.replace(/\D/g, '')
    };
    onUpdate(dataToSave);
    setIsEditing(false);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, phone: formattedPhone }));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-4 w-[180px]" />
      </div>
    );
  }

  return isEditing ? (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Name</label>
        <Input
          value={formData.full_name}
          onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
          placeholder="Your full name"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Phone</label>
        <Input
          value={formData.phone}
          onChange={handlePhoneChange}
          placeholder="(123) 456-7890"
          maxLength={14}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Email</label>
        <Input
          value={profile?.email}
          disabled
          className="bg-muted"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Email changes will be implemented soon.
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSave}>
          Save
        </Button>
        <Button variant="outline" onClick={() => setIsEditing(false)}>
          Cancel
        </Button>
      </div>
    </div>
  ) : (
    <div className="space-y-4">
      <p><strong>Name:</strong> {profile?.full_name || "Not informed"}</p>
      <p><strong>Email:</strong> {profile?.email}</p>
      <p><strong>Phone:</strong> {formatPhoneNumber(profile?.phone || "") || "Not informed"}</p>
      <Button onClick={handleEdit}>Edit Information</Button>
    </div>
  );
};
