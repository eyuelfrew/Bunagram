import axios, { AxiosResponse } from "axios";
const URI = import.meta.env.VITE_BACK_END_URL;
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
