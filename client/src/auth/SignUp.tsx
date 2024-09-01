import { ChangeEvent, useState } from "react";
import { validateSignUp } from "../controllers/validateSignUp";
import axios, { AxiosResponse } from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FormErrors } from "../model/SignupModel";

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
    setSignUpForm({ ...form, [e.target.name]: e.target.value });
  };
  return (
    <div className="flex h-screen items-center justify-center bg-[var(--dark-bg-color)]">
      <form
        className="flex flex-col gap-4 w-[30%] bg-[var(--light-dark-color)]  text-white p-4 rounded-lg"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl text-center font-light text-gray-500 dark:text-gray-400">
          Create Account
        </h1>
        <div className="flex flex-col ">
          <input
            autoComplete="off"
            type="text"
            id="name"
            name="name"
            placeholder="enter your name"
            className="bg-[var(--hard-dark)] border-0 mx-3 h-12 text-gray-400 px-4 rounded-3xl focus:outline-none"
            value={form.name}
            onChange={handleChange}
          />
          <p className="text-red-400">{formErrors.nameError}</p>
        </div>
        <div className="flex flex-col">
          <input
            autoComplete="off"
            id="email"
            name="email"
            placeholder="enter your email "
            className="bg-[var(--hard-dark)]  mx-3 h-12 text-gray-400  px-4 rounded-3xl focus:outline-none"
            value={form.email}
            onChange={handleChange}
          />
          <p className="text-red-400">{formErrors.emailError}</p>
        </div>
        <div className="flex flex-col">
          <input
            autoComplete="off"
            type="password"
            id="password"
            name="password"
            placeholder="enter your password"
            className="bg-[var(--hard-dark)]  mx-3 h-12 text-gray-400  px-4 rounded-3xl focus:outline-none"
            value={form.password}
            onChange={handleChange}
          />
          <p className="text-red-400">{formErrors.passwordError}</p>
        </div>
        <div className="flex flex-col">
          <input
            autoComplete="off"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="enter your password"
            className="bg-[var(--hard-dark)]  mx-3 h-12 text-gray-400  px-4 rounded-3xl focus:outline-none"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          <p className="text-red-400">{formErrors.confirmPasswordError}</p>
        </div>
        <div className="flex justify-center ">
          <button
            type="submit"
            className={`hover:bg-[var(--hard-dark)]  text-white w-28 p-2 text-lg rounded-xl `}
          >
            Resiter
          </button>
        </div>
        <p className="font-light text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link to={"/"} className=" font-bold hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
