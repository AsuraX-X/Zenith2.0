import { useEffect, useState } from "react";
import AdminSideBar from "./AdminSideBar";

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
    email?: string;
    phone?: string;
  };
  userName: string;
  contact: string;
  address: string;
  pending: string;
  confirmed: string;
  preparing: string;
  packing: string;
  outForDelivery: string;
  riderId?: {
    _id: string;
    name: string;
    phone: string;
  };
  items: OrderItem[];
}

interface Rider {
  _id: string;
  name: string;
  phone: string;
}

export default function AdminOrders() {
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [finishedOrders, setFinishedOrders] = useState<Order[]>([]);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [view, setView] = useState("current");

  const fetchOrders = async () => {
    try {
      const [activeRes, finishedRes] = await Promise.all([
        fetch("/api/admin/orders"),
        fetch("/api/admin/finished-orders"),
      ]);

      const activeData = await activeRes.json();
      const finishedData = await finishedRes.json();

      console.log("Active orders data:", activeData);
      console.log("Finished orders data:", finishedData);

      setActiveOrders(Array.isArray(activeData) ? activeData : []);
      setFinishedOrders(Array.isArray(finishedData) ? finishedData : []);
    } catch (err) {
      console.error("Failed to fetch orders", err);
      setActiveOrders([]);
      setFinishedOrders([]);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchOrders();

    fetch("/api/admin/riders")
      .then((res) => res.json())
      .then((data) => setRiders(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching riders:", err));
  }, []);

  const handleDeleteFinishedOrder = async (orderId: string) => {
    const confirmDelete = window.confirm(
      "Delete this finished order permanently?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/admin/finished-orders/${orderId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setFinishedOrders(finishedOrders.filter((o) => o._id !== orderId));
      } else {
        alert("Failed to delete order.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleAssignRider = async (orderId: string, riderId: string) => {
    const res = await fetch("/api/admin/assign-rider", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, riderId }),
    });

    if (res.ok) {
      fetchOrders();
    } else {
      alert("Failed to assign rider");
    }
  };

  const handleMakeChanges = async (
    orderId: string,
    statusKey: string,
    value: string
  ) => {
    const res = await fetch("/api/admin/order-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, statusKey, value }),
    });

    if (res.ok) {
      fetchOrders();
    } else {
      alert("Failed to update order status");
    }
  };

  const renderOrder = (order: Order, showActions = true) => (
    <div
      key={order._id}
      className="bg-[#181c1f] border border-gray-600 rounded-lg shadow-lg p-6 mb-6"
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-bold mb-4 text-[#ff1200]">
            Order Details
          </h3>

          <div className="space-y-3">
            <div>
              <span className="font-semibold text-gray-300">User:</span>
              <p className="">
                {order.userId && order.userId.name
                  ? order.userId.name
                  : order.userName || "Unknown"}
              </p>
            </div>

            <div>
              <span className="font-semibold text-gray-300">Contact:</span>
              <p className="">{order.contact || "N/A"}</p>
              {order.contact && (
                <div className="flex gap-3 mt-1">
                  <a
                    href={`tel:${order.contact}`}
                    className="bg-blue-600  px-3 py-1 rounded hover:bg-blue-700 transition"
                  >
                    📞 Call
                  </a>
                  <a
                    href={`https://wa.me/${order.contact}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600  px-3 py-1 rounded hover:bg-green-700 transition"
                  >
                    💬 WhatsApp
                  </a>
                </div>
              )}
            </div>

            <div>
              <span className="font-semibold text-gray-300">Address:</span>
              <a
                href={order.address}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[#ff1200] hover:text-[#ff3300] underline mt-1"
              >
                📍 View on Google Maps
              </a>
            </div>

            <div>
              <span className="font-semibold text-gray-300">
                Assigned Rider:
              </span>
              <p className="">
                {order.riderId && order.riderId.name
                  ? order.riderId.name
                  : "Not Assigned"}
              </p>
            </div>

            {order.riderId && order.riderId.phone && (
              <div>
                <span className="font-semibold text-gray-300">
                  Rider Contact:
                </span>
                <p className="">{order.riderId.phone}</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-3 ">Order Items:</h4>
          <div className="bg-[#0e1113] border border-gray-600 rounded-lg p-4">
            <ul className="space-y-2">
              {order.items.map((item, idx) => (
                <li key={idx} className="flex justify-between">
                  <span className="text-gray-300">
                    {item.menuItem && item.menuItem.name
                      ? item.menuItem.name
                      : "Unknown Item"}
                  </span>
                  <span className="font-semibold text-[#ff1200]">
                    × {item.quantity}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="font-semibold text-lg mb-3 ">Order Progress:</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-400">
            <span>⌛</span>
            <span>Pending Confirmation</span>
          </div>
          {order.confirmed && (
            <div className="flex items-center gap-2 text-[#ff1200] font-semibold">
              <span>✅</span>
              <span>Order Confirmed</span>
            </div>
          )}
          {order.preparing && (
            <div className="flex items-center gap-2 text-[#ff1200] font-semibold">
              <span>✅</span>
              <span>Order is being prepared</span>
            </div>
          )}
          {order.packing && (
            <div className="flex items-center gap-2 text-[#ff1200] font-semibold">
              <span>✅</span>
              <span>Order is being packed</span>
            </div>
          )}
          {order.outForDelivery && (
            <div className="flex items-center gap-2 text-[#ff1200] font-semibold">
              <span>✅</span>
              <span>Out for Delivery</span>
            </div>
          )}
        </div>
      </div>

      {showActions && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Confirm Order:
              </label>
              <select
                value={order.confirmed || ""}
                onChange={(e) =>
                  handleMakeChanges(order._id, "confirmed", e.target.value)
                }
                className="w-full p-2 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] "
              >
                <option value="" className="bg-[#0e1113]">
                  Choose
                </option>
                <option value="✅ Order Confirmed" className="bg-[#0e1113]">
                  ✅ Order Confirmed
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Set Preparing:
              </label>
              <select
                value={order.preparing || ""}
                onChange={(e) =>
                  handleMakeChanges(order._id, "preparing", e.target.value)
                }
                className="w-full p-2 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] "
              >
                <option value="" className="bg-[#0e1113]">
                  Choose
                </option>
                <option
                  value="✅ Preparing Your Order"
                  className="bg-[#0e1113]"
                >
                  ✅ Preparing Your Order
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Set Packaging:
              </label>
              <select
                value={order.packing || ""}
                onChange={(e) =>
                  handleMakeChanges(order._id, "packing", e.target.value)
                }
                className="w-full p-2 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] "
              >
                <option value="" className="bg-[#0e1113]">
                  Choose
                </option>
                <option value="✅ Packing Your Order" className="bg-[#0e1113]">
                  ✅ Packing Your Order
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Set Out For Delivery:
              </label>
              <select
                value={order.outForDelivery || ""}
                onChange={(e) =>
                  handleMakeChanges(order._id, "outForDelivery", e.target.value)
                }
                className="w-full p-2 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] "
              >
                <option value="" className="bg-[#0e1113]">
                  Choose
                </option>
                <option
                  value="✅ Your order is out for delivery"
                  className="bg-[#0e1113]"
                >
                  ✅ Your order is out for delivery
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Assign Rider:
            </label>
            <select
              value={order.riderId?._id || ""}
              onChange={(e) => handleAssignRider(order._id, e.target.value)}
              className="w-full p-2 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] "
            >
              <option value="" className="bg-[#0e1113]">
                Select Rider
              </option>
              {riders.map((rider) => (
                <option
                  key={rider._id}
                  value={rider._id}
                  className="bg-[#0e1113]"
                >
                  {rider.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {!showActions && (
        <button
          onClick={() => handleDeleteFinishedOrder(order._id)}
          className="mt-6 w-full bg-red-600  py-3 rounded-lg font-semibold hover:bg-red-700 transition"
        >
          🗑 Delete
        </button>
      )}
    </div>
  );

  return (
    <div className="ml-65">
      <AdminSideBar />
      <div
        className="p-6"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-[#333]">
          📦 Admin Orders Dashboard
        </h2>

        <div className="flex justify-center mb-8">
          <div className="flex rounded-lg shadow-lg p-1">
            <button
              className={`px-6 py-3 rounded-lg transition ${
                view === "current"
                  ? "bg-[#ff2100] "
                  : "text-gray-600 hover:text-[#ff2100]"
              }`}
              onClick={() => setView("current")}
            >
              🟡 Current Orders
            </button>
            <button
              className={`px-6 py-3 rounded-lg transition ${
                view === "finished"
                  ? "bg-[#ff2100] "
                  : "text-gray-600 hover:text-[#ff2100]"
              }`}
              onClick={() => setView("finished")}
            >
              ✅ Finished Orders
            </button>
          </div>
        </div>

        <section>
          {view === "current" ? (
            activeOrders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">
                  No current orders found.
                </p>
              </div>
            ) : (
              activeOrders.map((order) => renderOrder(order, true))
            )
          ) : finishedOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No finished orders found.</p>
            </div>
          ) : (
            finishedOrders.map((order) => renderOrder(order, false))
          )}
        </section>
      </div>
    </div>
  );
}
