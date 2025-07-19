import { BiPhone, BiPlusCircle } from "react-icons/bi";
import CartCard from "./CartCard";
import { NavLink, useNavigate } from "react-router";
import DelivOrPickUp from "./DelivOrPickUp";
import { LuMapPin } from "react-icons/lu";
import { useState, useRef, type ChangeEvent } from "react";
import { type cartItem } from "../../Interfaces/Interfaces";
import { useCartStore } from "../../stores/cartStore";
import { motion } from "motion/react";
import { useLocationStore } from "../../stores/locationStore";
import { useUserStore } from "../../stores/userStore";

const CartContent = () => {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<string>("delivery");

  const [contact, setContact] = useState(user?.phone || "");

  // Use Zustand store instead of CartContext
  const { clearCart } = useCartStore();

  const cart = useCartStore((state) => state.cart || []); // Single selector for cart

  // Calculate total in component to avoid infinite loops
  const total = cart.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  // Get location store functions once
  const { findLocation, geocode, setLocation, autoComplete } =
    useLocationStore();

  // Use separate selectors to avoid creating new objects
  const location = useLocationStore(
    (state) => state.location ?? { name: "", lat: 0, lon: 0 }
  );
  const addresses = useLocationStore((state) => state.addresses ?? []);

  const handler = useRef<NodeJS.Timeout | null>(null);

  const fetchPossibleLocation = (e: ChangeEvent<HTMLInputElement>) => {
    try {
      if (handler.current) {
        clearTimeout(handler.current);
      }

      handler.current = setTimeout(() => {
        if (autoComplete && e.target.value.trim()) {
          autoComplete(e.target.value);
        }
      }, 1000);
    } catch (error) {
      console.error("Error in fetchPossibleLocation:", error);
    }
  };

  const handleConfirmOrder = async () => {
    try {
      if (!user || !user.name) {
        alert("User not logged in");
        return;
      }

      if (!contact || !location?.name) {
        alert("Please provide contact and address.");
        return;
      }

      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id || user.id,
          userName: user.name,
          items: cart.map((item: cartItem) => ({
            menuItem: item.menuItem._id,
            quantity: item.quantity,
          })),
          contact,
          location,
        }),
      });

      const result = await res.json();
      if (result.success) {
        alert("Order confirmed!");
        clearCart();
        navigate("/orders");
      } else {
        alert("Order failed: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("Order failed: Network error");
    }
  };

  return (
    <div className="pt-20 md:px-40 px-4 min-h-screen">
      <div className="pb-2 mb-6 border-b border-b-[#ff2100] flex justify-between">
        <h1 className="text-3xl font-bold ">Cart</h1>
        <motion.button
          whileHover={{ backgroundColor: "#ff1200" }}
          onClick={clearCart}
          className="flex px-4 py-2 border border-[#ff1200] justify-center items-center rounded-lg cursor-pointer"
        >
          Clear
        </motion.button>
      </div>
      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:divide-x divide-gray-300 min-h-screen">
          <div className="lg:pr-12">
            <section>
              <div className="flex flex-col gap-4">
                {cart.map((item: cartItem) => (
                  <div key={item.menuItem._id}>
                    <CartCard
                      id={item.menuItem._id}
                      description={item.menuItem.description}
                      name={item.menuItem.name}
                      price={item.menuItem.price.toFixed(2)}
                      quantity={item.quantity}
                    />
                  </div>
                ))}
              </div>
              <NavLink to="/menu">
                <div className="flex cursor-pointer items-center py-4 border-y border-y-gray-500 mt-4 gap-2 px-4">
                  <BiPlusCircle size={25} color="#ff2100" />
                  <p>Add more</p>
                </div>
              </NavLink>
              <div className="flex cursor-pointer items-center py-4 border-b border-b-gray-500 gap-2 px-4">
                <input
                  type="text"
                  placeholder="Leave a comment..."
                  className=" placeholder:text-gray-500"
                />
              </div>
            </section>
          </div>
          <div className="lg:pl-12 lg:sticky h-fit top-10">
            <section className="pb-4  border-b border-b-gray-500">
              <DelivOrPickUp
                deliveryMethod={deliveryMethod}
                setDeliveryMethod={setDeliveryMethod}
              />
            </section>
            <section className="border-b border-b-gray-500">
              <div className="flex text-xl flex-col py-4 px-4 border-b border-b-gray-500 text-right">
                <p className="flex justify-between">
                  <span>Subtotal: </span>
                  <span>GH₵{total.toFixed(2)}</span>
                </p>
                <p className="flex justify-between">
                  <span>Delivery: </span> <span>- -</span>
                </p>
              </div>
              <div className="px-4">
                <p className="flex justify-between text-xl py-2">
                  <span className="font-bold text-[#ff1200]">Total: </span>{" "}
                  <span>GH₵{total}</span>
                </p>
              </div>
            </section>
            <section>
              {deliveryMethod === "delivery" && (
                <div className="flex justify-between items-center px-4 py-2 border-b border-b-gray-500 gap-4">
                  <div className="flex items-center gap-2 relative w-full">
                    <LuMapPin size={20} />
                    <input
                      type="text"
                      name="location"
                      id="location"
                      value={location?.name || ""}
                      onChange={(e) => {
                        try {
                          setLocation({
                            ...location,
                            name: e.target.value,
                          });
                          fetchPossibleLocation(e);
                          setIsOpen(true);
                        } catch (error) {
                          console.error("Error updating location:", error);
                        }
                      }}
                      placeholder="Enter your location"
                      className="focus:outline-none py-2 w-full overflow-hidden overflow-ellipsis"
                    />
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{
                        opacity: isOpen ? 1 : 0,
                        height: isOpen ? "auto" : 0,
                      }}
                      className="absolute top-[100%] bg-[#181c1f]  rounded-lg px-4 overflow-hidden"
                    >
                      <div className="divide-y divide-gray-500">
                        {addresses &&
                          addresses.length > 0 &&
                          addresses.map(({ suburb, street }, i: number) => (
                            <p
                              key={i}
                              onClick={() => {
                                try {
                                  const locationName = `${suburb || ""}, ${
                                    street || ""
                                  }`;
                                  setLocation({
                                    ...location,
                                    name: locationName,
                                  });
                                  if (geocode) {
                                    geocode(locationName);
                                  }
                                  setIsOpen(false);
                                } catch (error) {
                                  console.error(
                                    "Error selecting location:",
                                    error
                                  );
                                }
                              }}
                              className="py-2 cursor-pointer"
                            >
                              {suburb || "Unknown"}, {street || "Unknown"}
                            </p>
                          ))}
                      </div>
                    </motion.div>
                  </div>
                  <div className="flex shrink-0">
                    <button
                      onClick={() => {
                        try {
                          if (findLocation) {
                            findLocation();
                          }
                        } catch (error) {
                          console.error("Error finding location:", error);
                        }
                      }}
                      className="bg-[#181c1f] border border-[#23272b] py-2 px-4 rounded-lg cursor-pointer"
                    >
                      Use my location
                    </button>
                  </div>
                </div>
              )}
              <div className="flex flex-col px-4 py-2 border-b border-b-gray-500">
                <div className="flex items-center gap-2">
                  <BiPhone size={20} />
                  <input
                    type="text"
                    name="contact"
                    id="contact"
                    placeholder="Phone"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="mb-1 focus:outline-0"
                  />
                </div>
                {contact && !/^(0\d{9}|(\+233\d{9}))$/.test(contact) && (
                  <span className="text-red-500 text-sm">
                    Please enter a valid Ghanaian phone number.
                  </span>
                )}
              </div>
              <div className="px-4 pt-4">
                <button
                  onClick={handleConfirmOrder}
                  className="bg-[#ff1200] w-full rounded-lg py-2 text-2xl font-bold"
                >
                  Place Order
                </button>
              </div>
            </section>
          </div>
        </div>
      ) : (
        <div className="py-12 h-[75vh] flex items-center justify-center flex-col ">
          <p className="text-xl text-gray-600">Your cart is empty.</p>
          <NavLink to="/menu">
            <button className="mt-4 bg-[#ff2100] text-white px-6 py-3 rounded-lg hover:bg-[#d81b00] transition">
              Browse Menu
            </button>
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default CartContent;
