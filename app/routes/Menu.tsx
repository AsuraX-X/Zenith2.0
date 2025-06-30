import { Helmet } from "react-helmet";
import Auth from "../auth/Auth";
import Header1 from "../components/general/Header1";
import FullMenu from "../components/menu/FullMenu";

const Menu = () => {
  return (
    <div className="mt-20">
      <Helmet>
        <title>Our Menu | DE BLISS</title>
        <meta name="menu" content="De Bliss menu" />
      </Helmet>
      <Auth />
      <Header1 />
      <FullMenu />
    </div>
  );
};

export default Menu;
