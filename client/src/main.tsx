import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import App from "./App.tsx";
import { SocketProvider } from "./context/SocketContext.tsx";
import { StrictMode } from "react";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SocketProvider>
    </Provider>
  </StrictMode>
);
