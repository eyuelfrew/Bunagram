import { useDispatch, useSelector } from "react-redux";

import { useEffect, useState, useCallback } from "react";
import axios, { AxiosResponse } from "axios";
import { debounce } from "lodash";
import { SetUserInfo } from "../../store/actions/UserAction";
import { Root_State } from "../../store/store";
import { CloseEditUserName } from "../../store/actions/AccountAction";
const EditUserName = () => {
  const { user_name, _id } = useSelector(
    (state: Root_State) => state.UserReducers
  );
  const [username, setUserName] = useState<string>("");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const isUserNameEdit = useSelector(
    (state: Root_State) => state.ContactMenuReducer.isUserNameEdit
  );
  const dispatch = useDispatch();

  // Validation function
  const validateUsername = (name: string) => {
    const regex = /^[a-zA-Z0-9_.]{5,20}$/;
    if (!regex.test(name)) {
      setError(
        "Username must be 5-20 characters long and can include letters, numbers, underscores, or periods."
      );
      return false;
    }
    setError("");
    return true;
  };

  const checkUsernameAvailability = async (username: string) => {
    console.log("User Name Check");
    const payload = { user_name: username };
    try {
      setLoading(true);
      const response: AxiosResponse = await axios.post(
        `${import.meta.env.VITE_BACK_END_URL}/api/check-user-name`,
        payload
      );
      setIsAvailable(response.data.available);
      return response.data;
    } catch (error) {
      console.error("Error checking username availability:", error);
      setIsAvailable(false);
      setError("Error checking username availability.");
    } finally {
      setLoading(false);
    }
  };

  // Debounced version of the username check
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedCheckUsernameAvailability = useCallback(
    debounce(checkUsernameAvailability, 300),
    []
  );

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setUserName(name);

    if (validateUsername(name)) {
      debouncedCheckUsernameAvailability(name);
    } else {
      setIsAvailable(null);
    }
  };

  const handleSave = async () => {
    const payload = { _id, user_name: username };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACK_END_URL}/api/update-user-name`,
        payload,
        { withCredentials: true }
      );
      dispatch(SetUserInfo(response.data?.user));
      dispatch(CloseEditUserName());
      setIsAvailable(null);
    } catch (error) {
      console.log("Error saving username:", error);
      setError("Failed to update username.");
    }
  };

  useEffect(() => {
    setUserName(user_name || ""); // Ensure default to an empty string if user_name is undefined
  }, [user_name]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") {
      e.preventDefault(); // Prevent adding a space
    }
  };

  const handleCloseModal = () => {
    setUserName(user_name || ""); // Ensure it is an empty string
    dispatch(CloseEditUserName());
  };

  return (
    <>
      {isUserNameEdit && (
        <div
          onClick={() => dispatch(CloseEditUserName())}
          className="fixed bg-black opacity-60 h-screen w-full flex justify-center items-center z-[6000] inset-0 overflow-hidden"
        ></div>
      )}
      <div
        className={`${
          isUserNameEdit ? "" : "hidden"
        } absolute flex w-full justify-center items-center h-screen`}
      >
        <div className="p-3 -mt-40 h-[40%] w-[22%] bg-[var(--light-dark-color)] z-[6000] rounded-md">
          <h1 className="text-slate-200 text-center text-xl font-light">
            Edit Username
          </h1>

          <div className="mt-5">
            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="text-lg text-[20px] text-slate-200 font-extralight"
              >
                @username
              </label>
              <input
                onKeyDown={handleKeyDown}
                type="text"
                value={username}
                onChange={handleChange}
                className="rounded-xl px-4 text-xl h-10 bg-[var(--message-bg)] focus:outline-none text-slate-200"
              />
              {error && <div className="text-red-500">{error}</div>}
              {loading && (
                <div className="text-blue-500">Checking availability...</div>
              )}
              {isAvailable !== null && (
                <div
                  className={`${
                    isAvailable ? "text-green-500" : "text-red-500"
                  } mt-2`}
                >
                  {isAvailable ? "Username is available" : "Username is taken"}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-4 mt-14 text-white text-xl">
              <button onClick={handleCloseModal}>Cancel</button>
              <button
                onClick={handleSave}
                // disabled={!isAvailable || !username || error}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditUserName;
