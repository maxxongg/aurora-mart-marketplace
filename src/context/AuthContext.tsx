import { createContext, useContext, useState, ReactNode } from "react";
import { User, UserRole } from "@/types";
import { defaultUsers } from "@/data/defaults";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, _password: string) => {
    const found = defaultUsers.find((u) => u.email === email);
    if (found) {
      setUser(found);
      return true;
    }
    // Demo: allow any email to login as customer
    setUser({ id: "demo", name: email.split("@")[0], email, role: "customer", createdAt: new Date().toISOString() });
    return true;
  };

  const register = async (name: string, email: string, phone: string, _password: string) => {
    setUser({ id: "new-" + Date.now(), name, email, phone, role: "customer", createdAt: new Date().toISOString() });
    return true;
  };

  const logout = () => setUser(null);
  const isAuthenticated = !!user;
  const hasRole = (role: UserRole) => user?.role === role;

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}
