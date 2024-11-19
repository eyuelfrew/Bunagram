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

/*
 ** check if user is already loged and the token not expred
 */
export const CheckAuth = async () => {
  try {
    const response: AxiosResponse = await axios.get(
      `${import.meta.env.VITE_BACK_END_URL}/api/check-auth`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

/*
 * Two Step Password (Cloud Password )
 */
export const CloudPasswordLogin = async (password: string) => {
  try {
    const response = await axios.post(
      `${URI}/api/verify-cloud-password`,
      { cloud_password: password },
      { withCredentials: true }
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
/****
 *
 *  Verify Email
 *
 */
export const VerifyEmail = async (verification_code: string) => {
  try {
    const response: AxiosResponse = await axios.post(
      `${import.meta.env.VITE_BACK_END_URL}/api/verify-email`,
      { verification_code },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
/**
 *
 *  Reset Passwod
 * **/
export const ResetPassword = async (password: string) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACK_END_URL}/api/reset-password`,
      {
        password,
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
/**
 *
 * Delete Account
 *
 */
export const DeleteUserAccount = async (userId: string) => {
  try {
    const response = await axios.delete(`${URI}/api/del-acc/${userId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
/**
 *
 * Chagne Cloud Password
 *
 */
export const ChagneCloudPass = async (
  password: string,
  hint: string,
  email: string
) => {
  const payload = {
    password: password,
    hint: hint,
    email: email,
  };
  const response: AxiosResponse = await axios.post(
    `${URI}/api/change-cloud-pass`,
    payload,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const VerifyCloudPassword = async (cloudPassword: string) => {
  const payload = {
    cloud_password: cloudPassword,
  };
  try {
    const response: AxiosResponse = await axios.post(
      `${URI}/api/verify-cloud-password`,
      payload,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
