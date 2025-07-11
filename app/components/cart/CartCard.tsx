import { BiMinus, BiPlus, BiTrash } from "react-icons/bi";
import { useCartContext } from "../../Context/CartContext";

const CartCard = ({
  name,
  description,
  price,
  quantity,
  id,
}: {
  name: string;
  description: string;
  price: string;
  quantity: number;
  id: string;
}) => {
  const { updateQuantity, removeFromCart } = useCartContext();

  return (
    <div className="bg-[#181c1f] flex items-center justify-between gap-4 rounded-lg p-3 sm:p-4 border border-gray-600">
      <div className="flex items-center gap-4 ">
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
          <p className="text-[0.825rem]">Price: GH₵{price}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex py-0.5 justify-center items-center w-fit px-2 border border-gray-500 rounded-lg">
          <button onClick={() => updateQuantity(id, quantity + 1)}>
            <BiPlus />
          </button>
          <input
            type="number"
            min={1}
            className="w-8 h-8 text-center rounded flex items-center justify-center appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-0"
            value={quantity}
            readOnly
          />
          <button
            onClick={() =>
              quantity > 1
                ? updateQuantity(id, quantity - 1)
                : removeFromCart(id)
            }
          >
            <BiMinus />
          </button>
        </div>
        <button onClick={() => removeFromCart(id)} className=" cursor-pointer">
          <BiTrash />
        </button>
      </div>
    </div>
  );
};

export default CartCard;
