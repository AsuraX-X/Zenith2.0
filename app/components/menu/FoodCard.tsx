import { useState } from "react";
import { BiPlus } from "react-icons/bi";
import FoodPopUp from "./FoodPopUp";
import { AnimatePresence, motion } from "motion/react";
import { usePopUpStore } from "../../stores/popUpStore";

const FoodCard = ({
  name,
  description,
  price,
  id,
  image,
}: {
  name: string;
  description: string;
  price: string;
  id: string;
  image: string;
}) => {
  const [isOrdering, setIsOrdering] = useState(false);
  const { addPopUp } = usePopUpStore();

  return (
    <div className="flex items-center justify-between gap-4 border border-gray-500 pr-4 rounded-lg overflow-hidden">
      <AnimatePresence>
        {isOrdering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { delay: 0.2 },
            }}
            className="fixed z-10 bg-black/25 h-screen top-0 right-0 left-0 flex justify-center items-end"
          >
            <FoodPopUp
              close={() => setIsOrdering(false)}
              isOrdering={isOrdering}
              name={name}
              description={description}
              price={price}
              image={image}
              menuItemId={id}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="size-40 shrink-0 bg-gray-600">
        <img src={image} alt={name} />
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full justify-center sm:justify-between sm:items-center">
        <div>
          <p className="">{name}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex text-[#e87171] text-nowrap">
            <p>GH₵{price}</p>
          </div>
          <button
            onClick={() => {
              setIsOrdering(true);
              addPopUp();
            }}
            className="bg-white cursor-pointer flex justify-center items-center rounded-full"
          >
            <BiPlus color="#ff2100" size={30} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
