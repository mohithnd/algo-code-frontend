import "./index.css";

import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { SocketProvider } from "./contexts/SocketContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <SocketProvider>
      <App />
    </SocketProvider>
  </BrowserRouter>
);
