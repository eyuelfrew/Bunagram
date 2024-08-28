import { createBrowserRouter, RouteObject } from "react-router-dom";
import App from "../App";
import RegisterPage from "../pages/RegisterPage";

import Home from "../pages/Home";
import AuthLayout from "../layout/AuthLayout";
import LoginPage from "../pages/LoginPage";
import ChatBox from "../components/ChatBox";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <AuthLayout childers={<RegisterPage />}></AuthLayout>,
      },
      {
        path: "chat",
        element: <Home />,
        children: [
          {
            path: "/chat/message",
            element: <ChatBox />,
          },
        ],
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
