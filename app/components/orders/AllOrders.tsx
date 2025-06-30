import { BiChevronRight, BiPlusCircle } from "react-icons/bi";
import food from "../../assets/Data/food.json";
import OrderCard from "./OrderCard";
import { NavLink } from "react-router";
import DelivOrPickUp from "./DelivOrPickUp";
import { LuMapPin } from "react-icons/lu";

const AllOrders = () => {
  return (
    <div className="mt-20 px-40">
      <section>
        <h1 className="text-3xl font-bold pb-2 mb-6 border-b border-b-[#ff2100]">
          Orders
        </h1>
        <div className="flex flex-col gap-4">
          {food.map(
            ({ description, title, price }, i) =>
              i < 4 && (
                <div key={i}>
                  <OrderCard
                    description={description}
                    name={title}
                    price={price.toFixed(2)}
                  />
                </div>
              )
          )}
        </div>
        <NavLink to="/menu">
          <div className="flex cursor-pointer items-center py-6 border-b border-b-gray-500 gap-2 px-4">
            <BiPlusCircle size={30} color="#ff2100" />
            <p className="text-xl">Add more</p>
          </div>
        </NavLink>
        <div className="flex cursor-pointer items-center py-6 border-b border-b-gray-500 gap-2 px-4">
          <input
            type="text"
            placeholder="Leave a comment..."
            className=" placeholder:text-gray-500 text-xl"
          />
        </div>
      </section>
      <section className="pb-4  border-b border-b-gray-500">
        <DelivOrPickUp />
      </section>
      <section className="border-b border-b-gray-500">
        <div className="flex text-xl flex-col py-4 px-4 border-b border-b-gray-500 text-right">
          <p className="flex justify-between">
            <span className="font-bold">Subtotal: </span>
            <span>GH₵ 309.00</span>
          </p>
          <p className="flex justify-between">
            <span className="font-bold">Delivery: </span> <span>GH₵ 30.00</span>
          </p>
        </div>
        <div className="px-4">
          <p className="flex justify-between text-2xl py-2">
            <span className="font-bold text-[#ff1200]">Total: </span>{" "}
            <span>GH₵ 30.00</span>
          </p>
        </div>
      </section>
      <section>
        <div className="flex justify-between items-center px-4 py-2 cursor-pointer border-b border-b-gray-500">
          <div className="flex items-center text-xl gap-2">
            <LuMapPin /> Location
          </div>
          <div>
            <BiChevronRight size={40} color="#6a7282"/>
          </div>
        </div>
        <div className="px-4 py-4">
          <button className="bg-[#ff1200] w-full rounded-full py-2 text-2xl font-bold">Place Order</button>
        </div>
      </section>
    </div>
  );
};

export default AllOrders;
