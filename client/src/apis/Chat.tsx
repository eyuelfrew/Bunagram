import axios, { AxiosResponse } from "axios";
import { RecevierType } from "../types/Types";
const URI = import.meta.env.VITE_BACK_END_URL;

/**
 *
 * Send Message
 */

export const SendMessage = async (message: {
  reciver_id: string;
  text: string | undefined;
  conversation: string | RecevierType;
}) => {
  const response = await axios.post(`${URI}/api/create-message`, message, {
    withCredentials: true,
  });
  return response;
};
/**
 *
 * Delete Selected Message
 */
export const DeleteSelectedMessages = async (
  selectedMessages: string[],
  conversation_id: string
) => {
  try {
    const response: AxiosResponse = await axios.post(
      `${URI}/api/del-multi-msg`,
      {
        messageIds: selectedMessages,
        conversation_id: conversation_id,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {}
};

/**
 *
 * Fetch All Messges
 *
 */
export const FetchAllMessage = async (reciver_id: string) => {
  try {
    const response: AxiosResponse = await axios.post(
      `${URI}/api/all-messages`,
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

/*****
 **
 Feth All Conversations
 
 *
 **/
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
/**
 *
 * Send Image with caption or with out captions
 *
 */
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

/**
 *
 * Delete Single Message
 */
export const DeleteSingleMessage = async (
  msgId: string,
  reciver_id: string,
  conversation_id: string | RecevierType
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
/**
 *
 * Update Single Message
 *
 */
export const UpdateSingleMessage = async (payload: {
  message: string | undefined;
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
