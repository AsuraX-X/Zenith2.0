import type { Order } from "../../Interfaces/Interfaces";

const OrderCard = ({
  order,
  isActive = true,
}: {
  order: Order;
  isActive?: boolean;
}) => {
  const steps = [
    { key: "confirmed", label: "Order Confirmed" },
    { key: "preparing", label: "Order is being prepared" },
    { key: "packing", label: "Order is being packed" },
    { key: "outForDelivery", label: "Out for Delivery" },
    { key: "delivered", label: "Delivered" },
  ];

    const handleConfirmReceived = async (orderId: string) => {
    try {
      const res = await fetch("http://localhost:3000/user/mark-finished", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server response:", errorText);
        alert("Failed to confirm receipt.");
      }      
    } catch (error) {
      console.error("Confirm error:", error);
    }
  };

  return (
    <div
      key={order._id}
      className="rounded-lg border border-gray-600 p-4 sm:p-6 mb-4 sm:mb-6 text-white"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div>
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[#ff1200]">
            Order Details
          </h3>

          <div className="space-y-2 sm:space-y-3">
            <div>
              <span className="font-semibold text-gray-300 text-sm sm:text-base">
                Contact:
              </span>
              <p className="text-gray-100 text-sm sm:text-base break-words">
                {order.contact}
              </p>
            </div>

            <div>
              <span className="font-semibold text-gray-300 text-sm sm:text-base">
                Address:
              </span>
              <p className="text-gray-100 text-sm sm:text-base break-words">
                {order.address}
              </p>
            </div>

            <div>
              <span className="font-semibold text-gray-300 text-sm sm:text-base">
                Assigned Rider:
              </span>
              <p className="text-gray-100 text-sm sm:text-base">
                {order.riderId && order.riderId.name
                  ? order.riderId.name
                  : "Not Assigned"}
              </p>
            </div>

            {order.riderId && order.riderId.phone && (
              <div>
                <span className="font-semibold text-gray-300 text-sm sm:text-base">
                  Rider Contact:
                </span>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-2">
                  <a
                    href={`tel:${order.riderId.phone}`}
                    className="bg-[#ff1200] px-3 py-2 rounded hover:bg-[#d81b00] transition text-white text-center text-sm sm:text-base"
                  >
                    📞 Call
                  </a>
                  <a
                    href={`https://wa.me/${order.riderId.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 px-3 py-2 rounded hover:bg-green-700 transition text-white text-center text-sm sm:text-base"
                  >
                    💬 WhatsApp
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 md:mt-0">
          <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-[#ff1200]">
            Order Items:
          </h4>
          <div className="bg-[#181c1f] rounded-lg p-3 sm:p-4 border border-gray-600">
            <ul className="space-y-2">
              {order.items.map((item) => (
                <li
                  key={item.menuItem?._id || item._id}
                  className="flex justify-between items-start border-b border-gray-600 pb-2 last:border-b-0 last:pb-0"
                >
                  <span className="text-gray-100 text-sm sm:text-base flex-1 pr-2 leading-tight">
                    {item.menuItem && item.menuItem.name
                      ? item.menuItem.name
                      : "Unknown Item"}
                  </span>
                  <span className="font-semibold text-[#ff1200] text-sm sm:text-base whitespace-nowrap">
                    × {item.quantity}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold text-base sm:text-lg mt-4 sm:mt-0 sm:mb-3 text-[#ff1200]">
          Order Progress:
        </h4>
        <div className="space-y-2">
          <div>
            <span>Pending Confirmation</span>
          </div>
          {steps.map(({ key, label }) =>
            order[key] ? (
              <div
                key={key}
                className="flex items-center gap-2 text-green-600 font-semibold"
              >
                <span>✅</span>
                <span>{label}</span>
              </div>
            ) : null
          )}
        </div>
      </div>
      {isActive && (
        <button
          onClick={() => handleConfirmReceived(order._id)}
          className="cursor-pointer px-4 bg-[#ff1200] py-2 sm:py-3 rounded-lg font-semibold hover:bg-[#d81b00] transition text-white mt-3 sm:mt-4 text-sm sm:text-base"
        >
          Confirm Order Received
        </button>
      )}
    </div>
  );
};

export default OrderCard;
