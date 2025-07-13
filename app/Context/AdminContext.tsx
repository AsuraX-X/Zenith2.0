import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type {
  EditItem,
  FormData,
  MenuItem,
  NewUser,
  Order,
} from "../Interfaces/Interfaces";

interface ADCI {
  menuItems: MenuItem[];
  addFilter: (fil: string) => void;
  newUser: NewUser;
  setNewUser: (user: NewUser) => void;
  handleCreateUser: () => void;
  message: string;
  formData: FormData;
  editItem: EditItem | null;
  handleEditItem: (item: MenuItem | null) => void;
  handleDeleteItem: (id: string) => void;
  handleUpdateItem: () => void;
  handleChangeEdit: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeMenu: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  categories: string[];
  filter: string[];
  uniqueCategories: string[];
  activeOrders: Order[];
  setActiveOrders: (orders: Order[]) => void;
  finishedOrders: Order[];
  setFinishedOrders: (orders: Order[]) => void;
  fetchOrders: () => void;
}

const AdminContext = createContext<ADCI | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editItem, setEditItem] = useState<EditItem | null>(null);
  const [newUser, setNewUser] = useState<NewUser>({
    name: "",
    password: "",
    phone: "",
    role: "rider",
  });
  const [formData, setFormData] = useState<FormData>({
    name: "",
    price: "",
    category: "",
    image: null,
  });
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const [filter, setFilter] = useState<string[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [finishedOrders, setFinishedOrders] = useState<Order[]>([]);

  useEffect(() => {
    refreshMenu();
  }, []);

  const refreshMenu = async () => {
    const res = await fetch("/api/menu");
    const data = await res.json();
    setMenuItems(data);
    const uniqueTypes = Array.from(
      new Set(data.map((item: MenuItem) => item.category))
    ) as string[];
    setCategories(uniqueTypes);
    setUniqueCategories(uniqueTypes);
  };

  const addFilter = (fil: string) => {
    if (filter.includes(fil)) {
      setFilter(filter.filter((item) => fil !== item));
    } else {
      setFilter((prev) => [...prev, fil]);
    }
  };

  useEffect(() => {
    if (filter.length > 0) {
      setUniqueCategories(filter);
    } else {
      setUniqueCategories(categories);
    }
  }, [filter, categories]);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleEditItem = (item: MenuItem | null) => {
    setEditItem(item);
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`/api/admin/delete-menu-item/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        alert("Item deleted");
        refreshMenu();
      } else {
        alert("Failed to delete");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed");
    }
  };

  const handleUpdateItem = async () => {
    if (!editItem) return;

    try {
      if (!editItem.name || !editItem.price || !editItem.category) {
        alert("Please fill all fields");
        return;
      }

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
        setEditItem(null);
        refreshMenu();
      } else {
        alert("Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Update failed");
    }
  };

  const handleChangeEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editItem) return;

    const { name, value, files } = e.target;
    if (name === "image" && files) {
      setEditItem({ ...editItem, image: files[0] });
    } else {
      setEditItem({ ...editItem, [name]: value });
    }
  };

  const handleChangeMenu = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "image" && files) {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category) {
      return setMessage("All fields except image are required.");
    }

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
        setMessage("Menu item created successfully!");
        setFormData({ name: "", price: "", category: "", image: null });
        refreshMenu();
      } else {
        setMessage("Error: " + result.error);
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to create menu item");
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.password || !newUser.role) {
      return alert("Please fill in all fields");
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
        setNewUser({ name: "", password: "", phone: "", role: "rider" });
      } else {
        alert("Creation failed: " + data.error);
      }
    } catch (err) {
      console.error("Create user error:", err);
      alert("Request failed");
    }
  };

  const fetchOrders = async () => {
    try {
      const [activeRes, finishedRes] = await Promise.all([
        fetch("/api/admin/orders"),
        fetch("/api/admin/finished-orders"),
      ]);

      const activeData = await activeRes.json();
      const finishedData = await finishedRes.json();

      console.log("Active orders data:", activeData);
      console.log("Finished orders data:", finishedData);

      setActiveOrders(Array.isArray(activeData) ? activeData : []);
      setFinishedOrders(Array.isArray(finishedData) ? finishedData : []);
    } catch (err) {
      console.error("Failed to fetch orders", err);
      setActiveOrders([]);
      setFinishedOrders([]);
    }
  };

  return (
    <AdminContext
      value={{
        filter,
        uniqueCategories,
        menuItems,
        newUser,
        setNewUser,
        formData,
        handleDeleteItem,
        editItem,
        handleEditItem,
        handleUpdateItem,
        message,
        handleChangeEdit,
        handleChangeMenu,
        handleCreateUser,
        addFilter,
        categories,
        handleSubmit,
        activeOrders,
        finishedOrders,
        setActiveOrders,
        setFinishedOrders,
        fetchOrders,
      }}
    >
      {children}
    </AdminContext>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAdminContext = () => {
  const context = useContext(AdminContext);

  if (!context) throw new Error("No Admin context provided");

  return context;
};
