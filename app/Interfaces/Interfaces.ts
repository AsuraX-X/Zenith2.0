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

export interface EditItem {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string | File;
}

export interface MenuItem2 {
  _id: string;
  name: string;
  description: string;
  price: number;
}

export interface OrderItem {
  menuItem: {
    _id: string;
    name: string;
  };
  quantity: number;
  _id?: string;
}

export interface Order {
  _id: string;
  contact: string;
  address: string;
  pending: string;
  confirmed: string;
  preparing: string;
  packing: string;
  outForDelivery: string;
  delivered: string;
  riderId?: {
    name: string;
    phone: string;
  };
  items: OrderItem[];
  [key: string]: unknown; // Allow dynamic property access
}

export interface cartItem {
  menuItem: MenuItem2;
  quantity: number;
}

export interface NewUser {
  name: string;
  password: string;
  phone: string;
  role: string;
}

export interface FormData {
  name: string;
  price: string;
  category: string;
  image: File | null;
}
