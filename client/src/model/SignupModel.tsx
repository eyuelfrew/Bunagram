export interface SignUpForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface FormErrors {
  nameError: string;
  emailError: string;
  passwordError: string;
  confirmPasswordError: string;
}
