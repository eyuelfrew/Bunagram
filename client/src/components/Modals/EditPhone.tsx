import { useDispatch, useSelector } from "react-redux";
import { Root_State } from "../../store/store";
import { CloseEditPhone } from "../../store/actions/AccountAction";

const EditYourNumber = () => {
  const isPhoneEdit = useSelector(
    (state: Root_State) => state.ContactMenuReducer.isPhoneEdit
  );
  const dispatch = useDispatch();

  return (
    <>
      {isPhoneEdit && (
        <div
          onClick={() => dispatch(CloseEditPhone())}
          className="fixed bg-black opacity-60 h-screen w-full flex justify-center items-center z-[6000]  inset-0 overflow-hidden"
        ></div>
      )}
      <div
        className={`${
          isPhoneEdit ? "" : "hidden"
        } absolute flex w-full justify-center items-center h-screen`}
      >
        <div className="p-3 -mt-40 h-[40%] w-[22%] bg-[var(--light-dark-color)] z-[6000] rounded-md">
          <div className="mt-5">
            <div className="flex flex-col">
              <label
                htmlFor="name"
                className=" text-lg text-[20px] text-red-400 font-extralight"
              >
                Editing your phone number requires email verification for
                security issue
              </label>
            </div>
            <div className="flex justify-end gap-4 mt-14 text-white text-xl">
              <button onClick={() => dispatch(CloseEditPhone())}>cancel</button>
              <button>send email</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditYourNumber;
