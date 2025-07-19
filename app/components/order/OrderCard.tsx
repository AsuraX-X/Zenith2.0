import { BsWhatsapp } from "react-icons/bs";
import type { Order } from "../../Interfaces/Interfaces";
import { BiCheck, BiPhone } from "react-icons/bi";
import { motion } from "motion/react";
import { useState, useEffect } from "react";

const OrderCard = ({
  order,
  isActive = true,
  onOrderUpdate,
}: {
  order: Order;
  isActive?: boolean;
  onOrderUpdate?: (updatedOrder: Order) => void;
}) => {
  const [currentOrder, setCurrentOrder] = useState<Order>(order);

  // Poll for order updates every 10 seconds
  useEffect(() => {
    if (!isActive) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/user/order/${order._id}`);
        if (response.ok) {
          const updatedOrder = await response.json();
          setCurrentOrder(updatedOrder);
          onOrderUpdate?.(updatedOrder);
        }
      } catch (error) {
        console.error("Failed to fetch order updates:", error);
      }
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(pollInterval);
  }, [order._id, isActive, onOrderUpdate]);

  // Update local state when prop changes
  useEffect(() => {
    setCurrentOrder(order);
  }, [order]);

  const steps = [
    { key: "confirmed", label: "Order Confirmed" },
    { key: "preparing", label: "Preparing" },
    { key: "packing", label: "Packing" },
    { key: "outForDelivery", label: "Out for Delivery" },
  ];

  const handleConfirmReceived = async (orderId: string) => {
    try {
      const res = await fetch("/api/user/mark-finished", {
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
      key={currentOrder._id}
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
                {currentOrder.contact}
              </p>
            </div>

            <div>
              <span className="font-semibold text-gray-300 text-sm sm:text-base">
                Address:
              </span>
              <p className="text-gray-100 text-sm sm:text-base break-words">
                {currentOrder.location?.name ||
                  (currentOrder as Order & { address?: string }).address ||
                  "Address not available"}
              </p>
            </div>

            <div>
              <span className="font-semibold text-gray-300 text-sm sm:text-base">
                Assigned Rider:
              </span>
              <p className="text-gray-100 text-sm sm:text-base">
                {currentOrder.riderId && currentOrder.riderId.name
                  ? currentOrder.riderId.name
                  : "Not Assigned"}
              </p>
            </div>

            {currentOrder.riderId && currentOrder.riderId.phone && (
              <div>
                <span className="font-semibold text-gray-300 text-sm sm:text-base">
                  Rider Contact:
                </span>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-2">
                  <a
                    href={`tel:${currentOrder.riderId.phone}`}
                    className="bg-[#ff1200] flex justify-center items-center gap-2 px-3 py-2 rounded hover:bg-[#d81b00] transition text-white text-center text-sm sm:text-base"
                  >
                    <BiPhone /> Call
                  </a>
                  <a
                    href={`https://wa.me/${currentOrder.riderId.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 flex justify-center items-center gap-2 px-3 py-2 rounded hover:bg-green-700 transition text-white text-center text-sm sm:text-base"
                  >
                    <BsWhatsapp /> WhatsApp
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
              {currentOrder.items.map((item) => (
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
        <h4 className="font-semibold text-base sm:text-lg mt-4 mb-3 sm:mt-0 sm:mb-3 text-[#ff1200]">
          Order Progress
        </h4>
        <div className="space-y-2">
          <div className="flex-col flex md:flex-row mb-4 sm:px-9">
            {steps.map(({ key, label }, i) => (
              <div
                key={key}
                className="flex items-center w-fit md:flex-row flex-col"
              >
                <div className="relative flex items-center justify-center">
                  <motion.div
                    initial={{
                      borderColor: "#6c6c6c",
                      backgroundColor: "#0e1113",
                    }}
                    animate={{
                      borderColor: (() => {
                        if (currentOrder[key]) return "#00ff3c";

                        const completedSteps = steps
                          .slice(0, i)
                          .every((step) => currentOrder[step.key]);
                        const isCurrentStep =
                          completedSteps && !currentOrder[key];

                        return isCurrentStep ? "#00ff3c" : "#6c6c6c";
                      })(),
                      backgroundColor: currentOrder[key]
                        ? "#00ff3c"
                        : "#0e1113",
                    }}
                    className="border-gray-300 border rounded-full p-0.5"
                  >
                    <motion.span
                      initial={{ color: "#0e1113" }}
                      animate={{
                        color: currentOrder[key] ? "#000000" : "#0e1113",
                      }}
                    >
                      <BiCheck />
                    </motion.span>
                  </motion.div>

                  <motion.span
                    initial={{ color: "#ffffff" }}
                    animate={{
                      color: currentOrder[key] ? "#00ff3c" : "#ffffff",
                    }}
                    className="absolute md:top-[100%] left-[100%] text-xs sm:ml-0 md:mt-1 text-nowrap ml-3 md:left-auto"
                  >
                    {label}
                  </motion.span>
                </div>
                {i < steps.length - 1 && (
                  <motion.div
                    initial={{ backgroundColor: "#6c6c6c" }}
                    animate={{
                      backgroundColor: currentOrder[key]
                        ? "#00ff3c"
                        : "#6c6c6c",
                    }}
                    className="bg-gray-400 md:w-30 w-px h-10 md:h-px"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {isActive && (
        <button
          onClick={() => handleConfirmReceived(currentOrder._id)}
          className="cursor-pointer px-4 bg-[#ff1200] py-2 sm:py-3 rounded-lg font-semibold hover:bg-[#d81b00] transition text-white mt-3 sm:mt-6 text-sm sm:text-base"
        >
          Confirm Order Received
        </button>
      )}
    </div>
  );
};

export default OrderCard;
