import { useDispatch, useSelector } from "react-redux";
import { Root_State } from "../../store/store";
import { CiLogout } from "react-icons/ci";
import axios from "axios";
import { clearReciver } from "../../store/actions/getRecever";
import { ResetLoginState } from "../../store/actions/login";
import { CloseMenu } from "../../store/actions/MenuControllers";
import { ResetUserInfo } from "../../store/actions/UserAction";
import { useNavigate } from "react-router-dom";

const Baned = () => {
  const baned = useSelector((state: Root_State) => state.UserReducers.banded);
  const navigateTo = useNavigate();
  const dispatch = useDispatch();
  const HandleLogout = async () => {
    dispatch(ResetLoginState());
    localStorage.clear();
    const response = await axios.get(
      `${import.meta.env.VITE_BACK_END_URL}/api/logout`,
      {
        withCredentials: true,
      }
    );

    if (response.data?.status === 1) {
      localStorage.clear();
      navigateTo("/");
    }
    dispatch(ResetUserInfo());

    dispatch(CloseMenu());
    dispatch(clearReciver());
  };
  return (
    <>
      {" "}
      {baned && (
        <div className="fixed bg-black opacity-60 h-screen w-full flex justify-center items-center z-[6000]  inset-0 overflow-hidden"></div>
      )}
      <div
        className={`${
          baned ? "" : "hidden"
        } absolute flex w-full justify-center items-center h-screen`}
      >
        <div className="p-3 -mt-40 w-[65%] md:w-[40%] lg:w-[22%] bg-[var(--light-dark-color)] z-[6000] rounded-md">
          <div className="mt-5">
            <div className="flex flex-col">
              <div className="flex justify-center">
                <svg
                  className="w-32"
                  version="1.1"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 512 512"
                  xmlSpace="preserve"
                >
                  <polygon
                    style={{ fill: "#FFA418" }}
                    points="0,477.703 256,477.703 289.391,256 256,34.297 "
                  />
                  <polygon
                    style={{ fill: "#FF8A1E" }}
                    points="256,34.297 256,477.703 512,477.703 "
                  />
                  <g>
                    <circle
                      style={{ fill: "#324860" }}
                      cx="256"
                      cy="405.359"
                      r="16.696"
                    />
                    <rect
                      x="239.304"
                      y="177.185"
                      style={{ fill: "#324860" }}
                      width="33.391"
                      height="178.087"
                    />
                  </g>
                </svg>
              </div>
              <label
                htmlFor="name"
                className=" text-xl text-center text-red-400 font-extralight"
              >
                Account Baned
              </label>
            </div>
            <div className="flex justify-end gap-4 mt-14 text-white text-xl">
              <button
                onClick={HandleLogout}
                className="flex items-center gap-2"
              >
                <CiLogout />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Baned;
