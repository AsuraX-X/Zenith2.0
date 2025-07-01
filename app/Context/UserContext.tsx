import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { User, UserContextType } from "../components/general/General";

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Ensure we have the correct id field
        if (parsedUser._id && !parsedUser.id) {
          parsedUser.id = parsedUser._id;
        }
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const setUserWithStorage = (userData: User | null) => {
    if (userData) {
      // Ensure we have both _id and id for compatibility
      const userToStore = {
        ...userData,
        id: userData._id || userData.id,
      };
      localStorage.setItem("user", JSON.stringify(userToStore));
      setUser(userToStore);
    } else {
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser: setUserWithStorage }}>
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
