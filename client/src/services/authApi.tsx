import axios, { AxiosResponse } from "axios";
const URI = import.meta.env.VITE_BACK_END_URL;
/*
-- User login
*/
export const LoginRequest = async (payload: {
  email: string;
  password: string;
  rememberMe: boolean;
}) => {
  try {
    const response: AxiosResponse = await axios.post(
      `${URI}/api/login`,
      payload,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
/*
-- Logout 
*/
export const LogoutRequest = async () => {
  try {
    const response: AxiosResponse = await axios.get(
      `${import.meta.env.VITE_BACK_END_URL}/api/logout`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
