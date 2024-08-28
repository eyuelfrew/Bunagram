import { MdCancel } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Root_State } from "../store/store";
import { CloseMenu } from "../store/actions/MenuControllers";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { logoutAction } from "../store/actions/login";
import { clearReciver } from "../store/actions/getRecever";
const MenuLayout = () => {
  const navigateTo = useNavigate();
  const dispatch = useDispatch();
  const menuBar = useSelector((state: Root_State) => state.menuReducer.isView);
  const handleMenuCancel = () => {
    dispatch(CloseMenu());
  };
  const HandleLogout = async () => {
    dispatch(logoutAction());

    localStorage.clear();
    await axios.get("http://localhost:5000/api/logout", {
      withCredentials: true,
    });
    navigateTo("/");
    dispatch(CloseMenu());
    dispatch(clearReciver());
  };

  return (
    <>
      {menuBar && (
        <div
          onClick={handleMenuCancel}
          className="z-[3000] fixed inset-0 bg-black opacity-60"
        ></div>
      )}
      <div
        className={`${
          menuBar ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out absolute z-[3000] bg-[var(--medium-dard)] w-[25%]  h-screen p-3 text-white`}
      >
        <div className="flex justify-between items-center">
          <div className="">
            <img
              className="w-16 rounded-full"
              src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOtu74pEiq7ofeQeTsco0migV16zZoBwSlGg&s`}
              alt=""
            />
            <p className="text-xl">Eyuel Frew</p>
          </div>
          <div>
            <button onClick={handleMenuCancel}>
              {" "}
              <MdCancel size={30} />
            </button>
          </div>
        </div>
        <div className=" mt-">
          <button
            onClick={HandleLogout}
            className="w-full text-white bg-[var(--dark-bg-color)] p-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default MenuLayout;
