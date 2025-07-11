import { Route, Routes } from "react-router";
import Home from "./routes/Home";
import Menu from "./routes/Menu";
import Cart from "./routes/Cart";
import Orders from "./routes/Orders";
import AdminOrders from "./admin/AdminOrders";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import AdminMenuItems from "./admin/AdminMenuItems/AdminMenuItems";
import CreateRole from "./admin/CreateRole";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/admin">
        <Route index element={<AdminOrders />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="menu" element={<AdminMenuItems />} />
        <Route path="roles" element={<CreateRole />} />
      </Route>
      <Route path="/auth">
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
      </Route>
    </Routes>
  );
};

export default App;
