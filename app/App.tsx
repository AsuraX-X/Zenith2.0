import { Route, Routes } from "react-router";
import Home from "./routes/Home";
import Menu from "./routes/Menu";
import Cart from "./routes/Cart";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/cart" element={<Cart />} />
    </Routes>
  );
};

export default App;
