import { Link } from "react-router-dom";

const DeleteAccountSuccess = () => {
  return (
    <div className="bg-[var(--light-dark-color)] h-screen flex justify-center items-center">
      <div className="text-center bg-[var(--dark-bg-color)] p-4 max-w-md rounded-2xl">
        <h1 className="text-4xl  text-slate-200">
          Sorry you your bad expriance!
        </h1>
        <div className="mt-5 flex justify-between">
          <Link to={"/signup"} className="mt-4 underline text-white text-xl">
            Sign up
          </Link>
          <Link to={"/signup"} className="mt-4 underline text-white text-xl">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountSuccess;
