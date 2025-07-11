import type { MenuItem } from "../../Interfaces/Interfaces";
import { useAdminContext } from "../../Context/AdminContext";
import { motion } from "motion/react";

const AdminMenuItemCard = ({ item }: { item: MenuItem }) => {
  const { handleEditItem, handleDeleteItem } = useAdminContext();

  return (
    <div className="border flex flex-col justify-between border-gray-600 bg-[#181c1f] rounded-lg overflow-hidden ">
      <div>
        <div className="min-h-1/2 bg-gray-300 shrink-0">
          <img
            src={typeof item.image === "string" ? item.image : ""}
            alt={item.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        </div>
        <div className="space-y-2 py-2 px-4">
          <h3
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
            className="font-semibold text-lg text-white break-words whitespace-normal"
          >
            {item.name}
          </h3>
          <p className="text-gray-400">{item.category}</p>
          <p className="text-[#ff1200] font-bold text-lg">₵{item.price}</p>
        </div>
      </div>
      <div className="flex gap-2 mt-4 px-4 pb-4">
        <motion.button
        whileHover={{backgroundColor:"#ff1200"}}
          onClick={() => handleEditItem(item)}
          className="flex-1 border border-[#ff1200] text-white py-2 rounded-lg"
        >
          Edit
        </motion.button>
        <motion.button
        whileHover={{backgroundColor:"#ff1200"}}
          onClick={() => handleDeleteItem(item._id)}
          className="flex-1 border border-[#ff1200] py-2 rounded-lg"
        >
          Delete
        </motion.button>
      </div>
    </div>
  );
};

export default AdminMenuItemCard;
