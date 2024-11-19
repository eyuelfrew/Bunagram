import axios, { AxiosResponse } from "axios";
import { PiSignOutFill } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import { UseSocket } from "../context/SocketProvider";
import { BiSupport } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";

const Sidebar = () => {
  const { toggleSideBar } = UseSocket();
  const URL = import.meta.env.VITE_BACK_END;
  const navgateTo = useNavigate();
  const LogoutOut = async () => {
    const response: AxiosResponse = await axios.get(`${URL}/api/admin`, {
      withCredentials: true,
    });
    console.log(response.data);
    if (response.data.status === 1) {
      localStorage.clear();
      navgateTo("/");
      return;
    }
    alert(response.data.message);
  };
  return (
    <div
      className={` md:left-0 lg:left-0 fixed top-0  z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0`}
    >
      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 ">
        <a href="" className="flex items-center ps-2.5 mb-5">
          <img src="/bunagram.png" className="h-10 me-3 " alt="" />
          <span className="self-center text-xl font-semibold whitespace-nowrap ">
            Coffegram
          </span>
        </a>
        <ul className="space-y-2 font-medium">
          <li>
            <Link
              to={"/home/stat"}
              onClick={() => toggleSideBar()}
              className="flex items-center p-2  rounded-lg dark:text-white hover:bg-gray-100  group"
            >
              {" "}
              <svg
                className="text-gray-900 flex-shrink-0 w-5 h-5  transition duration-75  group-hover dark:group-hover"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 18 18"
              >
                <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
              </svg>
              <span className="ms-3 text-gray-900">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to={"/home/graphs"}
              onClick={() => toggleSideBar()}
              className="flex items-center p-2  text-gray-900 rounded-lg  hover:bg-gray-100  group"
            >
              <svg
                className="w-5 h-5 text-gray-900  transition duration-75 group-hover dark:group-hover"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 21"
              >
                <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
              </svg>
              <span className="flex-1 ms-3 whitespace-nowrap">Charts</span>
            </Link>
          </li>
          <li>
            <Link
              to={"/home/users"}
              onClick={() => toggleSideBar()}
              className="flex items-center p-2  text-gray-900 rounded-lg  hover:bg-gray-100  group"
            >
              <FaUsers />
              <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
            </Link>
          </li>
          <li>
            <Link
              to={"/home/support"}
              onClick={() => toggleSideBar()}
              className="flex items-center p-2  text-gray-900 rounded-lg  hover:bg-gray-100  group"
            >
              <BiSupport />
              <span className="flex-1 ms-3 whitespace-nowrap">Support</span>
            </Link>
          </li>

          <li>
            <div
              onClick={LogoutOut}
              className=" cursor-pointer flex items-center p-2 text-gray-900 rounded-lg   group"
            >
              <PiSignOutFill />
              <span className="flex-1 ms-3  whitespace-nowrap">Logout</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
