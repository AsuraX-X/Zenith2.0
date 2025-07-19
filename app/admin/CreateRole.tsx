import { useAdminStore } from "../stores/adminStore";
import AdminSideBar from "./AdminSideBar";

const CreateRole = () => {
  const { setNewUser, handleCreateUser } = useAdminStore();
  const newUser = useAdminStore((state) => state.newUser);

  return (
    <div className="ml-65">
      <AdminSideBar />
      <div className="p-6 h-screen flex flex-col">
        <h1 className="text-center text-4xl font-bold pb-6">Create New Role</h1>
        <div className="flex gap-4 flex-col sm:flex-row flex-1 items-center">
          <div className="bg-[#181c1f] rounded-lg border border-gray-600 p-4 sm:p-6 mb-6 flex-1">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#ff1200]">
              Create New Admin
            </h2>
            <div className="flex flex-col gap-4">
              <input
                name="name"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                className="p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] text-white placeholder-gray-400"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] text-white placeholder-gray-400"
              />
              <input
                name="phone"
                placeholder="Phone Number"
                value={newUser.phone}
                onChange={(e) =>
                  setNewUser({ ...newUser, phone: e.target.value })
                }
                className="p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] text-white placeholder-gray-400"
              />
              <button
                onClick={() => {
                  setNewUser({ ...newUser, role: "admin" });
                  handleCreateUser();
                }}
                className="bg-[#ff1200] text-white px-6 py-3 rounded-lg hover:bg-[#d81b00] transition"
              >
                Create Admin
              </button>
            </div>
          </div>
          <div className="bg-[#181c1f] rounded-lg border border-gray-600 p-4 sm:p-6 mb-6 flex-1">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#ff1200]">
              Create New Rider
            </h2>
            <div className="flex flex-col gap-4">
              <input
                name="name"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                className="p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] text-white placeholder-gray-400"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] text-white placeholder-gray-400"
              />
              <input
                name="phone"
                placeholder="Phone Number"
                value={newUser.phone}
                onChange={(e) =>
                  setNewUser({ ...newUser, phone: e.target.value })
                }
                className="p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] text-white placeholder-gray-400"
              />
              <button
                onClick={() => {
                  setNewUser({ ...newUser, role: "rider" });
                  handleCreateUser();
                }}
                className="bg-[#ff1200] text-white px-6 py-3 rounded-lg hover:bg-[#d81b00] transition"
              >
                Create Rider
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRole;
