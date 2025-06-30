import { useState } from "react";
import { BiMinus, BiPlus } from "react-icons/bi";

const OrderCard = ({
  name,
  description,
  price,
}: {
  name: string;
  description: string;
  price: string;
}) => {
  const [count, setCount] = useState(2);

  return (
    <div className="flex items-center justify-between gap-4 border-b border-b-gray-500 pb-4 pt-6 px-4 overflow-hidden">
      <div className="flex items-center gap-4">
        <div className="min-h-35 min-w-35 bg-gray-600 rounded-l-lg">
          <img src="" alt="" />
        </div>
        <div>
          <p className="">{name}</p>
          <p
            className="text-gray-400 overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {description}
          </p>
          <p>Price: GH₵{price}</p>
        </div>
      </div>
      <div>
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
      </div>
    </div>
  );
};

export default OrderCard;
