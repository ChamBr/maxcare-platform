
export const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case "dev":
      return "purple";
    case "admin":
      return "destructive";
    case "user":
      return "secondary";
    case "customer":
      return "blue";
    default:
      return "default";
  }
};
