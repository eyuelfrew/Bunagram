import axios, { AxiosResponse } from "axios";
import { Recevier } from "../types/Types";
const URI = import.meta.env.VITE_BACK_END_URL;
export const SendMessage = async (message: {
  reciver_id: string;
  text: string;
  conversation: string | Recevier;
}) => {
  const response = await axios.post(`${URI}/api/create-message`, message, {
    withCredentials: true,
  });
  return response;
};
export const SendCaption = async (formData: FormData) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/create-caption",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const FetchConversations = async () => {
  try {
    const response: AxiosResponse = await axios.get(
      `${URI}/api/conversations`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

/*
-- delete single message
*/
export const DeleteSingleMessage = async (
  msgId: string,
  reciver_id: string,
  conversation_id: string | Recevier
) => {
  const paylaod = {
    message_id: msgId,
    reciver_id: reciver_id,
    conversation_id: conversation_id,
  };
  try {
    await axios.post(`${URI}/api/del-msg`, paylaod, { withCredentials: true });
  } catch (error) {
    console.log(error);
  }
};
/*
--- Update Single Message
*/
export const UpdateSingleMessage = async (payload: {
  message: string;
  reciver_id: string;
  message_id: string | undefined;
}) => {
  try {
    await axios.post(`${URI}/api/update-msg`, payload, {
      withCredentials: true,
    });
  } catch (error) {
    console.log(error);
  }
};
