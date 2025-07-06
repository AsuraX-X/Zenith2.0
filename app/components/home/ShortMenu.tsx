import { NavLink } from "react-router";

const ShortMenu = () => {
  return (
    <section className="px-8 flex flex-col gap-2 pt-20" id="menu">
      <h1 className="text-3xl">Explore Our Menu</h1>
      <p>
        Signature dishes for every taste - from classic recipies to bold
        culinary experiments
      </p>
      <NavLink to="/menu">
        <button className="px-4 py-2 mb-2 rounded-full border border-[#ff1200] w-fit cursor-pointer">
          View more
        </button>
      </NavLink>
      <div className="h-screen flex gap-4">
        <div className="flex w-2/3 flex-col gap-4">
          <div className="w-full h-2/3 bg-gray-400 rounded-lg"></div>
          <div className="h-1/3 flex gap-4">
            <div className="bg-gray-400 rounded-lg h-full w-1/2"></div>
            <div className="bg-gray-400 rounded-lg h-full w-1/2"></div>
          </div>
        </div>
        <div className="w-1/3 flex flex-col gap-4">
          <div className="w-full h-1/2 bg-gray-400 rounded-lg"></div>
          <div className="w-full h-1/2 bg-gray-400 rounded-lg"></div>
        </div>
      </div>
    </section>
  );
};

export default ShortMenu;
