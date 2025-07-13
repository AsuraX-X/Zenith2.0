import { useState } from "react";
import { useUser } from "../../Context/UserContext";
import { useEffect } from "react";
import OrderCard from "./OrderCard";
import { motion } from "motion/react";
import type { Order } from "../../Interfaces/Interfaces";

const OrderContent = () => {
  const { user } = useUser();
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [finishedOrders, setFinishedOrders] = useState<Order[]>([]);
  const [view, setView] = useState("active");

  useEffect(() => {
    const fetchOrders = async () => {
      console.log("Fetching orders for user:", user);
      console.log("User name:", user?.name);
      console.log("User _id:", user?._id);
      console.log("User id:", user?.id);

      if (user && (user._id || user.id)) {
        const userId = user._id || user.id;
        try {
          const activeRes = await fetch(`/api/user-orders/${userId}`);
          if (!activeRes.ok)
            throw new Error(`HTTP error! status: ${activeRes.status}`);
          const activeData = await activeRes.json();
          setActiveOrders(Array.isArray(activeData) ? activeData : []);
        } catch (err) {
          console.error("Failed to fetch active orders", err);
          setActiveOrders([]);
        }

        try {
          const finishedRes = await fetch(
            `/api/user-finished-orders/${userId}`
          );
          if (!finishedRes.ok)
            throw new Error(`HTTP error! status: ${finishedRes.status}`);
          const finishedData = await finishedRes.json();
          setFinishedOrders(Array.isArray(finishedData) ? finishedData : []);
        } catch (error) {
          console.error(error);

          setFinishedOrders([]);
        }
      } else {
        console.log("No user or user ID found:", user);
        console.log("LocalStorage user:", localStorage.getItem("user"));
      }
    };

    fetchOrders();

    // Set up polling for real-time updates
    const pollInterval = setInterval(fetchOrders, 15000); // Poll every 15 seconds

    return () => clearInterval(pollInterval);
  }, [user]);

  useEffect(() => {
    console.log(activeOrders);
  }, [activeOrders]);

  const handleOrderUpdate = (updatedOrder: Order) => {
    setActiveOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === updatedOrder._id ? updatedOrder : order
      )
    );
  };

  const handleFinishedOrderUpdate = (updatedOrder: Order) => {
    setFinishedOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === updatedOrder._id ? updatedOrder : order
      )
    );
  };

  return (
    <div className="mt-20 px-4">
      <div className="border-b border-b-[#ff1200] pb-2 mb-8 flex justify-between items-center">
        <h1 className="text-4xl font-bold">Orders</h1>
        <div className="rounded-lg space-x-2 sm:p-2 text-xs sm:text-base flex items-center">
          <motion.button
            initial={{ backgroundColor: "#0e1113 " }}
            animate={{
              backgroundColor: view === "active" ? "#ff1200" : "#0e1113",
            }}
            whileHover={{
              color: view !== "active" ? "#ff1200" : "#ffffff",
            }}
            className="sm:px-6 sm:py-3 px-3 py-2 rounded-lg font-semibold cursor-pointer "
            onClick={() => setView("active")}
          >
            Active Orders
          </motion.button>
          <motion.button
            initial={{ backgroundColor: "#0e1113 " }}
            animate={{
              backgroundColor: view === "finished" ? "#ff1200" : "#0e1113",
            }}
            whileHover={{
              color: view !== "finished" ? "#ff1200" : "#ffffff",
            }}
            className="sm:px-6 sm:py-3 px-3 py-2  rounded-lg font-semibold cursor-pointer "
            onClick={() => setView("finished")}
          >
            Finished Orders
          </motion.button>
        </div>
      </div>
      <div>
        {view === "active" ? (
          <div>
            {activeOrders.length > 0 ? (
              activeOrders.map((item) => (
                <OrderCard
                  key={item._id}
                  order={item}
                  onOrderUpdate={handleOrderUpdate}
                />
              ))
            ) : (
              <div className="h-120 flex justify-center items-center">
                <p className="text-xl font-bold text-gray-400">
                  No active orders
                </p>
              </div>
            )}
          </div>
        ) : (
          <div>
            {finishedOrders.length > 0 ? (
              finishedOrders.map((item) => (
                <OrderCard
                  key={item._id}
                  order={item}
                  isActive={false}
                  onOrderUpdate={handleFinishedOrderUpdate}
                />
              ))
            ) : (
              <div className="h-120 flex justify-center items-center">
                <p className="text-xl font-bold text-gray-400">
                  No completed orders
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderContent;
