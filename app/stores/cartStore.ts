import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { cartItem } from "../Interfaces/Interfaces";
import { usePopUpStore } from "./popUpStore";

interface CartState {
  cart: cartItem[];
}

interface CartActions {
  addToCart: (
    menuItemId: string,
    name: string,
    description: string,
    price: string,
    quantity: number
  ) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotal: () => number;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // State
      cart: [],

      // Actions
      getTotal: () => {
        return get().cart.reduce(
          (sum: number, item: cartItem) =>
            sum + item.menuItem.price * item.quantity,
          0
        );
      },

      // Actions
      addToCart: (
        menuItemId: string,
        name: string,
        description: string,
        price: string,
        quantity: number
      ) => {
        const { removePopUp } = usePopUpStore.getState();

        const cartItem: cartItem = {
          menuItem: {
            _id: menuItemId,
            name: name,
            price: parseFloat(price),
            description: description,
          },
          quantity: quantity,
        };

        set((state) => {
          const existingItemIndex = state.cart.findIndex(
            (item: cartItem) => item.menuItem._id === menuItemId
          );

          let newCart;
          if (existingItemIndex !== -1) {
            // Update quantity if item exists
            newCart = state.cart.map((item, index) =>
              index === existingItemIndex ? { ...item, quantity } : item
            );
          } else {
            // Add new item if it doesn't exist
            newCart = [...state.cart, cartItem];
          }
          return { cart: newCart };
        });

        removePopUp();
      },

      updateQuantity: (id: string, quantity: number) => {
        set((state) => ({
          cart: state.cart.map((item: cartItem) =>
            item.menuItem._id === id ? { ...item, quantity } : item
          ),
        }));
      },

      removeFromCart: (id: string) => {
        set((state) => ({
          cart: state.cart.filter((item: cartItem) => item.menuItem._id !== id),
        }));
      },

      clearCart: () => {
        set({ cart: [] });
      },
    }),
    {
      name: "cart-storage", // name of the item in localStorage
      partialize: (state) => ({ cart: state.cart }), // only persist cart, not functions
    }
  )
);
