import { NavLink, useLocation, useNavigate } from "react-router";
import { useAuthContext } from "../../Context/AuthContext";
import { usePopUpContext } from "../../Context/PopUpContext";
import { useUser } from "../../Context/UserContext";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { BiChevronDown, BiUserCircle } from "react-icons/bi";
import { useCartContext } from "../../Context/CartContext";
import { FiShoppingCart } from "react-icons/fi";

const routes = [
  { name: "HOME", path: "/" },
  { name: "ABOUT", path: "/about" },
  { name: "MENU", path: "/menu" },
  { name: "ORDERS", path: "/orders" },
];

const Header = () => {
  const { setAuth } = useAuthContext();
  const location = useLocation();
  const { addPopUp } = usePopUpContext();
  const { user, setUser } = useUser();
  const { cart } = useCartContext();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (popupRef.current && popupRef.current.contains(target)) {
        return;
      }
      if (buttonRef.current && buttonRef.current.contains(target)) {
        return;
      }
      setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick, true); // use capture phase
    return () => {
      document.removeEventListener("mousedown", handleClick, true);
    };
  }, [isOpen]);

  return (
    <header className="z-10 flex fixed top-0 w-full items-center py-2 bg-gradient-to-b from-black to-transparent px-6">
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
      <div className="flex justify-end flex-1">
        {user ? (
          <div className="flex relative min-w-70 justify-end gap-2">
            {cart.length > 0 && location.pathname !== "/cart" && (
              <div className="relative">
                <div className="bg-[#ff1200] rounded-full absolute size-4 flex justify-center items-center right-0">
                  <p className="text-xs">{cart.length}</p>
                </div>
                <NavLink to="/cart">
                  <button className="cursor-pointer flex items-center py-2 px-4 border border-[#ff1200] rounded-full gap-2 bg-[#0e1113]">
                    <FiShoppingCart /> Cart
                  </button>
                </NavLink>
              </div>
            )}
            <button
              ref={buttonRef}
              className="flex items-center cursor-pointer"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <BiUserCircle size={30} />
              <BiChevronDown size={20} />
            </button>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: isOpen ? "auto" : 0,
                opacity: isOpen ? 1 : 0,
              }}
              className="absolute w-full overflow-hidden top-[100%] mt-4"
              ref={popupRef}
            >
              <div className="px-4 py-2 rounded-lg bg-[#242729] divide-y gap-2">
                <p>{user.name}</p>
                <button
                  onClick={() => {
                    setUser(null);
                    navigate("/");
                  }}
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="flex gap-2">
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
        )}
      </div>
    </header>
  );
};

export default Header;
