import { BiMinus, BiPlus } from "react-icons/bi";
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
          <button onClick={() => updateQuantity(id, quantity + 1)}>
            <BiPlus />
          </button>
          <input
            type="number"
            min={1}
            className="w-8 h-8 text-center rounded flex items-center justify-center appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-0"
            value={quantity}
            onChange={(e) => {
              updateQuantity(id, parseInt(e.target.value));
            }}
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
      </div>
    </div>
  );
};

export default CartCard;
