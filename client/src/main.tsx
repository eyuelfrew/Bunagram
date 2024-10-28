import ReactDOM from "react-dom/client";
import "./index.css";
import { HashRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import App from "./App.tsx";
import { SocketProvider } from "./context/SocketContext.tsx";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <SocketProvider>
      <Router>
        <App />
      </Router>
    </SocketProvider>
  </Provider>
);
