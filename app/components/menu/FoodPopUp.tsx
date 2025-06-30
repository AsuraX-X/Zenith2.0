import { motion } from "motion/react";
import { useState } from "react";
import { BiMinus, BiPlus } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { useAuthContext } from "../../Context/AuthContext";
import { usePopUpContext } from "../../Context/PopUpContext";

const FoodPopUp = ({
  close,
  isOrdering,
  name,
  description,
  price,
}: {
  close: () => void;
  isOrdering: boolean;
  name: string;
  description: string;
  price: string;
}) => {
  const [count, setCount] = useState(0);

  const { setAuth } = useAuthContext();

  const { removePopUp, addPopUp } = usePopUpContext();

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={isOrdering && { y: 0 }}
      exit={{ y: "100%" }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      className="relative h-3/4 w-1/2 rounded-t-lg bg-[#0e1113] overflow-hidden"
    >
      <button
        className="absolute right-4 top-4 bg-white cursor-pointer rounded-full p-1"
        onClick={() => {
          close();
          removePopUp();
        }}
      >
        <IoClose size={20} color="#ff1200" />
      </button>
      <div className="h-1/2 bg-gray-400"></div>
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
          <div className="flex py-0.5 justify-center items-center w-fit px-2 border border-gray-500 rounded-full">
            <button onClick={() => setCount(count + 1)}>
              <BiPlus />
            </button>
            <input
              type="number"
              className="w-8 h-8 text-center rounded flex items-center justify-center appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-0"
              value={count}
              readOnly
            />
            <button onClick={() => setCount(count - 1)}>
              <BiMinus />
            </button>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="flex w-full py-2 cursor-pointer bg-[#ff1200] justify-center items-center rounded-full"
            onClick={() => {
              setAuth("login");
              addPopUp();
            }}
          >
            Place Order
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default FoodPopUp;
