import { createContext, useContext, useState, type ReactNode } from "react";

interface ACI {
  auth: string;
  setAuth: (type: string) => void;
}

const AuthContext = createContext<null | ACI>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState("");

  return <AuthContext value={{ auth, setAuth }}>{children}</AuthContext>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("Auth context not provided");
  return context;
};
