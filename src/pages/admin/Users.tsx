import { useState } from "react";
import { UsersTable } from "@/components/admin/UsersTable";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { UserSearch } from "@/components/admin/UserSearch";
import { useUsersData } from "@/hooks/admin/useUsersData";

const Users = () => {
  const { users, isLoading, handleRoleChange } = useUsersData();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <PageWrapper>Carregando...</PageWrapper>;
  }

  return (
    <PageWrapper showBreadcrumbs>
      <div className="space-y-6">
        <UserSearch 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />
        <UsersTable 
          users={filteredUsers} 
          onRoleChange={handleRoleChange} 
        />
      </div>
    </PageWrapper>
  );
};

export default Users;