
import { NavLink, useLocation } from "react-router";
import { useAuthContext } from "../../Context/AuthContext";
import { usePopUpContext } from "../../Context/PopUpContext";

const routes = [
  { name: "HOME", path: "/" },
  { name: "ABOUT", path: "/about" },
  { name: "MENU", path: "/menu" },
  { name: "ORDERS", path: "/orders" },
];

const Header1 = () => {
  const { setAuth } = useAuthContext();
  const location = useLocation();
  const { addPopUp } = usePopUpContext();
  return (
    <header className="z-10 flex absolute top-0 w-full items-center py-2 bg-gradient-to-b from-black to-transparent px-6">
      <div className="flex justify-start flex-1">Logo</div>
      <div className="gap-4 flex justify-center flex-1">
        {routes
          .filter((route) => route.path !== location.pathname)
          .map((route) => (
            <NavLink key={route.path} to={route.path}>
              <button className="cursor-pointer">{route.name}</button>
            </NavLink>
          ))}
      </div>
      <div className="gap-2 flex justify-end flex-1">
        <button
          onClick={() => {
            setAuth("login");
            addPopUp();
          }}
          className="w-20 py-2 rounded-full bg-[#000000]  border border-[#ff2100] cursor-pointer"
        >
          Login
        </button>
        <button
          onClick={() => {
            setAuth("register");
            addPopUp();
          }}
          className="w-20 py-2 rounded-full bg-[#ff2100]  border border-[#ffffff] cursor-pointer"
        >
          Sign Up
        </button>
      </div>
    </header>
  );
};

export default Header1;
