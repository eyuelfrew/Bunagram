import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Root_State } from "../../store/store";
import {
  CloseContactInfo,
  CloseDeleteAccount,
} from "../../store/actions/AccountAction";
import { DeleteUserAccount } from "../../services/API";

const DeleteAccount = () => {
  const dispatch = useDispatch();
  const isDeleteAccount = useSelector(
    (state: Root_State) => state.ContactMenuReducer.isDeleteAccount
  );
  const { _id } = useSelector((state: Root_State) => state.UserReducers);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigateTo = useNavigate();
  const handleDelete = async () => {
    setIsLoading(true);
    const response = await DeleteUserAccount(_id);
    if (response.status == 1) {
      setIsLoading(false);
      await axios.get(`${import.meta.env.VITE_BACK_END_URL}/api/logout`, {
        withCredentials: true,
      });
      dispatch(CloseDeleteAccount());
      dispatch(CloseContactInfo());
      navigateTo("/");
    }
    setIsLoading(false);
  };
  return (
    <>
      {isDeleteAccount && (
        <div
          onClick={() => dispatch(CloseDeleteAccount())}
          className="fixed bg-black opacity-60 h-screen w-full flex justify-center items-center z-[4000]  inset-0 overflow-hidden"
        ></div>
      )}
      <div
        className={`${
          isDeleteAccount ? "" : "hidden"
        } absolute flex w-full justify-center items-center h-screen`}
      >
        <div className="p-3 -mt-40 h-[40%] w-[22%] bg-[var(--light-dark-color)] z-[6000] rounded-md">
          <div className="mt-0">
            <div>
              <h2 className="text-slate-300 text-md">
                Are you sure! you want to{" "}
                <span className="text-red-400">Delete</span> your account!
              </h2>
            </div>
            <span className="text-red-400">action is not reversible!</span>
            <div>
              {isLoading && (
                <div className="flex justify-center">
                  <Loading />
                </div>
              )}
            </div>
          </div>
          <div className="mt-5">
            {!isLoading && (
              <div className="flex justify-end gap-4 mt-14 text-white text-xl">
                <button onClick={() => dispatch(CloseDeleteAccount())}>
                  cancel
                </button>
                <button onClick={handleDelete}>Yes am sure!</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteAccount;

const Loading = () => {
  return (
    <div role="status">
      <span className="sr-only">Deleting...</span>
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
    </div>
  );
};
