import { Helmet } from "react-helmet";
import Auth from "../auth/Auth";
import Footer from "../components/general/Footer";
import Header from "../components/general/Header";
import About from "../components/home/About";
import HeroSection from "../components/home/HeroSection";
import ShortMenu from "../components/home/ShortMenu";
import { useEffect, useState } from "react";
import type { MenuItem } from "../components/general/General";

export default function Home() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const getItems = async () => {
      const res = await fetch("http://localhost:3000/menu");
      const data: MenuItem[] = await res.json();
      setMenuItems(data);
    };

    getItems();
  }, []);

  useEffect(() => {
    console.log(menuItems);
  }, [menuItems]);

  return (
    <div>
      <Helmet>
        <title>DE BLISS</title>
        <meta name="home" content="Welcome to De Bliss!" />
      </Helmet>
      <Auth />
      <Header />
      <HeroSection />
      <ShortMenu />
      <About />
      <Footer />
    </div>
  );
}
