import { createContext, useContext, useState, ReactNode } from "react";
import { User, UserRole } from "@/types";
import { defaultUsers } from "@/data/defaults";

interface LoginResult {
  success: boolean;
  message?: string;
  role?: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, panel: "customer" | "seller") => Promise<LoginResult>;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, _password: string, panel: "customer" | "seller"): Promise<LoginResult> => {
    const found = defaultUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (panel === "customer") {
      // Customer panel: allow any email, but sellers/admins trying here get customer access
      if (found) {
        if (found.role === "admin" || found.role === "seller") {
          return { success: false, message: "This account requires the Seller/Admin login panel" };
        }
        setUser(found);
        return { success: true, role: found.role };
      }
      // Allow any email as demo customer
      const demoUser: User = { id: "demo-" + Date.now(), name: email.split("@")[0], email, role: "customer", createdAt: new Date().toISOString() };
      setUser(demoUser);
      return { success: true, role: "customer" };
    }

    if (panel === "seller") {
      // Seller panel: only allow seller or admin accounts
      if (found && (found.role === "seller" || found.role === "admin")) {
        setUser(found);
        return { success: true, role: found.role };
      }
      if (found && found.role === "customer") {
        return { success: false, message: "This is a customer account. Please use the Customer login panel." };
      }
      return { success: false, message: "No seller/admin account found with this email" };
    }

    return { success: false, message: "Invalid login" };
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
