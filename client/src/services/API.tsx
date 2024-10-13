import axios from "axios";
import { Recevier } from "../types/Types";
const URI = import.meta.env.VITE_BACK_END_URL;
export const SendMessage = async (message: {
  reciver_id: string;
  text: string;
  conversation: string | Recevier;
}) => {
  console.log(message.text);
  const response = await axios.post(`${URI}/api/create-message`, message, {
    withCredentials: true,
  });
  console.log("test");
  console.log(response);
  console.log(response.data);
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
