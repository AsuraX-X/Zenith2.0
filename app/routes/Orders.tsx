import { Helmet } from "react-helmet";
import Header1 from "../components/general/Header1";
import AllOrders from "../components/cart/AllOrders";
import Footer from "../components/general/Footer";
import { ScheduleProvider } from "../Context/ScheduleContext";

const Orders = () => {
  return (
    <ScheduleProvider>
      <div>
        <Helmet>
          <title>Orders | DE BLISS"</title>
          <meta name="orders" content="Your orders" />
        </Helmet>
        <Header1 />
        <AllOrders />
        <Footer />
      </div>
    </ScheduleProvider>
  );
};

export default Orders;
