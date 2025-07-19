import { create } from "zustand";
import type {
  EditItem,
  FormData,
  MenuItem,
  NewUser,
  Order,
} from "../Interfaces/Interfaces";

interface adminState {
  newUser: NewUser;
  message: string;
  formData: FormData;
  editItem: EditItem | null;
  filter: string[];
  categories: string[];
  menuItems: MenuItem[];
  uniqueCategories: string[];
  activeOrders: Order[];
  finishedOrders: Order[];
}

interface adminActions {
  // Menu management
  refreshMenu: () => Promise<void>;
  addFilter: (fil: string) => void;
  
  // User management
  setNewUser: (user: NewUser) => void;
  handleCreateUser: () => Promise<void>;
  
  // Item management
  handleEditItem: (item: MenuItem | null) => void;
  handleDeleteItem: (id: string) => Promise<void>;
  handleUpdateItem: () => Promise<void>;
  handleChangeEdit: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeMenu: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  
  // Orders management
  setActiveOrders: (orders: Order[]) => void;
  setFinishedOrders: (orders: Order[]) => void;
  fetchOrders: () => Promise<void>;
  
  // Utility
  setMessage: (message: string) => void;
}

type adminStore = adminState & adminActions;

export const useAdminStore = create<adminStore>((set, get) => ({
  // Initial state
  newUser: {
    name: "",
    password: "",
    phone: "",
    role: "rider",
  },
  message: "",
  formData: {
    name: "",
    price: "",
    category: "",
    image: null,
  },
  editItem: null,
  filter: [],
  categories: [],
  menuItems: [],
  uniqueCategories: [],
  activeOrders: [],
  finishedOrders: [],

  // Menu management
  refreshMenu: async () => {
    try {
      const res = await fetch("/api/menu");
      const data = await res.json();
      const uniqueTypes = Array.from(
        new Set(data.map((item: MenuItem) => item.category))
      ) as string[];
      
      set(() => ({
        menuItems: data,
        categories: uniqueTypes,
        uniqueCategories: uniqueTypes,
      }));
    } catch (error) {
      console.error("Failed to refresh menu:", error);
      set(() => ({ message: "Failed to load menu items" }));
    }
  },

  addFilter: (fil: string) => {
    const { filter, categories } = get();
    let newFilter: string[];
    
    if (filter.includes(fil)) {
      newFilter = filter.filter((item) => fil !== item);
    } else {
      newFilter = [...filter, fil];
    }
    
    set(() => ({
      filter: newFilter,
      uniqueCategories: newFilter.length > 0 ? newFilter : categories,
    }));
  },

  // User management
  setNewUser: (user: NewUser) => {
    set(() => ({ newUser: user }));
  },

  handleCreateUser: async () => {
    const { newUser } = get();
    
    if (!newUser.name || !newUser.password || !newUser.role) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const data = await res.json();
      if (data.success) {
        alert(`${newUser.role} created successfully`);
        set(() => ({
          newUser: { name: "", password: "", phone: "", role: "rider" },
        }));
      } else {
        alert("Creation failed: " + data.error);
      }
    } catch (err) {
      console.error("Create user error:", err);
      alert("Request failed");
    }
  },

  // Item management
  handleEditItem: (item: MenuItem | null) => {
    set(() => ({ editItem: item }));
  },

  handleDeleteItem: async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    
    try {
      const res = await fetch(`/api/admin/delete-menu-item/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      
      if (result.success) {
        alert("Item deleted");
        get().refreshMenu();
      } else {
        alert("Failed to delete");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed");
    }
  },

  handleUpdateItem: async () => {
    const { editItem } = get();
    if (!editItem) return;

    try {
      if (!editItem.name || !editItem.price || !editItem.category) {
        alert("Please fill all fields");
        return;
      }

      // Helper function for base64 conversion
      const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
      };

      const imageBase64 =
        editItem.image && editItem.image instanceof File
          ? await convertToBase64(editItem.image)
          : editItem.image || "";

      const res = await fetch(`/api/admin/update-menu-item/${editItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editItem.name,
          price: parseFloat(editItem.price.toString()),
          category: editItem.category,
          imageBase64,
        }),
      });

      const result = await res.json();
      if (result.success) {
        alert("Item updated");
        set(() => ({ editItem: null }));
        get().refreshMenu();
      } else {
        alert("Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Update failed");
    }
  },

  handleChangeEdit: (e: React.ChangeEvent<HTMLInputElement>) => {
    const { editItem } = get();
    if (!editItem) return;

    const { name, value, files } = e.target;
    if (name === "image" && files) {
      set(() => ({ editItem: { ...editItem, image: files[0] } }));
    } else {
      set(() => ({ editItem: { ...editItem, [name]: value } }));
    }
  },

  handleChangeMenu: (e: React.ChangeEvent<HTMLInputElement>) => {
    const { formData } = get();
    const { name, value, files } = e.target;
    
    if (name === "image" && files) {
      set(() => ({ formData: { ...formData, image: files[0] } }));
    } else {
      set(() => ({ formData: { ...formData, [name]: value } }));
    }
  },

  handleSubmit: async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { formData } = get();

    if (!formData.name || !formData.price || !formData.category) {
      set(() => ({ message: "All fields except image are required." }));
      return;
    }

    // Helper function for base64 conversion
    const convertToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });
    };

    let imageBase64 = "";
    if (formData.image) {
      imageBase64 = await convertToBase64(formData.image);
    }

    try {
      const res = await fetch("/api/admin/create-menu-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
          category: formData.category,
          ...(imageBase64 && { imageBase64 }),
        }),
      });

      const result = await res.json();
      if (result.success) {
        set(() => ({
          message: "Menu item created successfully!",
          formData: { name: "", price: "", category: "", image: null },
        }));
        get().refreshMenu();
      } else {
        set(() => ({ message: "Error: " + result.error }));
      }
    } catch (err) {
      console.error(err);
      set(() => ({ message: "Failed to create menu item" }));
    }
  },

  // Orders management
  setActiveOrders: (orders: Order[]) => {
    set(() => ({ activeOrders: orders }));
  },

  setFinishedOrders: (orders: Order[]) => {
    set(() => ({ finishedOrders: orders }));
  },

  fetchOrders: async () => {
    try {
      const [activeRes, finishedRes] = await Promise.all([
        fetch("/api/admin/orders"),
        fetch("/api/admin/finished-orders"),
      ]);

      const activeData = await activeRes.json();
      const finishedData = await finishedRes.json();

      console.log("Active orders data:", activeData);
      console.log("Finished orders data:", finishedData);

      set(() => ({
        activeOrders: Array.isArray(activeData) ? activeData : [],
        finishedOrders: Array.isArray(finishedData) ? finishedData : [],
      }));
    } catch (err) {
      console.error("Failed to fetch orders", err);
      set(() => ({
        activeOrders: [],
        finishedOrders: [],
      }));
    }
  },

  // Utility
  setMessage: (message: string) => {
    set(() => ({ message }));
  },
}));
