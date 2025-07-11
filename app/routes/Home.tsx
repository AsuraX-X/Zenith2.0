import { Helmet } from "react-helmet";
import Auth from "../auth/Auth";
import Footer from "../components/general/Footer";
import Header from "../components/general/Header";
import About from "../components/home/About";
import HeroSection from "../components/home/HeroSection";
import ShortMenu from "../components/home/ShortMenu";

export default function Home() {

  
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
