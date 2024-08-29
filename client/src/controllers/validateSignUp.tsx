import { SignUpForm } from "../models/SignupModel";

export const validateSignUp = (
  name: string,
  value: string,
  form: SignUpForm
): string => {
  switch (name) {
    case "name":
      if (!value) return "Name is required";
      return "";
    case "email":
      if (!value) return "Email is required";
      // eslint-disable-next-line no-case-declarations
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Invalid email address";
      return "";
    case "password":
      if (!value) return "Password is required";
      if (value.length < 6) return "Password must be at least 6 characters";
      return "";
    case "confirmPassword":
      if (!value) return "Confirm password is required";
      if (value !== form.password) return "Passwords do not match";
      return "";
    default:
      return "";
  }
};
