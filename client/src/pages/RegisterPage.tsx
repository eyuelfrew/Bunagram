import { ChangeEvent, FormEvent, useState, MouseEvent } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import uploadFile from "../helpers/UploadImage";
import axios, { AxiosResponse } from "axios";
function RegisterPage() {
  const url = import.meta.env.VITE_BACK_END_URL;
  const navigateTo = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: "",
  });
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    console.log(data);
  };

  const [uploadPhoto, setUploadPhoto] = useState<File | null>(null);

  const handleUploadPhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const uploadPhoto = await uploadFile(file);
      console.log(uploadPhoto);
      setData({ ...data, profile_pic: uploadPhoto?.url });
      setUploadPhoto(file);
    }
  };
  const clearUploadPhoto = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setUploadPhoto(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res: AxiosResponse = await axios.post(`${url}/api/register`, data);
    if (!res.data.error) {
      navigateTo("/");
    } else {
      console.log("Error: ", res.data.message);
    }
  };
  return (
    <div className="flex items-center justify-center">
      <form
        className="w-[30%] bg-gray-900 text-white p-4 rounded-lg"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl text-center text-blue-500">
          Welcome to buna chat
        </h1>
        <div className="flex flex-col mt-8">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="enter your name"
            className="border mx-3 h-10 text-black"
            value={data.name}
            onChange={handleOnChange}
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="enter your email "
            className="border mx-3 h-10 text-black"
            value={data.email}
            onChange={handleOnChange}
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="enter your password"
            className="border mx-3 h-10 text-black"
            value={data.password}
            onChange={handleOnChange}
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="profile_pic">
            Photo:
            <div className="h-10 bg-slate-200 flex justify-center items-center">
              <p className="mr-3 max-w-[300] text-ellipsis line-clamp-1 text-black font-semibold">
                {uploadPhoto && uploadPhoto.name
                  ? uploadPhoto?.name
                  : "upload profile photo"}
              </p>
              {uploadPhoto && uploadPhoto.name && (
                <button
                  className=" text-lg ml-2 hover:text-red-300"
                  onClick={clearUploadPhoto}
                >
                  <IoClose />
                </button>
              )}
            </div>
          </label>
          <input
            type="file"
            id="profile_pic"
            name="profile_pic"
            className="border mx-3 hidden"
            onChange={handleUploadPhoto}
          />
        </div>
        <div className="flex justify-center ">
          <button
            type="submit"
            className="bg-blue-700 mt-3 text-white w-28 p-2 text-lg rounded-xl"
          >
            Resiter
          </button>
        </div>
        <p>
          Already have an account?{" "}
          <Link to={"/email"} className="text-lg">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
