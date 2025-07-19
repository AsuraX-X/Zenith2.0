import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import RiderCard from "../components/Rider/RiderCard";
import type { Order } from "../Interfaces/Interfaces";
import { useUserStore } from "../stores/userStore";

export default function RiderDashboard() {
  const { setUser } = useUserStore();
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const [currentOrders, setCurrentOrders] = useState<Order[]>([]);
  const [finishedOrders, setFinishedOrders] = useState<Order[]>([]);
  const [view, setView] = useState("current");

  const fetchOrders = useCallback(async () => {
    try {
      const [curRes, finRes] = await Promise.all([
        fetch(`/api/rider/current-orders/${user?._id || user?.id}`),
        fetch(`/api/rider/finished-orders/${user?._id || user?.id}`),
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
  }, [user?._id, user?.id]);

  // Fetch once on mount
  useEffect(() => {
    if (user?.role === "rider" && (user?._id || user?.id)) {
      fetchOrders();
    }
  });

  // Auto-refresh every 5 seconds
  useEffect(() => {
    if (user?.role === "rider" && (user?._id || user?.id)) {
      const interval = setInterval(fetchOrders, 5000);
      return () => clearInterval(interval);
    }
  }, [user, fetchOrders]);

  return (
    <div className="min-h-screen bg-[#0e1113] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              setUser(null);
              navigate("/");
            }}
            className="px-4 py-2 rounded-lg bg-[#ff1200] text-white hover:bg-[#d81b00] transition"
          >
            Logout
          </button>
        </div>
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Rider Dashboard
        </h2>

        <div className="flex justify-center mb-8">
          <div className="flex bg-[#181c1f] border border-gray-600 rounded-lg shadow-lg p-1">
            <button
              className={`px-6 py-3 rounded-lg transition ${
                view === "current"
                  ? "bg-[#ff1200] text-white"
                  : "text-gray-300 hover:text-[#ff1200]"
              }`}
              onClick={() => setView("current")}
            >
              Current Orders
            </button>
            <button
              className={`px-6 py-3 rounded-lg transition ${
                view === "finished"
                  ? "bg-[#ff1200] text-white"
                  : "text-gray-300 hover:text-[#ff1200]"
              }`}
              onClick={() => setView("finished")}
            >
              Finished Deliveries
            </button>
          </div>
        </div>

        <section>
          {view === "current" ? (
            currentOrders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-400">
                  No current orders assigned.
                </p>
              </div>
            ) : (
              currentOrders.map((order) => (
                <RiderCard key={order._id} order={order} showActions={true} />
              ))
            )
          ) : finishedOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-400">
                No finished deliveries yet.
              </p>
            </div>
          ) : (
            finishedOrders.map((order) => (
              <RiderCard key={order._id} order={order} showActions={false} />
            ))
          )}
        </section>
      </div>
    </div>
  );
}
