import { useEffect, useState, useRef } from "react";
import FoodCard from "./FoodCard";
import { BiFilter } from "react-icons/bi";
import { motion } from "motion/react";
import { BsDot } from "react-icons/bs";
import type { MenuItem } from "../general/General";

const FullMenu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const [filter, setFilter] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (popupRef.current && popupRef.current.contains(target)) {
        return;
      }
      if (buttonRef.current && buttonRef.current.contains(target)) {
        return;
      }
      setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick, true); // use capture phase
    return () => {
      document.removeEventListener("mousedown", handleClick, true);
    };
  }, [isOpen]);

  useEffect(() => {
    fetch("http://localhost:3000/menu")
      .then((res) => res.json())
      .then((data: MenuItem[]) => {
        setMenuItems(data);
        const uniqueTypes = Array.from(
          new Set(data.map((item: MenuItem) => item.category))
        );
        setCategories(uniqueTypes);
        setUniqueCategories(uniqueTypes);
      })
      .catch((err) => console.error("Failed to load menu", err));
  }, []);

  const addFilter = (fil: string) => {
    if (filter.includes(fil)) {
      setFilter(filter.filter((item) => fil !== item));
    } else {
      setFilter((prev) => [...prev, fil]);
    }
  };

  useEffect(() => {
    if (filter.length > 0) {
      setUniqueCategories(filter);
    } else {
      setUniqueCategories(categories);
    }
  }, [filter, categories]);

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
          ref={buttonRef}
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-0.5 border border-gray-500 rounded-lg cursor-pointer"
        >
          <BiFilter size={25} />
        </button>
        <motion.div
          ref={popupRef}
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0,
          }}
          className="absolute overflow-hidden"
        >
          <div className="px-4 py-2 rounded-lg bg-[#242729] ">
            <div className="divide-gray-500 divide-y">
              {categories.map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <p
                    className="py-1 cursor-pointer"
                    onClick={() => addFilter(_)}
                  >
                    {_}
                  </p>
                  {filter.includes(_) && <BsDot size={20} color="#33ff00" />}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
      <section className="">
        {uniqueCategories.length > 0 ? (
          uniqueCategories.map((category, i) => (
            <div className="py-4" key={i}>
              <h1 className="text-xl font-bold border-b-2 border-b-[#ff2100] pb-2 mb-8">
                {category.toUpperCase()}
              </h1>
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                {menuItems
                  .filter((item: MenuItem) => item.category === category)
                  .map(({ _id, name, description, price, image }: MenuItem) => (
                    <FoodCard
                      key={_id}
                      id={_id}
                      name={name}
                      description={description}
                      price={price.toFixed(2)}
                      image={image}
                    />
                  ))}
              </div>
            </div>
          ))
        ) : (
          <div className="h-[65vh] flex justify-center items-center gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{
                  repeat: Infinity,
                  delay: i/4,
                }}
                className="size-8 rounded-full bg-[#ff1200]"
                key={i}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default FullMenu;
