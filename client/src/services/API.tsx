import axios, { AxiosResponse } from "axios";
import { Recevier } from "../types/Types";
const URI = import.meta.env.VITE_BACK_END_URL;

/*fetch message*/
export const FetchAllMessage = async (reciver_id: string) => {
  try {
    const response: AxiosResponse = await axios.post(
      `${import.meta.env.VITE_BACK_END_URL}/api/all-messages`,
      {
        reciver_id: reciver_id,
      },
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
-- send message
*/
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
    const response = await axios.post(`${URI}/api/create-caption`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
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

/*
---- Verify cloud password
*/
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
/*---
----- Change Cloud Password
-----*/
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
/*
-- Upload Profile Picture
*/
export const UploadProfile = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    const response = await axios.post(`${URI}/api/profile-pic`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
/*
-- Delete Conversation
*/
export const DeleteConversation = async (payload: {
  reciver_id: string;
  conversation_id: string;
}) => {
  const response: AxiosResponse = await axios.post(
    `${URI}/api/delete-conversation`,
    payload,
    { withCredentials: true }
  );
  return response.data;
};
/*
-- Delete Account 
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

/*
-- Clear chats
*/
export const ClearChats = async (conversation_id: string) => {
  const payload = {
    conversation_id: conversation_id,
  };
  try {
    const response: AxiosResponse = await axios.post(
      `${URI}/api/delete-all-msg`,
      payload,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
