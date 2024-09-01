export interface SignUpForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export const createUser = (user: SignUpForm) => {
  console.log("User created:", user);
};

export interface FormErrors {
  nameError: string;
  emailError: string;
  passwordError: string;
  confirmPasswordError: string;
}
