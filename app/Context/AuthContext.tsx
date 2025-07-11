import { createContext, useContext, useState, type ReactNode } from "react";
import type { ACI } from "../Interfaces/Interfaces";

const AuthContext = createContext<null | ACI>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState("");

  return <AuthContext value={{ auth, setAuth }}>{children}</AuthContext>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("Auth context not provided");
  return context;
};
