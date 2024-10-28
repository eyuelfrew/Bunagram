import axios, { Axios, AxiosResponse } from "axios";

const URI = import.meta.env.VITE_BACK_END_URL;

/*
--- unblock user end point
*/
export const UnblockUser = async (payload: {
  blocker_id: string;
  blocked_id: string;
}) => {
  try {
    const response: AxiosResponse = await axios.post(
      `${URI}/api/unblock-user`,
      payload,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
/*
--- block user end point
*/
export const BlockUser = async (payload: { blocked_id: string }) => {
  try {
    const response: AxiosResponse = await axios.post(
      `${URI}/api/block-user`,
      payload,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
/*
--- fetch blocked users
*/
export const FetchBlockedUsers = async () => {
  try {
    const resposne: AxiosResponse = await axios.get(
      `${URI}/api/blocked-users`,
      {
        withCredentials: true,
      }
    );
    return resposne.data;
  } catch (error) {
    console.log(error);
  }
};
