import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./auth/Login";
import Home from "./pages/Home";
// import { useEffect, useState } from "react";
// import axios, { AxiosResponse } from "axios";
import SignUp from "./auth/SignUp";
import VerifyAccount from "./auth/VerifyAccount";
import { Toaster } from "react-hot-toast";
import DeleteAccountSuccess from "./pages/DeleteAccountSuccess";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import CloudPassword from "./pages/CloudPassword";

// const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
//   const navigateTo = useNavigate();
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const response: AxiosResponse = await axios.get(
//           `${import.meta.env.VITE_BACK_END_URL}/api/check-auth`,
//           { withCredentials: true }
//         );
//         if (response.data?.status === 1) {
//           setIsAuthenticated(true);
//           navigateTo("/chat");
//         } else {
//           navigateTo("/");
//           setIsAuthenticated(false);
//         }

//         // dispatch(SetUserInfo(user));
//         setIsAuthenticated(response.data.status === 1);
//       } catch (error) {
//         // console.error("Auth check failed:", error);
//         setIsAuthenticated(false);
//       }
//     };

//     checkAuth();
//   }, []);

// if (isAuthenticated === null) {
//   return (
//     <div className="flex justify-center items-center h-screen bg-[var(--light-dark-color)]">
//       <div className="rounded-full h-20 w-20 bg-violet-800 animate-ping"></div>
//     </div>
//   );
// }

// return isAuthenticated ? children : <Navigate to="/" replace />;
// };

function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />}></Route>

        <Route path="/chat" element={<Home />} />
        <Route path="/verify-email" element={<VerifyAccount />}></Route>
        <Route path="/user-sorry" element={<DeleteAccountSuccess />}></Route>
        <Route path="/cloudpass" element={<CloudPassword />}></Route>
        <Route path="/veri" element={<ForgotPassword />}></Route>
        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        ></Route>
      </Routes>
      <Toaster />
    </main>
  );
}

export default App;
