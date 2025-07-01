export const scrollToElement = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView();
  }
};

export interface ACI {
  auth: string;
  setAuth: (type: string) => void;
}

export interface PUCI {
  addPopUp: () => void;
  removePopUp: () => void;
}

export interface User {
  _id: string;
  id?: string; // For backward compatibility
  name: string;
  email: string;
  phone?: string;
  role: string;
}

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export interface MenuItem {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
}

export interface MenuItem2 {
  _id: string;
  name: string;
  description: string;
  price: number;
}

export interface cartItem {
  menuItem: MenuItem2;
  quantity: number;
}
