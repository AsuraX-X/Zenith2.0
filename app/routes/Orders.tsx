import { Helmet } from "react-helmet";
import Header1 from "../components/general/Header1";
import AllOrders from "../components/cart/AllOrders";
import Footer from "../components/general/Footer";

const Orders = () => {
  return (
    <div>
      <Helmet>
        <title>Orders | DE BLISS"</title>
        <meta name="orders" content="Your orders" />
      </Helmet>
      <Header1 />
      <AllOrders />
      <Footer />
    </div>
  );
};

export default Orders;
