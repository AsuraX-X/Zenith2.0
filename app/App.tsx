import { Route, Routes } from "react-router";
import Home from "./routes/Home";
import Menu from "./routes/Menu";
import Orders from "./routes/Orders";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/orders" element={<Orders />} />
    </Routes>
  );
};

export default App;
