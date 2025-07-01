import React, { useEffect, useState } from "react";
import { useUser } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";

interface OrderItem {
  menuItem: {
    _id: string;
    name: string;
  };
  quantity: number;
}

interface Order {
  _id: string;
  userId?: {
    _id: string;
    name: string;
  };
  userName?: string;
  contact: string;
  address: string;
  items: OrderItem[];
  pending?: string;
  confirmed?: string;
  preparing?: string;
  packing?: string;
  outForDelivery?: string;
}

export default function RiderDashboard() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [currentOrders, setCurrentOrders] = useState<Order[]>([]);
  const [finishedOrders, setFinishedOrders] = useState<Order[]>([]);
  const [view, setView] = useState("current");

  const fetchOrders = async () => {
    try {
      const [curRes, finRes] = await Promise.all([
        fetch(
          `http://localhost:3000/rider/current-orders/${user?._id || user?.id}`
        ),
        fetch(
          `http://localhost:3000/rider/finished-orders/${user?._id || user?.id}`
        ),
      ]);

      const curData = await curRes.json();
      const finData = await finRes.json();

      console.log("Current orders data:", curData);
      console.log("Finished orders data:", finData);

      setCurrentOrders(Array.isArray(curData) ? curData : []);
      setFinishedOrders(Array.isArray(finData) ? finData : []);
    } catch (err) {
      console.error("Failed to fetch rider orders", err);
      setCurrentOrders([]);
      setFinishedOrders([]);
    }
  };

  // Fetch once on mount
  useEffect(() => {
    if (user?.role === "rider" && (user?._id || user?.id)) {
      fetchOrders();
    }
  }, [user]);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    if (user?.role === "rider" && (user?._id || user?.id)) {
      const interval = setInterval(fetchOrders, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const renderOrder = (order: Order, showActions = false) => (
    <div key={order._id} className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-bold mb-4 text-[#333]">Order Details</h3>

          <div className="space-y-3">
            <div>
              <span className="font-semibold text-gray-700">Customer:</span>
              <p className="text-gray-900">
                {order.userId && order.userId.name
                  ? order.userId.name
                  : order.userName || "Unknown"}
              </p>
            </div>

            <div>
              <span className="font-semibold text-gray-700">Contact:</span>
              <p className="text-gray-900">{order.contact || "N/A"}</p>
              {order.contact && (
                <div className="flex gap-3 mt-1">
                  <a
                    href={`tel:${order.contact}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                  >
                    📞 Call
                  </a>
                  <a
                    href={`https://wa.me/${order.contact}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                  >
                    💬 WhatsApp
                  </a>
                </div>
              )}
            </div>

            <div>
              <span className="font-semibold text-gray-700">Address:</span>
              <a
                href={order.address}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 underline mt-1"
              >
                📍 View on Google Maps
              </a>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-3">Order Items:</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <ul className="space-y-2">
              {order.items.map((item, idx) => (
                <li key={idx} className="flex justify-between">
                  <span className="text-gray-800">
                    {item.menuItem && item.menuItem.name
                      ? item.menuItem.name
                      : "Unknown Item"}
                  </span>
                  <span className="font-semibold text-[#4CAF50]">
                    × {item.quantity}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="font-semibold text-lg mb-3">Order Progress:</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <span>⌛</span>
            <span>Pending Confirmation</span>
          </div>
          {order.confirmed && (
            <div className="flex items-center gap-2 text-black font-semibold">
              <span>✅</span>
              <span>Order Confirmed</span>
            </div>
          )}
          {order.preparing && (
            <div className="flex items-center gap-2 text-black font-semibold">
              <span>✅</span>
              <span>Order is being prepared</span>
            </div>
          )}
          {order.packing && (
            <div className="flex items-center gap-2 text-black font-semibold">
              <span>✅</span>
              <span>Order is being packed</span>
            </div>
          )}
          {order.outForDelivery && (
            <div className="flex items-center gap-2 text-black font-semibold">
              <span>✅</span>
              <span>Out for Delivery</span>
            </div>
          )}
        </div>
      </div>

      {showActions && (
        <div className="mt-6">
          <button
            onClick={() => {
              // Handle delivery confirmation
              alert(
                "Delivery confirmed! This order will be moved to finished deliveries."
              );
            }}
            className="w-full bg-[#4CAF50] text-white py-3 rounded-lg font-semibold hover:bg-[#45a049] transition"
          >
            ✅ Confirm Delivery
          </button>
        </div>
      )}
    </div>
  );

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
        <h2 className="text-3xl font-bold text-center mb-8 text-[#333]">
          🚴 Rider Dashboard
        </h2>

        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-lg shadow-lg p-1">
            <button
              className={`px-6 py-3 rounded-lg transition ${
                view === "current"
                  ? "bg-[#ff2100] text-white"
                  : "text-gray-600 hover:text-[#ff2100]"
              }`}
              onClick={() => setView("current")}
            >
              🟡 Current Orders
            </button>
            <button
              className={`px-6 py-3 rounded-lg transition ${
                view === "finished"
                  ? "bg-[#ff2100] text-white"
                  : "text-gray-600 hover:text-[#ff2100]"
              }`}
              onClick={() => setView("finished")}
            >
              ✅ Finished Deliveries
            </button>
          </div>
        </div>

        <section>
          {view === "current" ? (
            currentOrders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">
                  No current orders assigned.
                </p>
              </div>
            ) : (
              currentOrders.map((order) => renderOrder(order, true))
            )
          ) : finishedOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">
                No finished deliveries yet.
              </p>
            </div>
          ) : (
            finishedOrders.map((order) => renderOrder(order, false))
          )}
        </section>
      </div>
    </div>
  );
}
