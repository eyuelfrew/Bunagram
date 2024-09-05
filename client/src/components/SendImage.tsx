import { MdOutlineAttachFile } from "react-icons/md";
import PreviewComponent from "./Modals/PreviewComponent";
import { useState } from "react";
import uploadFile from "../helpers/UploadImage";
import { UseSocket } from "../context/SocketContext";
import { useSelector } from "react-redux";
import { Root_State } from "../store/store";

const SendImage = () => {
  const { socket } = UseSocket();
  const [isLoading, setIsLoading] = useState(false);
  const Recever = useSelector((state: Root_State) => state.receiverReducer);
  const user = useSelector((state: Root_State) => state.UserReducers);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [caption, setCaption] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };
  const handleClosePreview = () => {
    setSelectedFile(null);
    setPreview("");
    setCaption("");
  };
  const handleSend = async () => {
    if (selectedFile) {
      setIsLoading(true);
      const uploadResponse = await uploadFile(selectedFile);
      console.log(uploadResponse);
      if (socket) {
        socket.emit("newmessage", {
          sender: user?._id,
          receiver: Recever.recever_id,
          text: caption,
          msgByUserId: user?._id,
          imageURL: uploadResponse.secure_url,
          conversation_id: Recever.conversation_id || "",
        });
      }
      setSelectedFile(null);
      setPreview("");
      setCaption("");
    }
  };
  return (
    <>
      <label
        htmlFor="send_pic"
        className="hover:bg-slate-800 p-3 cursor-pointer rounded-full"
      >
        <MdOutlineAttachFile size={30} className="text-white" />
        <input
          className="hidden"
          onChange={handleImageChange}
          type="file"
          id="send_pic"
          accept="image/*"
        />
      </label>
      {selectedFile && (
        <PreviewComponent
          preview={preview}
          file={selectedFile}
          caption={caption}
          onCaptionChange={setCaption}
          onClose={handleClosePreview}
          onSend={handleSend}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default SendImage;
