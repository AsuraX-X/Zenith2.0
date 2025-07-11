import { NavLink } from "react-router";

const HeroSection = () => {
  const scrollToElement = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView();
    }
  };

  return (
    <div>
      <section className="h-screen bg-[url(app/assets/images/HI.png)] bg-origin-border bg-center flex px-4">
        <div className="flex flex-col justify-center items-center sm:items-start sm:pl-20 w-full">
          <h1 className="text-7xl sm:text-8xl font-bold font-serif text-[#ff2100]">
            DE BLISS
          </h1>
          <p className="sm:text-2xl text-xl font-bold mb-4">
            Lorem ipsum dolor sit amet consectetur
          </p>
          <div className="flex text-center gap-4">
            <NavLink to="/menu">
              <button className="w-34 py-2 rounded-lg bg-[#000000]  border border-[#ff2100] cursor-pointer">
                SEE MENU
              </button>
            </NavLink>
            <button
              onClick={() => scrollToElement("contact")}
              className="w-34 py-2 rounded-lg bg-[#000000]  border border-[#ff2100] cursor-pointer"
            >
              CONTACT US
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
