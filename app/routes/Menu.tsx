import { Helmet } from "react-helmet";
import Auth from "../auth/Auth";
import Header from "../components/general/Header";
import FullMenu from "../components/menu/FullMenu";

const Menu = () => {
  return (
    <div className="mt-20">
      <Helmet>
        <title>Our Menu | DE BLISS</title>
        <meta name="menu" content="De Bliss menu" />
      </Helmet>
      <Auth />
      <Header />
      <FullMenu />
    </div>
  );
};

export default Menu;
