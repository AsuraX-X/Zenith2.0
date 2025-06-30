import { useEffect, useState } from "react";
import food from "../../assets/Data/food.json";
import FoodCard from "./FoodCard";
import { BiFilter } from "react-icons/bi";
import { motion } from "motion/react";
import { BsDot } from "react-icons/bs";

const FullMenu = () => {
  const categories = Array.from(new Set(food.map((item) => item.type)));

  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);

  const [isOpen, setIsOpen] = useState(false);

  const [filter, setFilter] = useState<string[]>([]);

  const addFilter = (fil: string) => {
    if (filter.includes(fil)) {
      setFilter(filter.filter((item) => fil != item));
    } else {
      setFilter((prev) => [...prev, fil]);
    }
    console.log(filter);
  };

  useEffect(() => {
    if (filter.length > 0) {
      setUniqueCategories(filter);
    } else {
      setUniqueCategories(categories);
    }
  }, [filter]);

  return (
    <div className="sm:px-30 px-4">
      <section className="flex flex-col justify-center items-center pb-4">
        <h1 className="text-4xl font-bold">Our Menu</h1>
        <p className="text-xl text-[#ff2100]">
          Delicious. Bold. Unforgettable.
        </p>
      </section>
      <section className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-0.5 border border-gray-500 rounded-lg cursor-pointer"
        >
          <BiFilter size={25} />
        </button>
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0,
          }}
          className="px-4 py-2 rounded-lg bg-[#111518] absolute overflow-hidden"
        >
          <div className="divide-gray-500 divide-y">
            {categories.map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <p className="py-1 cursor-pointer" onClick={() => addFilter(_)}>
                  {_}
                </p>
                {filter.includes(_) && <BsDot size={20} color="#33ff00" />}
              </div>
            ))}
          </div>
        </motion.div>
      </section>
      <section className="">
        {uniqueCategories.map((category, i) => (
          <div className="py-4" key={i}>
            <h1 className="text-xl font-bold border-b-2 border-b-[#ff2100] pb-2 mb-8">
              {category.toUpperCase()}
            </h1>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
              {food.map(
                ({ title, type, description, price }, i) =>
                  type === category && (
                    <FoodCard
                      key={i}
                      name={title}
                      description={description}
                      price={price.toFixed(2)}
                    />
                  )
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default FullMenu;
