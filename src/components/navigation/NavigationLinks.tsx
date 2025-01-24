import { NavigationButton } from "./NavigationButton";

interface NavigationLinksProps {
  isStaff: boolean;
}

export const NavigationLinks = ({ isStaff }: NavigationLinksProps) => {
  if (isStaff) {
    return (
      <>
        <NavigationButton to="/admin">Dashboard</NavigationButton>
        <NavigationButton to="/admin/users">Usuários</NavigationButton>
        <NavigationButton to="/admin/services">Serviços</NavigationButton>
        <NavigationButton to="/admin/notifications">Notificações</NavigationButton>
        <NavigationButton to="/admin/settings">Configurações</NavigationButton>
      </>
    );
  }

  return (
    <>
      <NavigationButton to="/warranties">My Warranties</NavigationButton>
      <NavigationButton to="/services">Request Service</NavigationButton>
    </>
  );
};