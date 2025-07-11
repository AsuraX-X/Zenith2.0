import { Helmet } from "react-helmet";
import Header from "../components/general/Header";
import OrderContent from "../components/order/OrderContent";

const Orders = () => {
  return (
    <div>
      <Helmet>
        <title>Orders | DE BLISS</title>
        <meta name="orders" content="Your orders" />
      </Helmet>
      <Header />
      <OrderContent />
    </div>
  );
};

export default Orders;
