import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface ProfileSectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}

export const ProfileSection = ({ title, icon, children }: ProfileSectionProps) => {
  return (
    <Card className="w-full">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">{children}</CardContent>
    </Card>
  );
};