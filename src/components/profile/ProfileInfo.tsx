import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileInfoProps {
  profile: any;
  isLoading: boolean;
  onUpdate: (data: any) => void;
}

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
    onUpdate(formData);
    setIsEditing(false);
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
        <label className="text-sm font-medium">Nome</label>
        <Input
          value={formData.full_name}
          onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
          placeholder="Seu nome completo"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Telefone</label>
        <Input
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          placeholder="(00) 00000-0000"
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
          A alteração de email será implementada em breve.
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSave}>
          Salvar
        </Button>
        <Button variant="outline" onClick={() => setIsEditing(false)}>
          Cancelar
        </Button>
      </div>
    </div>
  ) : (
    <div className="space-y-4">
      <p><strong>Nome:</strong> {profile?.full_name || "Não informado"}</p>
      <p><strong>Email:</strong> {profile?.email}</p>
      <p><strong>Telefone:</strong> {profile?.phone || "Não informado"}</p>
      <Button onClick={handleEdit}>Editar Informações</Button>
    </div>
  );
};