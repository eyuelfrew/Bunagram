import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./auth/Login";
import Home from "./pages/Home";
import ChatBox from "./components/ChatBox";
function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/chat" element={<Layout />}>
          <Route path="message" element={<ChatBox />}></Route>
        </Route>
      </Routes>
    </main>
  );
}
const Layout = () => {
  return (
    <div>
      <Home />
    </div>
  );
};
export default App;
