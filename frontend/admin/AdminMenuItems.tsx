import { useState } from "react";
import type { MenuItem, Accompaniment } from "../Interfaces/Interfaces";
import AdminSideBar from "./AdminSideBar";
import AdminMenuItemCard from "../components/admin/AdminMenuItemCard";
import { useAdminStore } from "../stores/adminStore";
import { useRefreshMenuEffect } from "../hooks";
import { useAnimationStore } from "../stores/animationStore";
import { BiTrash } from "react-icons/bi";

const AdminMenuItems = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [accompaniments, setAccompaniments] = useState<Accompaniment[]>([]);
  const [newAccompaniment, setNewAccompaniment] = useState<Accompaniment>({
    name: "",
    price: 0,
  });

  useRefreshMenuEffect();
  const { refreshMenu } = useAdminStore();

  const {
    addFilter,
    handleChangeEdit,
    handleChangeMenu,
    handleEditItem,
    handleUpdateItem,
  } = useAdminStore();

  // Use separate selectors to avoid creating new objects and infinite loops
  const formData = useAdminStore((state) => state.formData);
  const editItem = useAdminStore((state) => state.editItem);
  const menuItems = useAdminStore((state) => state.menuItems);
  const message = useAdminStore((state) => state.message);
  const categories = useAdminStore((state) => state.categories);
  const filter = useAdminStore((state) => state.filter);
  const uniqueCategories = useAdminStore((state) => state.uniqueCategories);
  const animation = useAnimationStore((state) => state.animation);
  const handleSubmitWithAccompaniments = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // Get form data from the store
    const { formData } = useAdminStore.getState();

    if (!formData.name || !formData.price || !formData.category) {
      useAdminStore.getState().setMessage("Please fill in all required fields");
      return;
    }

    try {
      let imageBase64 = "";
      if (formData.image) {
        imageBase64 = await convertToBase64(formData.image);
      }

      const response = await fetch("/api/admin/create-menu-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
          category: formData.category,
          imageBase64,
          accompaniments:
            accompaniments.length > 0 ? accompaniments : undefined,
        }),
      });

      const result = await response.json();

      if (result.success) {
        useAdminStore.getState().setMessage("Menu item added successfully!");
        // Reset form
        useAdminStore.setState({
          formData: { name: "", price: "", category: "", image: null },
        });
        // Reset accompaniments
        setAccompaniments([]);
        setNewAccompaniment({ name: "", price: 0 });
        // Refresh menu
        await useAdminStore.getState().refreshMenu();
      } else {
        useAdminStore
          .getState()
          .setMessage(result.error || "Failed to add menu item");
      }
    } catch (error) {
      console.error("Error adding menu item:", error);
      useAdminStore.getState().setMessage("Error adding menu item");
    }
  };

  // Helper function to convert file to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="ml-65">
      <AdminSideBar />
      <div className="p-6">
        <h1 className="text-center text-4xl font-bold pb-6">Menu Items</h1>
        <div className="bg-[#181c1f] rounded-lg border border-gray-600 p-4 sm:p-6 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#ff1200]">
            Add New Menu Item
          </h2>
          <form onSubmit={handleSubmitWithAccompaniments} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                name="name"
                value={formData.name}
                onChange={handleChangeMenu}
                placeholder="Item Name"
                className="p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] text-white placeholder-gray-400"
              />
              <input
                name="price"
                value={formData.price}
                onChange={handleChangeMenu}
                placeholder="Price"
                type="number"
                step="0.01"
                className="p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] text-white placeholder-gray-400 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <input
                name="category"
                value={formData.category}
                onChange={handleChangeMenu}
                placeholder="Category"
                className="p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] text-white placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Item Image:
              </label>
              <input
                name="image"
                type="file"
                accept="image/*"
                onChange={handleChangeMenu}
                className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#ff1200] file:text-white hover:file:bg-[#d81b00]"
              />
            </div>

            {/* Accompaniments Section */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Accompaniments (Optional):
              </label>
              <div className="space-y-2">
                {accompaniments.map((acc, index) => (
                  <div
                    key={index}
                    className="flex gap-2 items-center bg-[#0e1113] p-2 rounded-lg border border-gray-600"
                  >
                    <input
                      value={acc.name}
                      onChange={(e) => {
                        const updated = [...accompaniments];
                        updated[index].name = e.target.value;
                        setAccompaniments(updated);
                      }}
                      placeholder="Accompaniment name"
                      className="flex-1 p-2 border border-gray-600 rounded focus:outline-none focus:border-[#ff1200] bg-[#181c1f] text-white placeholder-gray-400"
                    />
                    <input
                      type="number"
                      step="0.50"
                      value={acc.price === 0 ? "" : acc.price}
                      onChange={(e) => {
                        const updated = [...accompaniments];
                        updated[index].price = parseFloat(e.target.value) || 0;
                        setAccompaniments(updated);
                      }}
                      placeholder="Cost"
                      className="w-24 p-2 border border-gray-600 rounded focus:outline-none focus:border-[#ff1200] bg-[#181c1f] text-white placeholder-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = accompaniments.filter(
                          (_, i) => i !== index
                        );
                        setAccompaniments(updated);
                      }}
                      className="w-13 flex justify-center items-center py-2.5  bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                    <BiTrash size={20}/>
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    value={newAccompaniment.name}
                    onChange={(e) =>
                      setNewAccompaniment({
                        ...newAccompaniment,
                        name: e.target.value,
                      })
                    }
                    placeholder="New accompaniment name"
                    className="flex-1 p-2 border border-gray-600 rounded focus:outline-none focus:border-[#ff1200] bg-[#0e1113] text-white placeholder-gray-400"
                  />
                  <input
                    type="number"
                    step="0.50"
                    value={
                      newAccompaniment.price === 0 ? "" : newAccompaniment.price
                    }
                    onChange={(e) =>
                      setNewAccompaniment({
                        ...newAccompaniment,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="Cost"
                    className="w-24 p-2 border border-gray-600 rounded focus:outline-none focus:border-[#ff1200] bg-[#0e1113] text-white placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newAccompaniment.name.trim()) {
                        setAccompaniments([
                          ...accompaniments,
                          { ...newAccompaniment },
                        ]);
                        setNewAccompaniment({ name: "", price: 0 });
                      }
                    }}
                    className="px-4 py-2 bg-[#ff1200] text-white rounded hover:bg-[#d81b00] transition"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#ff1200] text-white px-6 py-3 rounded-lg hover:bg-[#d81b00] transition"
            >
              Add Item
            </button>
            {message && (
              <p className="text-[#ff1200] text-center font-medium">
                {message}
              </p>
            )}
          </form>
        </div>
        <div className="bg-[#181c1f] rounded-lg border border-gray-600 p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-[#ff1200]">
            Current Menu Items
          </h2>
          <div className="mb-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 border border-gray-600 bg-[#0e1113] text-white rounded-lg cursor-pointer hover:bg-[#1a1f23] hover:shadow-md transition-all duration-200 shadow-sm"
            >
              Filter Categories
            </button>
            {isOpen && (
              <div className="mt-2 bg-[#0e1113] border border-gray-600 rounded-lg shadow-lg p-4 absolute z-10">
                {categories.map((category, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-1"
                  >
                    <span
                      className={`cursor-pointer text-gray-300 hover:text-[#ff1200] transition-colors ${
                        filter.includes(category)
                          ? "font-bold text-[#ff1200]"
                          : ""
                      }`}
                      onClick={() => addFilter(category)}
                    >
                      {category}
                    </span>
                    {filter.includes(category) && (
                      <span className="ml-2 text-[#ff1200]">✔</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {animation === "menu error" ? (
            <div className="h-[65vh] flex justify-center items-center gap-2">
              <div className="flex justify-center items-center flex-col gap-4">
                <p className="text-3xl text-gray-400">Error loading menu</p>
                <button
                  className="bg-[#ff1200] rounded-lg px-4 py-2 cursor-pointer"
                  onClick={refreshMenu}
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <div>
              {menuItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-400">No menu items found.</p>
                </div>
              ) : (
                <div className="space-y-12">
                  {uniqueCategories.map((category, i) => (
                    <div
                      className="bg-[#0e1113] rounded-xl border border-gray-600 shadow-sm p-6"
                      key={i}
                    >
                      <h3 className="text-xl font-bold border-b-2 border-b-[#ff1200] pb-2 mb-6 text-white">
                        {category.toUpperCase()}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {menuItems
                          .filter(
                            (item: MenuItem) => item.category === category
                          )
                          .map((item) => (
                            <AdminMenuItemCard item={item} key={item._id} />
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        {editItem && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-[#181c1f] border border-gray-600 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4 text-[#ff1200]">
                Edit Menu Item
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Item Name:
                  </label>
                  <input
                    name="name"
                    value={editItem.name}
                    onChange={handleChangeEdit}
                    className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Price:
                  </label>
                  <input
                    name="price"
                    value={editItem.price}
                    type="number"
                    step="0.01"
                    onChange={handleChangeEdit}
                    className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Category:
                  </label>
                  <input
                    name="category"
                    value={editItem.category}
                    onChange={handleChangeEdit}
                    className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    New Image (optional):
                  </label>
                  <input
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleChangeEdit}
                    className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#ff1200] file:text-white hover:file:bg-[#d81b00]"
                  />
                </div>

                {/* Edit Accompaniments Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Accompaniments:
                  </label>
                  <div className="space-y-2">
                    {editItem.accompaniments?.map((acc, index) => (
                      <div
                        key={index}
                        className="flex gap-2 items-center bg-[#0e1113] p-2 rounded-lg border border-gray-600"
                      >
                        <input
                          value={acc.name}
                          onChange={(e) => {
                            const updated = [
                              ...(editItem.accompaniments || []),
                            ];
                            updated[index].name = e.target.value;
                            // Create a compatible object for the update
                            const updatedEditItem = {
                              ...editItem,
                              accompaniments: updated,
                            };
                            handleEditItem(updatedEditItem as MenuItem);
                          }}
                          placeholder="Accompaniment name"
                          className="flex-1 p-2 border border-gray-600 rounded focus:outline-none focus:border-[#ff1200] bg-[#181c1f] text-white placeholder-gray-400 text-sm"
                        />
                        <input
                          type="number"
                          step="0.01"
                          value={acc.price === 0 ? "" : acc.price}
                          onChange={(e) => {
                            const updated = [
                              ...(editItem.accompaniments || []),
                            ];
                            updated[index].price =
                              parseFloat(e.target.value) || 0;
                            // Create a compatible object for the update
                            const updatedEditItem = {
                              ...editItem,
                              accompaniments: updated,
                            };
                            handleEditItem(updatedEditItem as MenuItem);
                          }}
                          placeholder="Extra cost"
                          className="w-20 p-2 border border-gray-600 rounded focus:outline-none focus:border-[#ff1200] bg-[#181c1f] text-white placeholder-gray-400 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated =
                              editItem.accompaniments?.filter(
                                (_, i) => i !== index
                              ) || [];
                            // Create a compatible object for the update
                            const updatedEditItem = {
                              ...editItem,
                              accompaniments: updated,
                            };
                            handleEditItem(updatedEditItem as MenuItem);
                          }}
                          className="px-2 py-2.5 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                        >
                        <BiTrash/>
                        </button>
                      </div>
                    )) || []}
                    <button
                      type="button"
                      onClick={() => {
                        const current = editItem.accompaniments || [];
                        // Create a compatible object for the update
                        const updatedEditItem = {
                          ...editItem,
                          accompaniments: [...current, { name: "", price: 0 }],
                        };
                        handleEditItem(updatedEditItem as MenuItem);
                      }}
                      className="w-full px-3 py-2 border border-dashed border-gray-600 text-gray-400 rounded hover:border-[#ff1200] hover:text-[#ff1200] transition text-sm"
                    >
                      + Add Accompaniment
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleUpdateItem}
                    className="flex-1 bg-[#ff1200] text-white py-3 rounded-lg hover:bg-[#d81b00] transition"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => handleEditItem(null)}
                    className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition"
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
};

export default AdminMenuItems;
