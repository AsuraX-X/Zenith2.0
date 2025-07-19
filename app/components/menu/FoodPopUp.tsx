import { motion } from "motion/react";
import { useState } from "react";
import { BiMinus, BiPlus } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import {} from "../../Context/CartContext";
import { useCartStore } from "../../stores/cartStore";
import { usePopUpStore } from "../../stores/popUpStore";
import { useUserStore } from "../../stores/userStore";
import { useAuthStore } from "../../stores/authStore";

const FoodPopUp = ({
  close,
  isOrdering,
  name,
  description,
  price,
  image,
  menuItemId,
}: {
  close: () => void;
  isOrdering: boolean;
  name: string;
  description: string;
  price: string;
  image: string;
  menuItemId: string;
}) => {
  const { addToCart } = useCartStore();
  const cart = useCartStore((state) => state.cart);
  const user = useUserStore((state) => state.user);
  const { setAuth } = useAuthStore();
  const { addPopUp, removePopUp } = usePopUpStore();

  const cartItem = cart.find((item) => item.menuItem._id === menuItemId);
  const [quantity, setQuantity] = useState(cartItem ? cartItem.quantity : 1);

  const handleAddToCart = () => {
    // Check if user is signed in
    if (!user) {
      setAuth("login");
      addPopUp();
      return;
    }

    addToCart(menuItemId, name, description, price, quantity);

    close();
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={isOrdering && { y: 0 }}
      exit={{ y: "100%" }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      className="relative h-3/4 sm:w-1/2 w-full rounded-t-lg bg-[#0e1113] overflow-hidden"
    >
      <button
        className="absolute right-4 top-4 bg-white cursor-pointer rounded-lg p-1"
        onClick={() => {
          close();
          removePopUp();
        }}
      >
        <IoClose size={20} color="#ff1200" />
      </button>
      <div className="h-1/2 bg-gray-400">
        <img src={image} alt={name} />
      </div>
      <div className="flex flex-col justify-between h-1/2">
        <div className="px-4 py-4">
          <p>{name}</p>
          <p className="text-[#e87171] text-2xl font-bold">GH₵{price}</p>
          <p className="text-gray-400">{description}</p>
        </div>
        <div className="px-4 flex flex-col">
          <label htmlFor="note" className="text-gray-500">
            Add a note
          </label>
          <motion.input
            whileFocus={{
              borderBottomColor: "#ff2100",
            }}
            type="text"
            placeholder="It may not be possible to meet all requests"
            className="py-2 focus:outline-0 placeholder:text-gray-500 border-b border-b-[#e87171]"
          />
        </div>
        <div className="px-4 py-6 flex items-center justify-center gap-4">
          <div className="flex py-0.5 justify-center items-center w-fit px-2 border border-gray-500 rounded-lg">
            <button onClick={() => setQuantity(quantity + 1)}>
              <BiPlus />
            </button>
            <input
              type="number"
              className="w-8 h-8 text-center rounded flex items-center justify-center appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-0"
              value={quantity}
              readOnly
            />
            <button onClick={() => quantity > 1 && setQuantity(quantity - 1)}>
              <BiMinus />
            </button>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="flex w-full py-2 cursor-pointer bg-[#ff1200] justify-center items-center rounded-lg"
            onClick={handleAddToCart}
          >
            Add to cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default FoodPopUp;
