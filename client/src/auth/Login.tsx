import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Root_State } from "../store/store";
import axios, { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import DOMPurify from "dompurify";
import { SetUserInfo } from "../store/actions/UserAction";
import { BiSupport } from "react-icons/bi";
import { LoginRequest, LogoutRequest } from "../apis/Auth";
const Login = () => {
  const darkMode = useSelector((state: Root_State) => state.theme.darkMode);
  const [isLoading, setIsloading] = useState(false);

  const navigateTo = useNavigate();
  const dispatch = useDispatch();
  const [rememberMe, setRememberMe] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    rememberMe: rememberMe,
  });
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = DOMPurify.sanitize(value);
    setLoginForm({ ...loginForm, [name]: sanitizedValue });
  };
  const handleLogin = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    setIsloading(true);
    try {
      const res = await LoginRequest(loginForm);
      setIsloading(false);
      if (res?.isLocked) {
        toast.error("To many attempts, Try again later!");
        return;
      }
      if (res?.loggedIn && !res.user.banded) {
        localStorage.setItem("token", res.token);
        dispatch(SetUserInfo(res?.user));
        if (res?.twoStepVerification) {
          navigateTo("/cloudpass");
        } else {
          navigateTo("/chat");
        }
      } else if (res?.wrongCredentials) {
        toast.error(res.message);
        return;
      } else if (res?.loggedIn && res?.user.banded) {
        await LogoutRequest();
        navigateTo("/");
        toast.error(
          "You are Baned From using this app. Contact the team Please"
        );
        return;
      } else if (res?.notFound) {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response: AxiosResponse = await axios.get(
          `${import.meta.env.VITE_BACK_END_URL}/api/check-auth`,
          { withCredentials: true }
        );
        if (response.data?.status === 1) {
          setIsAuthenticated(true);
          localStorage.setItem("token", response.data?.token);
          navigateTo("/chat");
        } else {
          navigateTo("/");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.log(error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);
  if (isAuthenticated === null) {
    return (
      <>
        <div className="flex justify-center items-center h-screen bg-[var(--light-dark-color)]">
          <div className="rounded-full h-20 w-20 bg-violet-800 animate-ping"></div>
        </div>
      </>
    );
  }
  return isAuthenticated ? (
    <Navigate to="/chat" replace />
  ) : (
    <section
      className={`bg-gradient-to-r from-blue-100 to-purple-300 flex h-screen justify-center items-center`}
    >
      <div
        className={` md:w-[80%] lg:w-[60%] flex rounded-3xl shadow-2xl   md:mt-0  xl:p-0 `}
      >
        <img
          src="./coffegram.jfif"
          className="w-80 hidden md:flex lg:flex rounded-l-3xl"
          alt="Login illustration"
        />
        <div className="p-6 space-y-6 md:space-y-8 sm:p-10 w-full">
          <h1 className="text-center text-2xl font-semibold leading-tight tracking-tight text-gray-700 ">
            Welcome Back
          </h1>
          <form className="space-y-6 md:space-y-8" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-700 "
              >
                Your email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className={` focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 rounded-full shadow-md block w-full p-3 `}
                placeholder="example@gmail.com"
                required
                onChange={handleChange}
                value={loginForm?.email}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                autoComplete="off"
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className={` focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 rounded-full shadow-md block w-full p-3 `}
                required
                onChange={handleChange}
                value={loginForm?.password}
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    onChange={(e) => setRememberMe(e.target.checked)}
                    id="remember"
                    aria-describedby="remember"
                    type="checkbox"
                    className="rounded-full w-4 h-4 focus:ring-3 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="remember"
                    className="text-gray-500  font-light"
                  >
                    Remember me
                  </label>
                </div>
              </div>
              <Link
                to={"/veri"}
                className="text-sm font-light text-blue-600 hover:underline dark:text-blue-500"
              >
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              className={`${
                darkMode ? "hover:bg-[var(--dark-bg-color)]" : "hover:shadow-lg"
              } w-full transition ease-in-out duration-150 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-full px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700`}
            >
              {isLoading ? (
                <div role="status" className="flex justify-center items-center">
                  <svg
                    aria-hidden="true"
                    className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="text-xl mr-2 ml-4">Loading...</span>
                </div>
              ) : (
                <>Login</>
              )}
            </button>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400 flex justify-between">
              <span>
                {" "}
                Don’t have an account yet?{" "}
                <Link
                  to={"/signup"}
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Sign up
                </Link>
              </span>
              <Link to={"/issuse"} className="flex items-center">
                <BiSupport />
                report issue!
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
