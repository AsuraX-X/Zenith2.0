import { NavLink } from "react-router";

const ShortMenu = () => {
  return (
    <section id="menu" className="px-8 sm:h-[80vh] h-[200vh] pt-10 mt-20">
      <h1 className="text-3xl mb-6">Explore Our Menu</h1>
      <div className=" flex flex-col sm:flex-row h-full gap-4">
        <div className=" h-full flex flex-col gap-4 flex-1">
          <div className="rounded-2xl flex-[0.5] w-full relative  lg:text-nowrap">
            <div className="lg:absolute">
              <p className="text-xl">
                Signature dishes for every taste - from classic
                <span className="lg:hidden">
                  recipies to bold culinary experiments
                </span>
              </p>
              <p className="text-xl lg:opacity-100 opacity-0">
                recipies to bold culinary
              </p>
            </div>
          </div>
          <div className="bg-gray-300 rounded-2xl flex-2"></div>
          <div className="bg-gray-300 rounded-2xl flex-1"></div>
        </div>
        <div className=" h-full flex-col gap-4 flex flex-[1.5]">
          <div className=" rounded-2xl flex flex-1 items-end gap-4">
            <NavLink to="/menu">
              <button className="px-4 py-2 rounded-full bg-[#000000]  border border-[#ff2100] cursor-pointer">
                View Full Menu
              </button>
            </NavLink>
            <div className="bg-gray-300 flex flex-1 rounded-2xl h-full"></div>
          </div>
          <div className="bg-gray-300 rounded-2xl flex-3"></div>
        </div>
        <div className=" h-full flex-col gap-4 flex flex-[1.25]">
          <div className="bg-gray-300 rounded-2xl flex-[1.4]"></div>
          <div className="bg-gray-300 rounded-2xl flex-1"></div>
        </div>
      </div>
    </section>
  );
};

export default ShortMenu;
