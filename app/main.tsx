import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import { PopUpProvider } from "./Context/PopUpContext";
import { AuthProvider } from "./Context/AuthContext";

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(
    <BrowserRouter>
      <PopUpProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </PopUpProvider>
    </BrowserRouter>
  );
} else {
  throw new Error("Root element not found");
}
