import { ChangeEvent, useState } from "react";
import { validateSignUp } from "../controllers/validateSignUp";
import axios, { AxiosResponse } from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FormErrors } from "../model/SignupModel";
import DOMPurify from "dompurify";

interface SignUpForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
const SignUp = () => {
  const navigateTo = useNavigate();
  // user sign up information
  const [form, setSignUpForm] = useState<SignUpForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  //form submition error hundlign states
  const [formErrors, setFormErrors] = useState({
    nameError: "",
    emailError: "",
    passwordError: "",
    confirmPasswordError: "",
  });

  //hundle submiting the sign up form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {
      nameError: validateSignUp("name", form.name, form),
      emailError: validateSignUp("email", form.email, form),
      passwordError: validateSignUp("password", form.password, form),
      confirmPasswordError: validateSignUp(
        "confirmPassword",
        form.confirmPassword,
        form
      ),
    };
    setFormErrors(newErrors);
    const isValid = Object.values(newErrors).every((error) => error === "");
    if (isValid) {
      const response: AxiosResponse = await axios.post(
        `${import.meta.env.VITE_BACK_END_URL}/api/register`,
        form
      );
      if (response.data.status === 1) {
        localStorage.setItem("token", response.data?.token);
        toast.success(
          <div style={{ color: "green" }}>
            <h1>Check Your Email for Verification please</h1>
          </div>
        );
        navigateTo("/verify-email");
      } else if (response.data.status === 0) {
        toast.error(
          <div style={{ color: "red" }}>
            <h1>{response.data.message}</h1>
          </div>
        );
      }
    }
  };

  //handle form change event
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = DOMPurify.sanitize(e.target.value);
    setSignUpForm({ ...form, [e.target.name]: sanitizedValue });
  };
  return (
    <section className="bg-gradient-to-r from-blue-100 to-purple-300 flex h-screen justify-center items-center">
      <div className="flex rounded-3xl shadow-2xl  md:w-[80%] lg:w-[60%]">
        <img
          src="/coffegram.jfif"
          className="w-80 hidden md:flex lg:flex rounded-l-3xl"
          alt="Signup illustration"
        />
        <div className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 p-6 space-y-6 md:space-y-8 rounded-r-3xl text-white">
          <h1 className="text-center text-2xl font-semibold leading-tight tracking-tight">
            Create Account
          </h1>
          <form className="space-y-6 md:space-y-8" onSubmit={handleSubmit}>
            <div>
              <input
                autoComplete="off"
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                className="bg-blue-600/50 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full shadow-md block w-full p-3 text-gray-100 placeholder-gray-300"
                value={form.name}
                onChange={handleChange}
              />
              <p className="text-red-400">{formErrors.nameError}</p>
            </div>
            <div>
              <input
                autoComplete="off"
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="bg-blue-600/50 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full shadow-md block w-full p-3 text-gray-100 placeholder-gray-300"
                value={form.email}
                onChange={handleChange}
              />
              <p className="text-red-400">{formErrors.emailError}</p>
            </div>
            <div>
              <input
                autoComplete="off"
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                className="bg-blue-600/50 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full shadow-md block w-full p-3 text-gray-100 placeholder-gray-300"
                value={form.password}
                onChange={handleChange}
              />
              <p className="text-red-400">{formErrors.passwordError}</p>
            </div>
            <div>
              <input
                autoComplete="off"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                className="bg-blue-600/50 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full shadow-md block w-full p-3 text-gray-100 placeholder-gray-300"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              <p className="text-red-400">{formErrors.confirmPasswordError}</p>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full bg-white/10 text-white font-medium rounded-full px-5 py-3 text-center transition ease-in-out duration-150 hover:bg-white/20"
              >
                Register
              </button>
            </div>
            <p className="text-sm font-light">
              Already have an account?{" "}
              <Link
                to={"/"}
                className="font-medium text-blue-300 hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
