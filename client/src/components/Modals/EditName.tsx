import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { Root_State } from "../../store/store";
import { CloseEditName } from "../../store/actions/AccountAction";
import { SetUserInfo } from "../../store/actions/UserAction";

const EditName = () => {
  const isEditName = useSelector(
    (state: Root_State) => state.ContactMenuReducer.isEditNameOpen
  );
  const { name, _id } = useSelector((state: Root_State) => state.UserReducers);
  const [fullname, setFullName] = useState<string>("");
  const dispatch = useDispatch();
  useEffect(() => {
    setFullName(name);
  }, [name]);

  const handleChage = (e: ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
  };

  const handleSave = async () => {
    const paylaod = {
      _id: _id,
      name: fullname,
    };
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACK_END_URL}/api/update-name`,
        paylaod,
        { withCredentials: true }
      );
      if (response.data?.status === 1) {
        dispatch(SetUserInfo(response.data?.user));
        dispatch(CloseEditName());
      }
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseModal = () => {
    setFullName(name);
    dispatch(CloseEditName());
  };
  return (
    <>
      {isEditName && (
        <div
          onClick={() => dispatch(CloseEditName())}
          className="fixed bg-black opacity-60 h-screen w-full flex justify-center items-center z-[4000]  inset-0 overflow-hidden"
        ></div>
      )}
      <div
        className={`${
          isEditName ? "" : "hidden"
        } absolute flex w-full justify-center items-center h-screen`}
      >
        <div className="p-3 -mt-40 h-[40%] w-[22%] bg-[var(--light-dark-color)] z-[6000] rounded-md">
          <h1 className="text-slate-200 text-center text-xl font-light">
            Edit Your Name
          </h1>
          <div className="mt-5">
            <div className="flex flex-col">
              <label
                htmlFor="name"
                className=" text-lg text-[20px] text-slate-200 font-extralight"
              >
                your name
              </label>
              <input
                required
                value={fullname}
                onChange={handleChage}
                name="name"
                type="text"
                className="px-4 text-xl h-10 bg-[var(--message-bg)] focus:outline-none text-slate-200"
              />
            </div>
            <div className="flex justify-end gap-4 mt-14 text-white text-xl">
              <button onClick={handleCloseModal}>cancel</button>
              <button onClick={handleSave}>save</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditName;
