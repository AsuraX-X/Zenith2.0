import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  category: string;
  image: string | File;
}

interface NewUser {
  name: string;
  password: string;
  phone: string;
  role: string;
}

interface FormData {
  name: string;
  price: string;
  category: string;
  image: File | null;
}

export default function AdminPanel() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
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
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const [filter, setFilter] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { setUser } = useUser();

  useEffect(() => {
    refreshMenu();
  }, []);

  const refreshMenu = async () => {
    const res = await fetch("http://localhost:3000/menu");
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

  const handleEditItem = (item: MenuItem) => {
    setEditItem(item);
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(
        `http://localhost:3000/admin/delete-menu-item/${id}`,
        {
          method: "DELETE",
        }
      );
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

      const res = await fetch(
        `http://localhost:3000/admin/update-menu-item/${editItem._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editItem.name,
            price: parseFloat(editItem.price.toString()),
            category: editItem.category,
            imageBase64,
          }),
        }
      );

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
      const res = await fetch("http://localhost:3000/admin/create-menu-item", {
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
      const res = await fetch("http://localhost:3000/admin/create-user", {
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

  return (
    <div className="min-h-screen bg-[#f9f9f9] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              setUser(null);
              navigate("/");
            }}
            className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition"
          >
            Logout
          </button>
        </div>
        <h1 className="text-4xl font-bold text-center mb-8 text-[#333]">
          🍽️ Admin Panel
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-[#333]">Check Orders</h2>
          <button
            onClick={() => navigate("/adminorders")}
            className="bg-[#ff2100] text-white px-6 py-3 rounded-lg hover:bg-[#d81b00] transition"
          >
            📦 Orders
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-[#333]">
            Create New Admin or Rider
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="name"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff2100] text-black placeholder-gray-500"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff2100] text-black placeholder-gray-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="phone"
                placeholder="Phone Number"
                value={newUser.phone}
                onChange={(e) =>
                  setNewUser({ ...newUser, phone: e.target.value })
                }
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff2100] text-black placeholder-gray-500"
              />
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff2100] text-black"
              >
                <option value="rider">Rider</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              onClick={handleCreateUser}
              className="w-full bg-[#4CAF50] text-white px-6 py-3 rounded-lg hover:bg-[#45a049] transition"
            >
              Create User
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-[#333]">
            Add New Menu Item
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                name="name"
                value={formData.name}
                onChange={handleChangeMenu}
                placeholder="Item Name"
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff2100] text-black placeholder-gray-500"
              />
              <input
                name="price"
                value={formData.price}
                onChange={handleChangeMenu}
                placeholder="Price"
                type="number"
                step="0.01"
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff2100] text-black placeholder-gray-500"
              />
              <input
                name="category"
                value={formData.category}
                onChange={handleChangeMenu}
                placeholder="Category"
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff2100] text-black placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Image:
              </label>
              <input
                name="image"
                type="file"
                accept="image/*"
                onChange={handleChangeMenu}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff2100] text-black"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#4CAF50] text-white px-6 py-3 rounded-lg hover:bg-[#45a049] transition"
            >
              Add Item
            </button>
            {message && <p className="text-red-500 text-center">{message}</p>}
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-[#333]">
            Current Menu Items
          </h2>
          <div className="mb-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 border border-black bg-black text-white rounded-lg cursor-pointer hover:bg-gray-900 hover:shadow-md transition-all duration-200 shadow-sm"
            >
              Filter Categories
            </button>
            {isOpen && (
              <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 absolute z-10">
                {categories.map((category, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-1"
                  >
                    <span
                      className={`cursor-pointer text-gray-700 hover:text-[#ff2100] transition-colors ${
                        filter.includes(category)
                          ? "font-bold text-[#ff2100]"
                          : ""
                      }`}
                      onClick={() => addFilter(category)}
                    >
                      {category}
                    </span>
                    {filter.includes(category) && (
                      <span className="ml-2">✔</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {menuItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No menu items found.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {uniqueCategories.map((category, i) => (
                <div className="bg-gray-50 rounded-xl shadow-sm p-6" key={i}>
                  <h3 className="text-xl font-bold border-b-2 border-b-[#ff2100] pb-2 mb-6 text-gray-800">
                    {category.toUpperCase()}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuItems
                      .filter((item: MenuItem) => item.category === category)
                      .map((item) => (
                        <div
                          key={item._id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition"
                        >
                          <img
                            src={
                              typeof item.image === "string" ? item.image : ""
                            }
                            alt={item.name}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                          />
                          <div className="space-y-2">
                            <h3 className="font-semibold text-lg text-[#333] break-words whitespace-normal">
                              {item.name}
                            </h3>
                            <p className="text-gray-600">{item.category}</p>
                            <p className="text-[#4CAF50] font-bold text-lg">
                              ₵{item.price}
                            </p>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => handleEditItem(item)}
                              className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item._id)}
                              className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {editItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4 text-[#333]">
                Edit Menu Item
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name:
                  </label>
                  <input
                    name="name"
                    value={editItem.name}
                    onChange={handleChangeEdit}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff2100] text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price:
                  </label>
                  <input
                    name="price"
                    value={editItem.price}
                    type="number"
                    step="0.01"
                    onChange={handleChangeEdit}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff2100] text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category:
                  </label>
                  <input
                    name="category"
                    value={editItem.category}
                    onChange={handleChangeEdit}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff2100] text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Image (optional):
                  </label>
                  <input
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleChangeEdit}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff2100] text-black"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleUpdateItem}
                    className="flex-1 bg-[#4CAF50] text-white py-3 rounded-lg hover:bg-[#45a049] transition"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditItem(null)}
                    className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
