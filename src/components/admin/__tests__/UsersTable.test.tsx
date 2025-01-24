import { render, screen } from "@testing-library/react";
import { UsersTable, User, UserRole } from "../UsersTable";
import { useAuthState } from "@/hooks/useAuthState";
import userEvent from "@testing-library/user-event";

// Mock do hook useAuthState
jest.mock("@/hooks/useAuthState", () => ({
  useAuthState: jest.fn(),
}));

const mockUsers: User[] = [
  {
    id: "1",
    email: "dev@example.com",
    full_name: "Dev User",
    role: "dev" as UserRole,
  },
  {
    id: "2",
    email: "admin@example.com",
    full_name: "Admin User",
    role: "admin" as UserRole,
  },
  {
    id: "3",
    email: "user@example.com",
    full_name: "Regular User",
    role: "user" as UserRole,
  },
];

describe("UsersTable", () => {
  const mockOnRoleChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza a tabela com os usuários corretamente", () => {
    (useAuthState as jest.Mock).mockReturnValue({
      session: { user: { id: "4" } },
      userRole: "dev",
    });

    render(<UsersTable users={mockUsers} onRoleChange={mockOnRoleChange} />);

    expect(screen.getByText("Dev User")).toBeInTheDocument();
    expect(screen.getByText("Admin User")).toBeInTheDocument();
    expect(screen.getByText("Regular User")).toBeInTheDocument();
  });

  it("dev pode alterar qualquer role", () => {
    (useAuthState as jest.Mock).mockReturnValue({
      session: { user: { id: "4" } },
      userRole: "dev",
    });

    render(<UsersTable users={mockUsers} onRoleChange={mockOnRoleChange} />);

    const roleSelects = screen.queryAllByRole("combobox");
    expect(roleSelects).toHaveLength(mockUsers.length);
  });

  it("admin não pode alterar roles de dev e admin", () => {
    (useAuthState as jest.Mock).mockReturnValue({
      session: { user: { id: "4" } },
      userRole: "admin",
    });

    render(<UsersTable users={mockUsers} onRoleChange={mockOnRoleChange} />);

    const semPermissaoTexts = screen.getAllByText("Sem permissão");
    expect(semPermissaoTexts).toHaveLength(2); // Para dev e admin
  });

  it("usuário não pode alterar seu próprio role", () => {
    (useAuthState as jest.Mock).mockReturnValue({
      session: { user: { id: "1" } },
      userRole: "dev",
    });

    render(<UsersTable users={mockUsers} onRoleChange={mockOnRoleChange} />);

    const semPermissaoText = screen.getByText("Sem permissão");
    expect(semPermissaoText).toBeInTheDocument();
  });
});