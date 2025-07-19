import { useState } from "react";
import type { MenuItem } from "../Interfaces/Interfaces";
import AdminSideBar from "./AdminSideBar";
import AdminMenuItemCard from "../components/admin/AdminMenuItemCard";
import { useAdminStore } from "../stores/adminStore";
import { useRefreshMenuEffect } from "../hooks";

const AdminMenuItems = () => {
  const [isOpen, setIsOpen] = useState(false);

  useRefreshMenuEffect();

  const {
    addFilter,
    handleChangeEdit,
    handleChangeMenu,
    handleEditItem,
    handleSubmit,
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

  return (
    <div className="ml-65">
      <AdminSideBar />
      <div className="p-6">
        <h1 className="text-center text-4xl font-bold pb-6">Menu Items</h1>
        <div className="bg-[#181c1f] rounded-lg border border-gray-600 p-4 sm:p-6 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#ff1200]">
            Add New Menu Item
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                      .filter((item: MenuItem) => item.category === category)
                      .map((item) => (
                        <AdminMenuItemCard item={item} key={item._id} />
                      ))}
                  </div>
                </div>
              ))}
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
