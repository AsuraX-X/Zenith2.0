import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import { PopUpProvider } from "./Context/PopUpContext";
import { AuthProvider } from "./Context/AuthContext";
import { UserProvider } from "./Context/UserContext";
import { CartProvider } from "./Context/CartContext";
import { LocationProvider } from "./Context/LocationContext";

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(
    <BrowserRouter>
      <PopUpProvider>
        <AuthProvider>
          <UserProvider>
            <LocationProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </LocationProvider>
          </UserProvider>
        </AuthProvider>
      </PopUpProvider>
    </BrowserRouter>
  );
} else {
  throw new Error("Root element not found");
}
