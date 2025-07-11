import { NavLink } from "react-router";

const AdminSideBar = () => {
  const routes = [
    { name: "Order", path: "/admin/orders" },
    { name: "Menu Items", path: "/admin/menu" },
    { name: "Roles", path: "/admin/roles" },
  ];

  return (
    <div className="fixed left-0 top-0 bottom-0 py-5 w-65 border-r border-gray-500">
      <h1 className="mb-5 text-2xl text-[#ff1200] px-6 font-serif font-bold">
        DE BLISS
      </h1>
      <div className="px-2 flex flex-col">
        {routes.map((route) => (
          <NavLink
            key={route.path}
            to={route.path}
            className={`text-left py-2 px-3 rounded-lg transition ${
              location.pathname === route.path
                ? "bg-[#ff1200] text-white"
                : "hover:bg-gray-800"
            }`}
          >
            {route.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default AdminSideBar;
