import { BiChevronRight, BiPlusCircle } from "react-icons/bi";
import food from "../../assets/Data/food.json";
import OrderCard from "./OrderCard";
import { NavLink, useNavigate } from "react-router";
import DelivOrPickUp from "./DelivOrPickUp";
import { LuMapPin } from "react-icons/lu";
import { useUser } from "../../Context/UserContext";
import { useEffect, useState } from "react";
import type { cartItem } from "../general/General";
import { useCartContext } from "../../Context/CartContext";

const AllOrders = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [manualMode, setManualMode] = useState(false);

  const { cart, clearCart } = useCartContext();

  const handleConfirmOrder = async () => {
    if (!user || !user.name) {
      alert("User not logged in");
      return;
    }

    if (!contact || !address) {
      alert("Please provide contact and address.");
      return;
    }

    const res = await fetch("http://localhost:3000/order", {
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
        address,
      }),
    });

    const result = await res.json();
    if (result.success) {
      alert("Order confirmed!");
      clearCart();
      navigate("/orders");
    } else {
      alert("Order failed");
    }
  };

  const fetchCurrentLocation = () => {
    setLocationLoading(true);
    setLocationError("");
    setManualMode(false);

    if (!("geolocation" in navigator)) {
      setLocationLoading(false);
      setLocationError("Geolocation not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setAddress(mapsLink);
        setLocationLoading(false);
      },
      (error) => {
        console.error("Location error:", error);
        setLocationError("Failed to get current location.");
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleManualAddress = () => {
    setManualMode(true);
    setAddress("");
    setLocationError("");
  };

  return (
    <div className="pt-20 px-40 min-h-screen">
      <h1 className="text-3xl font-bold pb-2 mb-6 border-b border-b-[#ff2100]">
        Cart
      </h1>
      {cart.length > 0 ? (
        <div>
          <section>
            <div className="flex flex-col gap-4">
              {cart.map((item: cartItem) => (
                <div key={item.menuItem._id}>
                  <OrderCard
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
              <div className="flex cursor-pointer items-center py-6 border-b border-b-gray-500 gap-2 px-4">
                <BiPlusCircle size={30} color="#ff2100" />
                <p className="text-xl">Add more</p>
              </div>
            </NavLink>
            <div className="flex cursor-pointer items-center py-6 border-b border-b-gray-500 gap-2 px-4">
              <input
                type="text"
                placeholder="Leave a comment..."
                className=" placeholder:text-gray-500 text-xl"
              />
            </div>
          </section>
          <section className="pb-4  border-b border-b-gray-500">
            <DelivOrPickUp />
          </section>
          <section className="border-b border-b-gray-500">
            <div className="flex text-xl flex-col py-4 px-4 border-b border-b-gray-500 text-right">
              <p className="flex justify-between">
                <span className="font-bold">Subtotal: </span>
                <span>GH₵ 309.00</span>
              </p>
              <p className="flex justify-between">
                <span className="font-bold">Delivery: </span>{" "}
                <span>GH₵ 30.00</span>
              </p>
            </div>
            <div className="px-4">
              <p className="flex justify-between text-2xl py-2">
                <span className="font-bold text-[#ff1200]">Total: </span>{" "}
                <span>GH₵ 30.00</span>
              </p>
            </div>
          </section>
          <section>
            <div className="flex justify-between items-center px-4 py-2 cursor-pointer border-b border-b-gray-500">
              <div className="flex items-center text-xl gap-2">
                <LuMapPin /> Location
              </div>
              <div>
                <BiChevronRight size={40} color="#6a7282" />
              </div>
            </div>
            <div className="px-4 py-4">
              <button className="bg-[#ff1200] w-full rounded-full py-2 text-2xl font-bold">
                Place Order
              </button>
            </div>
          </section>
        </div>
      ) : (
        <div className="py-12 h-[75vh] flex items-center justify-center flex-col ">
          <p className="text-xl text-gray-600">Your cart is empty.</p>
          <NavLink to="/menu">
            <button className="mt-4 bg-[#ff2100] text-white px-6 py-3 rounded-full hover:bg-[#d81b00] transition">
              Browse Menu
            </button>
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default AllOrders;
