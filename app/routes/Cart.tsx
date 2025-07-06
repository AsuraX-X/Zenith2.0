import { Helmet } from "react-helmet";
import Header from "../components/general/Header";
import CartContent from "../components/cart/CartContent";
import Footer from "../components/general/Footer";
import { ScheduleProvider } from "../Context/ScheduleContext";

const Cart = () => {
  return (
    <ScheduleProvider>
      <div>
        <Helmet>
          <title>Cart | DE BLISS"</title>
          <meta name="cart" content="Your Cart" />
        </Helmet>
        <Header />
        <CartContent />
        <Footer />
      </div>
    </ScheduleProvider>
  );
};

export default Cart;
