import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { cartItem } from "../components/general/General";
import { useAuthContext } from "./AuthContext";
import { useUser } from "./UserContext";
import { usePopUpContext } from "./PopUpContext";

interface CCI {
  cart: cartItem[];
  addToCart: (
    close: () => void,
    name: string,
    description: string,
    price: string,
    menuItemId: string,
    quantity: number
  ) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<undefined | CCI>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { setAuth } = useAuthContext();
  const { user } = useUser();
  const { addPopUp } = usePopUpContext();

  const [cart, setCart] = useState<cartItem[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const addToCart = (
    close: () => void,
    name: string,
    description: string,
    price: string,
    menuItemId: string,
    quantity: number
  ) => {
    // Check if user is signed in
    const storedUser =
      user || JSON.parse(localStorage.getItem("user") || "null");
    if (!storedUser) {
      setAuth("login");
      addPopUp();
      return;
    }
    const cartItem: cartItem = {
      menuItem: {
        _id: menuItemId,
        name: name,
        price: parseFloat(price),
        description: description,
      },
      quantity: quantity,
    };

    // Get existing cart from localStorage
    const existingCart = localStorage.getItem("cart");
    const cart = existingCart ? JSON.parse(existingCart) : [];

    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(
      (item: cartItem) => item.menuItem._id === menuItemId
    );

    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item if it doesn't exist
      cart.push(cartItem);
    }

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Show success message
    alert(`${quantity} ${quantity === 1 ? "item" : "items"} added to cart!`);

    // Close the popup
    close();
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const updateQuantity = (id: string, quantity: number) => {
    const updated = cart.map((item: cartItem) =>
      item.menuItem._id === id ? { ...item, quantity } : item
    );
    setCart(updated);
  };

  const removeFromCart = (id: string) => {
    const filtered = cart.filter((item: cartItem) => item.menuItem._id !== id);
    setCart(filtered);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const total = cart.reduce(
    (sum: number, item: cartItem) => sum + item.menuItem.price * item.quantity,
    0
  );

  return (
    <CartContext
      value={{
        cart,
        clearCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        total,
      }}
    >
      {children}
    </CartContext>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCartContext = () => {
  const context = useContext(CartContext);

  if (!context) throw new Error("Context not provided");

  return context;
};
